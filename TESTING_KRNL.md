# KRNL SDK Testing Guide

## ✅ Integration Complete

The KRNL SDK has been successfully integrated into your project. Here's how to test it:

## Quick Test

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the test page:**
   Open `http://localhost:3000/test-krnl` in your browser

3. **Check the test results:**
   The page will show:
   - ✅ Configuration status
   - ✅ KRNL hooks availability  
   - ✅ Node configuration
   - ✅ Available methods

## What Was Integrated

### ✅ Packages Installed
- `@krnl-dev/sdk-react-7702@0.1.4`
- `@privy-io/react-auth` (required dependency)
- `viem@2.44.4`

### ✅ Files Created
1. **Configuration:**
   - `src/lib/krnl.ts` - KRNL config and enums

2. **Context & Providers:**
   - `src/context/KRNLContext.jsx` - KRNL context hook
   - `src/providers/PrivyProvider.jsx` - Privy provider wrapper
   - `src/main.jsx` - Updated with KRNLProvider

3. **Kernel Hooks:**
   - `src/hooks/kernels/useTicketKernel.js`
   - `src/hooks/kernels/useAttendanceKernel.js`
   - `src/hooks/kernels/useMarketplaceKernel.js`
   - `src/hooks/kernels/useReputationKernel.js`

4. **Components:**
   - `src/components/kernels/TicketKernelComponent.jsx`
   - `src/components/kernels/AttendanceKernelComponent.jsx`
   - `src/components/kernels/MarketplaceKernelComponent.jsx`
   - `src/components/kernels/ReputationKernelComponent.jsx`
   - `src/components/kernels/KRNLTestComponent.jsx`
   - `src/pages/KRNLTestPage.jsx`

## Environment Setup

Create a `.env` file in the root:

```env
VITE_DELEGATED_ACCOUNT_ADDRESS=0x0000000000000000000000000000000000000000
VITE_PRIVY_APP_ID=your_privy_app_id_here
VITE_KRNL_NODE_URL=https://node.krnl.xyz
VITE_RPC_URL=https://lb.drpc.org/sepolia/AnRM4mK1tEyphrn_jexSLbrPxqT4wGIR760VIlZWwHzR
VITE_AVARA_CORE_ADDRESS=0xYourAvaraCoreAddress
```

## Expected Behavior

### ✅ Working Correctly
- SDK imports without errors
- KRNLProvider wraps the app
- Context hook is available
- Test page loads and displays status

### ⏳ Requires Configuration
- Node configuration (loads after Privy setup)
- Transaction intents (requires KRNL node connection)
- Workflow execution (requires full KRNL setup)

## Troubleshooting

### Issue: "KRNL context not available"
**Fix:** Ensure KRNLProvider is properly wrapped in `src/main.jsx`

### Issue: Build warnings about WASM files
**Fix:** These are expected warnings and don't affect functionality

### Issue: Privy not configured
**Fix:** Add `VITE_PRIVY_APP_ID` to your `.env` file

## Next Steps

1. ✅ **Integration Complete** - All code is in place
2. 🔧 **Configure Environment** - Set up `.env` variables
3. 🔑 **Get Privy App ID** - Sign up at https://privy.io
4. 🧪 **Test Integration** - Visit `/test-krnl` page
5. 🚀 **Deploy Contracts** - Deploy AvaraCore with KRNL signer
6. 📝 **Use Kernels** - Integrate kernel components into your pages

## Summary

✅ **KRNL SDK is successfully integrated!**

All four kernels are implemented:
- 🎫 Ticket Kernel - NFT tickets with provenance
- ✅ Attendance & POAP Kernel - Check-in and POAP issuance  
- 🛒 Marketplace Kernel - Ticket sales and resales
- ⭐ Reputation Kernel - Scores and fraud detection

The test page at `/test-krnl` will help you verify everything is working correctly.

