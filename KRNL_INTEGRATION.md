# KRNL SDK Integration Guide

This document describes the KRNL SDK integration into the Avara event ticketing platform.

## Overview

Avara uses KRNL's modular architecture to implement the entire ticketing and attendance ecosystem through four composable kernels:

1. **Ticket Kernel** - NFT-based tickets with provenance tracking
2. **Attendance & POAP Kernel** - Check-in verification and POAP issuance
3. **Marketplace Kernel** - Primary and secondary ticket sales
4. **Reputation Kernel** - Reputation scores and fraud detection

## Installation

The KRNL SDK has been installed:
```bash
npm install @krnl-dev/sdk-react-7702 viem --legacy-peer-deps
```

## Configuration

KRNL configuration is set up in `src/lib/krnl.ts`. Environment variables needed:

```env
VITE_DELEGATED_ACCOUNT_ADDRESS=0x...
VITE_PRIVY_APP_ID=your_privy_app_id
VITE_KRNL_NODE_URL=https://node.krnl.xyz
VITE_RPC_URL=https://your-rpc-url
VITE_AVARA_CORE_ADDRESS=0x...
```

## Architecture

### 1. Ticket Kernel (`useTicketKernel`)

**Location**: `src/hooks/kernels/useTicketKernel.js`

**Features**:
- Mints NFT-based event tickets with metadata (seat, tier, venue, timestamps)
- Stores ticket provenance: created → sold → scanned → invalidated
- Connects through KRNL's API bridge for QR code and hardware scanner integrations
- Each ticket action is timestamped and signed on-chain by KRNL's decentralized orchestrator

**Usage**:
```javascript
import { useTicketKernel } from '../hooks/kernels/useTicketKernel';

const { mintTicket, recordProvenance, getProvenance } = useTicketKernel();

// Mint a ticket
await mintTicket(to, uri, eventId, {
  seat: 'A12',
  tier: 'VIP',
  venue: 'Convention Center'
});
```

### 2. Attendance & POAP Kernel (`useAttendanceKernel`)

**Location**: `src/hooks/kernels/useAttendanceKernel.js`

**Features**:
- Issues POAP-style NFTs upon successful check-in
- POAPs can be Soulbound (non-transferable) or dynamic
- Supports geofenced, device-based, or multi-sensor attendance verification
- All attendance proofs are cryptographically verified and stored on-chain

**Usage**:
```javascript
import { useAttendanceKernel } from '../hooks/kernels/useAttendanceKernel';

const { checkInAndMintPOAP, verifyGeofence } = useAttendanceKernel();

// Check-in with geofence verification
await checkInAndMintPOAP(ticketId, eventId, poapUri, {
  geofence: { latitude: 40.7128, longitude: -74.0060 },
  device: { id: 'device-123' }
});
```

### 3. Marketplace Kernel (`useMarketplaceKernel`)

**Location**: `src/hooks/kernels/useMarketplaceKernel.js`

**Features**:
- Manages primary ticket sales and secondary resales
- Enforces organizer-set rules (price caps, max transfers, anti-bot policies)
- Uses KRNL's cross-chain native communication for multi-chain payments
- Supports off-chain payment providers via KRNL's API access

**Usage**:
```javascript
import { useMarketplaceKernel } from '../hooks/kernels/useMarketplaceKernel';

const { listTicket, buyTicket, validateListingRules } = useMarketplaceKernel();

// List a ticket
await listTicket(ticketId, '0.1'); // 0.1 ETH

// Buy a ticket (cross-chain supported)
await buyTicket(ticketId, '0.1');
```

### 4. Reputation Kernel (`useReputationKernel`)

**Location**: `src/hooks/kernels/useReputationKernel.js`

**Features**:
- Generates reputation scores and badges for attendees based on POAP history
- Tracks engagement per organizer, per category, or across the entire ecosystem
- Unlocks benefits such as early access, exclusive drops, or VIP tiers
- Uses KRNL's AI access layer to detect fraudulent activity or bot patterns

**Usage**:
```javascript
import { useReputationKernel } from '../hooks/kernels/useReputationKernel';

const { getReputation, issueBadge, detectFraud } = useReputationKernel();

// Get reputation score
const score = await getReputation(address);

// Detect fraud using KRNL AI
const fraudResult = await detectFraud(address);
```

## Components

Ready-to-use React components are available in `src/components/kernels/`:

- `TicketKernelComponent.jsx` - Ticket minting UI
- `AttendanceKernelComponent.jsx` - Check-in and POAP issuance UI
- `MarketplaceKernelComponent.jsx` - Ticket marketplace UI
- `ReputationKernelComponent.jsx` - Reputation and badges UI

## Integration Points

### Main App Setup

The KRNL provider is integrated in `src/main.jsx`:

```jsx
import { KRNLProvider } from '@krnl-dev/sdk-react-7702';
import { config } from './lib/krnl';

<KRNLProvider config={config}>
  {/* Your app */}
</KRNLProvider>
```

### Using KRNL Context

```javascript
import { useKRNLContext } from '../context/KRNLContext';

const { createTransactionIntent, nodeConfig, isReady } = useKRNLContext();
```

## Technical Advantages

### Modular Architecture
Each kernel (Tickets, Attendance, Marketplace, Reputation) functions independently and can be upgraded without redeploying the entire platform.

### Cross-Chain Native
Tickets, POAPs, and loyalty badges can move across multiple chains using KRNL's cross-chain messaging.

### Secure API Access
Hardware scanners, venue systems, GPS modules, and payment providers connect trustlessly through KRNL's secure callback and API bridge.

### Decentralized Orchestration
Every ticket sale, check-in, or verification is signed, timestamped, and validated across a decentralized coordinator network.

### AI-Powered Logic
Fraud detection, anomaly scanning, and loyalty analysis are powered through KRNL's AI inference access layer.

## Next Steps

1. **Set up environment variables** - Configure all required KRNL and contract addresses
2. **Deploy contracts** - Ensure AvaraCore contract is deployed with KRNL signer address
3. **Configure KRNL node** - Set up your KRNL node or use the public node
4. **Test integration** - Use the kernel components to test each functionality
5. **Integrate with existing components** - Update EventManager, TicketPurchase, etc. to use KRNL kernels

## API Endpoints

The hooks create workflows that interact with KRNL node API endpoints:

- `/api/ticket/mint` - Ticket minting
- `/api/ticket/provenance` - Provenance tracking
- `/api/attendance/verify` - Check-in verification
- `/api/attendance/poap` - POAP issuance
- `/api/marketplace/list` - Ticket listing
- `/api/marketplace/buy` - Ticket purchase
- `/api/reputation/calculate` - Reputation calculation
- `/api/reputation/badge` - Badge issuance
- `/api/reputation/fraud` - Fraud detection

These endpoints are handled by the KRNL node orchestrator, which signs transactions and coordinates workflow execution.

