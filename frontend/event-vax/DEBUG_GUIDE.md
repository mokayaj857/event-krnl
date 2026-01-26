# EventVax Debugging Guide

## Current Issues & Solutions

### 🔴 Issue 1: "Error fetching events: TypeError: Failed to fetch"

**Cause:** Frontend cannot reach the backend API server.

**Solution:**
1. **Verify backend is running:**
   ```bash
   cd ~/code/event-vax/frontend/event-vax
   lsof -i :8080  # Should show node process
   ```

2. **If not running, start it:**
   ```bash
   cd ~/code/event-vax/frontend/event-vax
   node server/server.js
   ```

3. **Test backend manually:**
   ```bash
   curl http://localhost:8080/api/events
   ```
   Should return JSON with events data.

4. **Check browser console:** Open DevTools (F12) → Console → Look for specific error message

---

### 🔴 Issue 2: "could not decode result data (value="0x")"

**Cause:** Your wallet is connected to the **wrong blockchain network**. The contracts are deployed on **Avalanche Fuji Testnet** but your wallet might be on Sepolia or another network.

**Solution:**
1. **Check current network in MetaMask/Wallet**
   - Should show: "Avalanche Fuji C-Chain"
   - Chain ID: 43113

2. **Switch network manually:**
   - Click network dropdown in wallet
   - Select "Avalanche Fuji C-Chain"
   - If not listed, add it:
     - Network Name: Avalanche Fuji C-Chain
     - RPC URL: https://api.avax-test.network/ext/bc/C/rpc
     - Chain ID: 43113
     - Currency Symbol: AVAX
     - Block Explorer: https://testnet.snowtrace.io

3. **Use the network warning banner:**
   - A red banner will appear at top if wrong network
   - Click "Switch Network" button

4. **Verify contract deployment:**
   ```bash
   cast code 0x53687CccF774FDa60fE2bd4720237fbb8e4fd02c \
     --rpc-url https://api.avax-test.network/ext/bc/C/rpc
   ```
   Should return bytecode (long hex string), not "0x"

---

### 🔴 Issue 3: "Minting error details: could not decode result data"

**Cause:** Same as Issue 2 - wrong network.

**Solution:** Follow steps in Issue 2 to switch to Avalanche Fuji.

---

## Contract Addresses (Avalanche Fuji)

```javascript
EVENT_FACTORY: '0x53687CccF774FDa60fE2bd4720237fbb8e4fd02c'
POAP: '0xF149868fab5D3886e33a9096ae8d08C19A5bcC40'
EVENT_BADGE: '0x5AE84f40b668979b31c2E601FdbBBd4c04dE6230'
MARKETPLACE: '0x5316aD9DB181111D7dA7AF4d139d223A1DdAB8E1'
QR_VERIFICATION: '0xd04E0B0959Ceb4f5Be7e29fc0d072368C1EC0e06'
METADATA_REGISTRY: '0xB8F60EAf784b897F7b7AFDabdc67aC6E69fA953b'
```

---

## Testing Steps

### 1. Test Backend
```bash
# Check if running
ps aux | grep "node server.js"

# Test API endpoints
curl http://localhost:8080/health
curl http://localhost:8080/api/events | jq
```

### 2. Test Contracts
```bash
# Test EventFactory
cast call 0x53687CccF774FDa60fE2bd4720237fbb8e4fd02c \
  "eventTicket(uint256)" 27 \
  --rpc-url https://api.avax-test.network/ext/bc/C/rpc

# Test POAP
cast call 0xF149868fab5D3886e33a9096ae8d08C19A5bcC40 \
  "balanceOf(address)" YOUR_WALLET_ADDRESS \
  --rpc-url https://api.avax-test.network/ext/bc/C/rpc
```

### 3. Test Frontend
```bash
# Check if Vite is running
lsof -i :5173

# Access in browser
http://localhost:5173
```

---

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `Failed to fetch` | Backend not running or CORS issue | Start backend: `node server/server.js` |
| `could not decode result data (value="0x")` | Wrong network | Switch to Avalanche Fuji (Chain ID: 43113) |
| `Event ticket contract not found` | Event doesn't exist on blockchain | Check blockchain_event_id in database |
| `Network request failed` | No internet or RPC issue | Check internet, try alternative RPC |
| `User rejected request` | User cancelled in wallet | User needs to approve transaction |

---

## Changes Made

1. **Added network validation** in:
   - `src/pages/MintNFT.jsx` - Checks network before minting
   - `src/hooks/useAchievements.js` - Checks network before fetching achievements

2. **Improved error messages** in:
   - `src/pages/Home.jsx` - Better fetch error handling
   - `src/pages/MintNFT.jsx` - Shows chain ID in error

3. **Added NetworkWarning component**:
   - `src/components/NetworkWarning.jsx` - Red banner at top
   - Auto-detects wrong network
   - One-click network switching

4. **Integrated NetworkWarning** in:
   - `src/App.tsx` - Shows on all pages

---

## Quick Checklist

Before using the app:
- [ ] Backend running on port 8080
- [ ] Frontend running on port 5173  
- [ ] Wallet installed (MetaMask recommended)
- [ ] Wallet connected to **Avalanche Fuji** (Chain ID: 43113)
- [ ] Wallet has AVAX for gas fees
- [ ] Browser console shows no CORS errors

---

## Getting Test AVAX

1. Visit: https://faucet.avax.network
2. Select "Fuji Testnet"
3. Enter your wallet address
4. Request test AVAX
