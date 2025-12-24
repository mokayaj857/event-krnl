require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');
const mongoose = require('mongoose');
const IntaSend = require('intasend-node');
const africastalking = require('africastalking');
const connectDB = require('./backend/db');

const app = express();

// Behind ngrok or any reverse proxy we need to trust the forwarded headers
// so express-rate-limit can extract the correct IP safely.
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => ipKeyGenerator(req, res),
});
app.use(limiter);

const ticketSchema = new mongoose.Schema({
  phoneNumber: String,
  eventId: String,
  eventName: String,
  price: Number,
  ticketCode: String,
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now },
});
const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);

const EVENTS = {
  Nairobi: [
    { id: 'E1', name: 'Nairobi Tech Fest', price: 250 },
    { id: 'E2', name: 'City Concert', price: 350 },
  ],
  Kiambu: [{ id: 'E3', name: 'Kiambu Expo', price: 150 }],
  Kisumu: [{ id: 'E4', name: 'Kisumu Music Night', price: 200 }],
  Mombasa: [{ id: 'E5', name: 'Mombasa Beach Party', price: 500 }],
};

const EVENT_MAP = {
  '1': EVENTS.Nairobi[0],
  '2': EVENTS.Nairobi[1],
  '3': EVENTS.Kiambu[0],
  '4': EVENTS.Kisumu[0],
  '5': EVENTS.Mombasa[0],
};

const intaSend = new IntaSend(
  process.env.INTASEND_PUBLIC_KEY,
  process.env.INTASEND_PRIVATE_KEY,
  process.env.INTASEND_ENV !== 'live' // true = sandbox
);

// Optional SMS client for session summaries; logs and skips if credentials are missing.
const smsClient = (() => {
  if (!process.env.AFRICASTALKING_API_KEY || !process.env.AFRICASTALKING_USERNAME) {
    console.warn('⚠️ Africa\'s Talking SMS disabled: missing AFRICASTALKING_API_KEY or AFRICASTALKING_USERNAME');
    return null;
  }
  return africastalking({
    apiKey: process.env.AFRICASTALKING_API_KEY,
    username: process.env.AFRICASTALKING_USERNAME,
  }).SMS;
})();

function extractFinalMessage(responseText) {
  if (!responseText || !responseText.startsWith('END')) return null;
  return responseText.replace(/^END\s*/, '').trim();
}

async function sendSessionSms(phoneNumber, message) {
  if (!smsClient) return;
  if (!phoneNumber) {
    console.warn('⚠️ Skipping session SMS: missing phone number');
    return;
  }

  try {
    await smsClient.send({ to: phoneNumber, message });
    console.log('📩 Sent session SMS to', phoneNumber);
  } catch (err) {
    console.error('❌ Failed to send session SMS:', err.message);
  }
}

async function initiateStkPush(phoneNumber, amount, metadata = {}) {
  // IntaSend M-Pesa STK push
  const collection = intaSend.collection();
  const payload = {
    amount,
    phone_number: phoneNumber,
    narrative: metadata.transactionDesc || 'Event Ticket',
    api_ref: metadata.accountRef || `ticket-${Date.now()}`,
    currency: 'KES',
  };

  const res = await collection.mpesaStkPush(payload);
  console.log('IntaSend STK response:', res);
  return res;
}

app.post('/ussd', async (req, res) => {
  try {
    const { phoneNumber, text = '' } = req.body;
    const steps = text ? text.split('*') : [];

    let response = '';

    if (!phoneNumber) {
      response = 'END Missing phone number';
    } else if (text === '') {
      response = `CON Welcome to AVARA
1. Buy Ticket
2. My Tickets
3. Wallet
4. Events Near Me
5. Support
0. Exit`;
    } else if (steps[0] === '1') {
      if (steps.length === 1) {
        response = `CON Select Event:
1. Nairobi Tech Fest (250)
2. City Concert (350)
3. Kiambu Expo (150)
4. Kisumu Music Night (200)
5. Mombasa Beach Party (500)
0. Back`;
      } else if (steps.length === 2) {
        const event = EVENT_MAP[steps[1]];
        response = event
          ? `CON ${event.name}
Price: ${event.price} KES
1. Pay with M-Pesa
0. Cancel`
          : 'END Invalid option.';
      } else if (steps.length === 3 && steps[2] === '1') {
        const event = EVENT_MAP[steps[1]];
        if (!event) {
          response = 'END Invalid option.';
        } else {
          try {
            await initiateStkPush(phoneNumber, event.price, {
              accountRef: event.name,
              transactionDesc: 'Event Ticket',
            });

            const ticketCode = Math.floor(10000 + Math.random() * 90000).toString();

            await Ticket.create({
              phoneNumber,
              eventId: event.id,
              eventName: event.name,
              price: event.price,
              ticketCode,
            });

            response = `END Payment initiated.
Your Ticket Code: ${ticketCode}`;
          } catch (err) {
            console.error('Failed to process payment:', err);
            response = 'END Payment failed. Try again.';
          }
        }
      }
    } else if (steps[0] === '2') {
      const tickets = await Ticket.find({ phoneNumber }).lean();

      if (tickets.length === 0) {
        response = 'END You have no tickets.';
      } else {
        const list = tickets.map((t) => `${t.eventName} - ${t.ticketCode}`).join('\n');
        response = `END Your Tickets:\n${list}`;
      }
    } else if (steps[0] === '3') {
      if (steps.length === 1) {
        response = `CON Wallet
1. Balance
2. Deposit
3. Withdraw
0. Back`;
      } else if (steps[1] === '1') {
        response = 'END Your balance is 0 KES';
      } else if (steps[1] === '2') {
        response = `END Send money to Paybill 412345
Acc: Your Phone Number`;
      } else if (steps[1] === '3') {
        response = 'END Withdrawal sent to M-Pesa';
      }
    } else if (steps[0] === '4') {
      if (steps.length === 1) {
        response = `CON Select Region:
1. Nairobi
2. Kiambu
3. Kisumu
4. Mombasa
0. Back`;
      } else if (steps.length === 2) {
        const regionMap = { '1': 'Nairobi', '2': 'Kiambu', '3': 'Kisumu', '4': 'Mombasa' };
        const region = regionMap[steps[1]];

        if (!region) {
          response = 'END Invalid region.';
        } else {
          const evts = EVENTS[region].map((e) => `${e.name} - ${e.price} KES`).join('\n');
          response = `END Events in ${region}:\n${evts}`;
        }
      }
    } else if (steps[0] === '5') {
      if (steps.length === 1) {
        response = `CON Support
1. Request Call-Back
2. Report Issue
0. Back`;
      } else if (steps[1] === '1') {
        response = 'END We will call you shortly.';
      } else if (steps[1] === '2') {
        response = 'END Issue reported. Thank you.';
      }
    } else if (steps[0] === '0') {
      response = 'END Thank you for using AVARA';
    } else {
      response = 'END Invalid option';
    }

    res.set('Content-Type', 'text/plain');
    const finalMessage = extractFinalMessage(response);
    if (finalMessage) {
      // Send SMS and await to ensure it completes
      await sendSessionSms(phoneNumber, finalMessage);
    }
    res.send(response);
  } catch (err) {
    console.error('USSD route error:', err);
    res.set('Content-Type', 'text/plain');
    res.send('END Something went wrong. Try again.');
  }
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const PORT = Number(process.env.PORT) || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/event-vax';

(async () => {
  await connectDB(MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`✅ Server ready on port ${PORT}`);
  });
})();

process.on('unhandledRejection', (err) => {
  console.error('Unhandled promise rejection:', err);
});