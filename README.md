---
# KRNL Integration (Avara) 
## 📍 Where KRNL is Used (Exact Code Locations)

### A) KRNL SDK Usage (Frontend Application)

**Primary Integration: `frontend/event-vax/` directory**

#### 1. Package Dependencies
**File:** `frontend/event-vax/package.json`
- Line 20: "@krnl-dev/sdk-react-7702": "^0.1.4"
- KRNL SDK is installed as a production dependency

**GitHub Link:** https://github.com/mokayaj857/event-krnl/blob/main/frontend/event-vax/package.json

#### 2. KRNL Configuration
**File:** `frontend/event-vax/src/lib/krnl.ts`
- Lines 1-28: Complete KRNL SDK configuration
- Line 1: `import { createConfig } from '@krnl-dev/sdk-react-7702'`
- Lines 21-28: Creates KRNL config with:
  - `delegatedContractAddress`
  - `privyAppId`
  - `krnlNodeUrl`
  - `rpcUrl`
  - `chain: sepolia`

**GitHub Link:** https://github.com/mokayaj857/event-krnl/blob/main/frontend/event-vax/src/lib/krnl.ts

```typescript
// Actual code from the repository
import { createConfig } from '@krnl-dev/sdk-react-7702';
import { sepolia } from 'viem/chains';

export const krnlConfig = createConfig({
  chain: sepolia as any,
  delegatedContractAddress,
  privyAppId,
  krnlNodeUrl,
  rpcUrl,
});
```

#### 3. KRNL Provider Wrapper
**File:** `frontend/event-vax/src/main.jsx`
- Line 6: `import { KRNLProvider } from '@krnl-dev/sdk-react-7702'`
- Line 7: `import { krnlConfig } from './lib/krnl'`
- Line 114: `<KRNLProvider config={krnlConfig}>` wraps entire application

**GitHub Link:** https://github.com/mokayaj857/event-krnl/blob/main/frontend/event-vax/src/main.jsx

```javascript
// Actual code showing KRNL integration
<ChakraProvider value={defaultSystem}>
  <PrivyProvider>
    <KRNLProvider config={krnlConfig}>
      <WalletProvider>
        <RouterProvider router={router} />
```

#### 4. KRNL SDK Hooks Usage
**File:** `frontend/event-vax/src/pages/KRNLStatus.jsx`
- Line 2: `import { useKRNL } from '@krnl-dev/sdk-react-7702'`
- Lines 8-13: Uses KRNL SDK hooks:
  - `isReady` - SDK initialization status
  - `isAuthorized` - KRNL authorization status
  - `smartAccountEnabled` - Smart account status
  - `delegatedContractAddress` - Contract address
  - `error` - Error handling

**GitHub Link:** https://github.com/mokayaj857/event-krnl/blob/main/frontend/event-vax/src/pages/KRNLStatus.jsx

```javascript
// Actual code using KRNL hooks
const {
  isReady,
  isAuthorized,
  smartAccountEnabled,
  delegatedContractAddress,
  error,
} = useKRNL();
```

**Access KRNL Status Page:** Navigate to `/krnl-status` route (Line 99 in main.jsx)

---

### B) KRNL Contract Integration (Smart Contracts)

**Directory:** `frontend/krnl/avara/contracts/`

#### 1. KRNL Signer Storage
**File:** `frontend/krnl/avara/contracts/avara.sol`
- Line 38: `address public krnlSigner;` - Stores trusted KRNL signer address
- Lines 45-47: Constructor requires KRNL signer address
- Lines 61-64: Admin function to update KRNL signer

**GitHub Link:** https://github.com/mokayaj857/event-krnl/blob/main/frontend/krnl/avara/contracts/avara.sol

```solidity
// KRNL signer (off-chain orchestrator)
address public krnlSigner;

constructor(address _krnlSigner) {
    require(_krnlSigner != address(0), "KRNL signer required");
    krnlSigner = _krnlSigner;
    // ...
}
```

#### 2. KRNL Signature Verification
**File:** `frontend/krnl/avara/contracts/avara.sol`
- Lines 144-157: `_verifyKrnlSignature()` function
- Uses ECDSA cryptography to verify KRNL-signed messages
- Validates actions: "MINT", "CHECKIN", etc.
- Lines 153-156: Recovers signer and compares to trusted `krnlSigner`

```solidity
function _verifyKrnlSignature(
    string memory action,
    uint256 ticketId,
    uint256 eventId,
    address account,
    uint256 timestamp,
    uint256 nonce,
    bytes memory signature
) internal view returns (bool) {
    bytes32 h = keccak256(abi.encodePacked(action, ticketId, eventId, account, timestamp, nonce));
    bytes32 ethSigned = ECDSA.toEthSignedMessageHash(h);
    address signer = ECDSA.recover(ethSigned, signature);
    return signer == krnlSigner;
}
```

#### 3. KRNL-Gated Functions

**Ticket Kernel - Minting with KRNL Proof:**
- Lines 164-183: `mintTicketWithKrnl()` function
- Line 173: Verifies KRNL signature with action "MINT"
- Line 174: `require(ok, "invalid KRNL mint proof")`
- Lines 176-178: Replay attack protection
- Line 180: Mints ticket after KRNL verification

```solidity
function mintTicketWithKrnl(
    address to,
    string calldata uri,
    uint256 eventId,
    uint256 timestamp,
    uint256 nonce,
    bytes calldata krnlSignature
) external nonReentrant returns (uint256) {
    bool ok = _verifyKrnlSignature("MINT", 0, eventId, to, timestamp, nonce, krnlSignature);
    require(ok, "invalid KRNL mint proof");
    // ... replay protection and minting
}
```

**Attendance & POAP Kernel - Check-in with KRNL Proof:**
- Lines 186-215: `checkInAndMintPOAP()` function
- Line 195: Verifies KRNL signature with action "CHECKIN"
- Line 196: `require(ok, "invalid KRNL checkin proof")`
- Lines 208-211: Mints POAP and increments reputation after KRNL verification

```solidity
function checkInAndMintPOAP(
    uint256 ticketId,
    uint256 eventId,
    string calldata poapUri,
    uint256 timestamp,
    uint256 nonce,
    bytes calldata krnlSignature
) external nonReentrant returns (uint256) {
    bool ok = _verifyKrnlSignature("CHECKIN", ticketId, eventId, msg.sender, timestamp, nonce, krnlSignature);
    require(ok, "invalid KRNL checkin proof");
    // ... POAP minting and reputation increment
}
```

**Marketplace Kernel:**
- Lines 76-79: `setEventRules()` - Organizer-defined resale rules
- Lines 91-97: `listTicket()` - List tickets for resale
- Lines 99-130: `buyTicket()` - Enforces maxResalePrice and maxTransfers
- Lines 108-110: Price cap enforcement
- Lines 120-124: Transfer limit enforcement

**Reputation Kernel:**
- Line 218: `mapping(address => uint256) public reputation`
- Line 211: Reputation incremented on POAP issuance
- Lines 221-223: Admin functions to set reputation scores

---

## 🔗 Four-Kernel Architecture (Avara ↔ KRNL)

| Kernel | KRNL Integration | Contract Function | Purpose |
|--------|------------------|-------------------|---------|
| **🎟️ Ticket Kernel** | KRNL-signed mint proof | `mintTicketWithKrnl()` (Line 164) | Cryptographically verified NFT ticket minting |
| **📍 Attendance & POAP Kernel** | KRNL-signed check-in proof | `checkInAndMintPOAP()` (Line 186) | Verified attendance with POAP badges |
| **🔄 Marketplace Kernel** | Rule enforcement | `listTicket()`, `buyTicket()`, `setEventRules()` | Anti-scalping resale marketplace |
| **🧠 Reputation Kernel** | Score tracking | `reputation` mapping (Line 218) | On-chain attendee reputation system |

---

## 🚀 Running the Application with KRNL

### 1. Frontend Application (event-vax)

```bash
cd event-krnl/frontend/event-vax
npm install
npm run dev
```

**Environment Variables Required:**
Create `.env` file in `frontend/event-vax/`:
```env
VITE_PRIVY_APP_ID=your_privy_app_id
VITE_KRNL_NODE_URL=https://node.krnl.xyz
VITE_DELEGATED_ACCOUNT_ADDRESS=0x...
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

**Verify KRNL Integration:**
- Navigate to `http://localhost:5173/krnl-status`
- Check SDK status, authorization, and smart account setup

### 2. Backend Server

```bash
cd event-krnl/frontend/event-vax/server
npm install
npm start
```

Server runs on `http://localhost:8080`

### 3. KRNL Smart Contracts (Avara)

**Compile Contracts:**
```bash
cd frontend/krnl/avara
npx hardhat compile
```

**Deploy Contracts:**
```bash
npx hardhat run scripts/deploy.js --network <network>
```

**Note:** Set KRNL signer address during deployment

---

## 📂 Complete KRNL File Reference

| File Path | Lines | Description |
|-----------|-------|-------------|
| `frontend/event-vax/package.json` | 20 | KRNL SDK dependency |
| `frontend/event-vax/src/lib/krnl.ts` | 1-28 | KRNL configuration |
| `frontend/event-vax/src/main.jsx` | 6-7, 114 | KRNL Provider wrapper |
| `frontend/event-vax/src/pages/KRNLStatus.jsx` | 1-71 | KRNL SDK hooks usage |
| `frontend/krnl/avara/contracts/avara.sol` | 38, 45-47, 61-64 | KRNL signer storage |
| `frontend/krnl/avara/contracts/avara.sol` | 144-157 | KRNL signature verification |
| `frontend/krnl/avara/contracts/avara.sol` | 164-183 | Ticket minting with KRNL |
| `frontend/krnl/avara/contracts/avara.sol` | 186-215 | Check-in & POAP with KRNL |
| `frontend/krnl/avara/contracts/avara.sol` | 160 | Replay protection mapping |

---

## 🔍 How to Verify KRNL Integration

### Frontend Verification:
1. Check `package.json` for `@krnl-dev/sdk-react-7702` dependency
2. Inspect `src/lib/krnl.ts` for configuration
3. Verify `src/main.jsx` wraps app with `KRNLProvider`
4. Visit `/krnl-status` route to see live SDK status

### Contract Verification:
1. Open `frontend/krnl/avara/contracts/avara.sol`
2. Search for `krnlSigner` variable (line 38)
3. Find `_verifyKrnlSignature` function (line 144)
4. Locate KRNL-gated functions:
   - `mintTicketWithKrnl` (line 164)
   - `checkInAndMintPOAP` (line 186)

---

**GitHub Repository:** https://github.com/mokayaj857/event-krnl

**Direct Links to KRNL Integration:**
- Frontend SDK Config: https://github.com/mokayaj857/event-krnl/blob/main/frontend/event-vax/src/lib/krnl.ts
- KRNL Provider: https://github.com/mokayaj857/event-krnl/blob/main/frontend/event-vax/src/main.jsx
- KRNL Status Page: https://github.com/mokayaj857/event-krnl/blob/main/frontend/event-vax/src/pages/KRNLStatus.jsx
- Smart Contract: https://github.com/mokayaj857/event-krnl/blob/main/frontend/krnl/avara/contracts/avara.sol
