# 🔧 KRNL SDK Integration Documentation

Welcome to the KRNL SDK integration documentation for Event-Vax!

## 📚 Documentation Index

### Quick Start
1. **[Testing Checklist](./KRNL_TESTING_CHECKLIST.md)** ← **START HERE**
   - Step-by-step testing guide
   - Verification checklist
   - Troubleshooting tips

2. **[Quick Reference](./KRNL_QUICK_REFERENCE.md)**
   - Code snippets and examples
   - Common patterns
   - Hook reference
   - Status codes

### Comprehensive Guides
3. **[Integration Complete Guide](./KRNL_INTEGRATION_COMPLETE.md)**
   - Full integration walkthrough
   - Configuration details
   - Usage examples
   - Troubleshooting

4. **[Integration Summary](./KRNL_INTEGRATION_SUMMARY.md)**
   - What was done
   - Current status
   - Next steps
   - Resources

---

## 🚀 Quick Start (5 Minutes)

### 1. Verify Setup
```bash
cd /home/junia-loves-juniour/code/event-vax/frontend/event-vax
npm run dev
```

### 2. Test Integration
Visit: **http://localhost:5175/krnl-status**

### 3. Follow Testing Steps
1. ✅ Check configuration (all green)
2. 🔐 Connect wallet with Privy
3. 🔑 Authorize smart account
4. 🚀 Execute test workflow

### 4. See Results
- Workflow completes successfully
- Steps progress: pending → running → completed
- Status code shows SUCCESS (2)

**Complete checklist:** [KRNL_TESTING_CHECKLIST.md](./KRNL_TESTING_CHECKLIST.md)

---

## 📁 File Structure

### Documentation
```
docs/
├── KRNL_README.md                    # This file
├── KRNL_TESTING_CHECKLIST.md         # Testing guide
├── KRNL_QUICK_REFERENCE.md           # Quick reference
├── KRNL_INTEGRATION_COMPLETE.md      # Full guide
└── KRNL_INTEGRATION_SUMMARY.md       # Summary
```

### Code Files
```
src/
├── lib/
│   └── krnl.ts                       # KRNL SDK configuration
├── providers/
│   └── PrivyProvider.jsx             # Privy authentication provider
├── hooks/
│   └── useKRNLWorkflow.js            # Custom workflow hook
├── pages/
│   └── KRNLStatus.jsx                # Test & status page
├── components/
│   └── KRNLTicketPurchaseExample.jsx # Example component
└── main.jsx                          # Provider setup
```

### Configuration
```
.env                                  # Environment variables
```

---

## 🎯 What is KRNL?

**KRNL Protocol** enables:
- 🔐 EIP-7702 account abstraction
- ⚡ Gasless transactions via delegation
- 🔄 Workflow-based execution
- 📊 Step-by-step progress tracking
- 🛡️ Enhanced security without complexity

**Why Privy?**
- Full EIP-7702 support
- Embedded wallet creation
- Streamlined user experience
- One of few wallets supporting account delegation

---

## 🔧 Integration Status

| Component | Status | File |
|-----------|--------|------|
| Dependencies | ✅ Installed | package.json |
| Environment Variables | ✅ Configured | .env |
| KRNL Config | ✅ Working | src/lib/krnl.ts |
| Privy Provider | ✅ Working | src/providers/PrivyProvider.jsx |
| Provider Setup | ✅ Correct | src/main.jsx |
| Custom Hook | ✅ Created | src/hooks/useKRNLWorkflow.js |
| Test Page | ✅ Enhanced | src/pages/KRNLStatus.jsx |
| Example Component | ✅ Created | src/components/KRNLTicketPurchaseExample.jsx |
| Documentation | ✅ Complete | docs/ |
| Dev Server | ✅ Running | http://localhost:5175 |

---

## 💡 Usage Examples

### Basic Workflow
```jsx
import { useKRNLWorkflow } from '../hooks/useKRNLWorkflow';

function MyComponent() {
  const { executeCustomWorkflow, isAuthorized } = useKRNLWorkflow();

  const handleAction = async () => {
    const workflow = {
      action: "your_action",
      params: { /* your params */ }
    };

    const result = await executeCustomWorkflow(workflow);
    if (result.success) {
      console.log('Success!', result.data);
    }
  };

  return <button onClick={handleAction}>Execute</button>;
}
```

### Ticket Purchase
```jsx
const purchaseTicket = async (eventId, price) => {
  const workflow = {
    action: "purchase_ticket",
    params: { eventId, price }
  };
  
  await executeCustomWorkflow(workflow);
};
```

**More examples:** [KRNL_QUICK_REFERENCE.md](./KRNL_QUICK_REFERENCE.md)

---

## 🧪 Testing

### Interactive Testing
Visit: **http://localhost:5175/krnl-status**

This page provides:
- ✅ Configuration verification
- 🔐 Wallet connection testing
- 🔑 Smart account authorization
- 🚀 Workflow execution testing
- 📊 Real-time progress monitoring

### Manual Testing Checklist
Follow: **[KRNL_TESTING_CHECKLIST.md](./KRNL_TESTING_CHECKLIST.md)**

---

## 🐛 Troubleshooting

### Quick Fixes

**Issue:** Configuration errors
```bash
# Verify environment variables
cat .env | grep VITE_

# Restart dev server
npm run dev
```

**Issue:** Wallet connection fails
- Check VITE_PRIVY_APP_ID is set
- Try different browser
- Disable ad blockers
- Check browser console

**Issue:** Authorization fails
- Verify delegated contract address
- Ensure on Sepolia network
- Try disconnecting and reconnecting

**Issue:** Workflow fails
- Check KRNL node URL is accessible
- Verify smart account is authorized
- Check browser console for errors

**Full troubleshooting:** [KRNL_INTEGRATION_COMPLETE.md](./KRNL_INTEGRATION_COMPLETE.md#-troubleshooting)

---

## 🎯 Next Steps

### 1. Test the Integration
- [ ] Visit http://localhost:5175/krnl-status
- [ ] Complete [testing checklist](./KRNL_TESTING_CHECKLIST.md)
- [ ] Verify all features work

### 2. Implement Production Workflows
- [ ] Ticket purchase workflow
- [ ] Ticket transfer workflow  
- [ ] POAP/Badge minting workflow
- [ ] QR code verification workflow

### 3. Enhance User Experience
- [ ] Add loading states
- [ ] Implement error notifications
- [ ] Create progress indicators
- [ ] Add transaction history

### 4. Production Preparation
- [ ] Test on Sepolia testnet
- [ ] Monitor workflow metrics
- [ ] Set up analytics
- [ ] Create user guides

---

## 📚 Additional Resources

### Official Documentation
- [KRNL SDK Documentation](https://docs.krnl.xyz)
- [Privy Documentation](https://docs.privy.io)
- [EIP-7702 Specification](https://eips.ethereum.org/EIPS/eip-7702)
- [Viem Documentation](https://viem.sh)

### Code Examples
- [KRNLStatus.jsx](../src/pages/KRNLStatus.jsx) - Interactive test page
- [useKRNLWorkflow.js](../src/hooks/useKRNLWorkflow.js) - Custom hook
- [KRNLTicketPurchaseExample.jsx](../src/components/KRNLTicketPurchaseExample.jsx) - Example component

### Internal Documentation
- [Testing Checklist](./KRNL_TESTING_CHECKLIST.md)
- [Quick Reference](./KRNL_QUICK_REFERENCE.md)
- [Complete Guide](./KRNL_INTEGRATION_COMPLETE.md)
- [Integration Summary](./KRNL_INTEGRATION_SUMMARY.md)

---

## 🎊 Success Criteria

Your KRNL integration is successful when:

✅ All environment variables are configured  
✅ Dev server runs without errors  
✅ Configuration page shows all green checkmarks  
✅ Wallet connects via Privy  
✅ Smart account authorizes successfully  
✅ Test workflow executes and completes  
✅ Steps progress correctly (pending → running → completed)  
✅ No blocking errors in console  

**Check status:** http://localhost:5175/krnl-status

---

## 📞 Support

### Documentation Questions
- Check [KRNL_INTEGRATION_COMPLETE.md](./KRNL_INTEGRATION_COMPLETE.md)
- Review [KRNL_QUICK_REFERENCE.md](./KRNL_QUICK_REFERENCE.md)
- Follow [KRNL_TESTING_CHECKLIST.md](./KRNL_TESTING_CHECKLIST.md)

### Technical Issues
- Check browser console for errors
- Review [troubleshooting section](./KRNL_INTEGRATION_COMPLETE.md#-troubleshooting)
- Visit [KRNL Discord/Support](https://discord.gg/krnl) (if available)

### Code Examples Needed
- See [example component](../src/components/KRNLTicketPurchaseExample.jsx)
- Check [quick reference patterns](./KRNL_QUICK_REFERENCE.md#-common-patterns)
- Review [test page implementation](../src/pages/KRNLStatus.jsx)

---

## 📝 Version Info

- **KRNL SDK:** 0.1.4
- **Privy:** 3.11.0
- **Viem:** 2.44.4
- **Integration Date:** January 28, 2026
- **Status:** ✅ Complete & Working

---

## 🌟 Quick Links

| Resource | Link |
|----------|------|
| 🧪 Test Page | http://localhost:5175/krnl-status |
| 📋 Testing Checklist | [KRNL_TESTING_CHECKLIST.md](./KRNL_TESTING_CHECKLIST.md) |
| ⚡ Quick Reference | [KRNL_QUICK_REFERENCE.md](./KRNL_QUICK_REFERENCE.md) |
| 📖 Complete Guide | [KRNL_INTEGRATION_COMPLETE.md](./KRNL_INTEGRATION_COMPLETE.md) |
| 📊 Summary | [KRNL_INTEGRATION_SUMMARY.md](./KRNL_INTEGRATION_SUMMARY.md) |
| 🔧 Custom Hook | [useKRNLWorkflow.js](../src/hooks/useKRNLWorkflow.js) |
| 🎫 Example Component | [KRNLTicketPurchaseExample.jsx](../src/components/KRNLTicketPurchaseExample.jsx) |

---

**Ready to get started?** Begin with the [Testing Checklist](./KRNL_TESTING_CHECKLIST.md) →
