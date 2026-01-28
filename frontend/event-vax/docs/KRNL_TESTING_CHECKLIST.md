# 🧪 KRNL Integration Testing Checklist

## ✅ Pre-Flight Checklist

### 1. Environment Setup
- [x] Dependencies installed (`@krnl-dev/sdk-react-7702`, `@privy-io/react-auth`)
- [x] Environment variables configured in `.env`
- [x] KRNL config file created at `src/lib/krnl.ts`
- [x] Privy provider configured at `src/providers/PrivyProvider.jsx`
- [x] Providers properly ordered in `src/main.jsx`
- [x] Dev server running (http://localhost:5175)
- [x] No compilation errors

### 2. Configuration Verification
```bash
# Check environment variables
cat .env | grep VITE_

# Expected output:
# VITE_PRIVY_APP_ID=cmkxm04ce02yxjy0cwaybxum6
# VITE_KRNL_NODE_URL=https://v0-1-0.node.lat/
# VITE_RPC_URL=https://lb.drpc.org/sepolia/...
# VITE_DELEGATED_ACCOUNT_ADDRESS=0x256ff3b9d3df415a05ba42beb5f186c28e103b2a
```

---

## 🧪 Step-by-Step Testing

### Test 1: Configuration Check
**URL:** http://localhost:5175/krnl-status

**Expected Results:**
- [ ] All configuration rows show "✅ Set"
- [ ] No "❌ Missing" indicators
- [ ] Delegated contract address displays correctly

**Screenshot:** Take a screenshot of the configuration table

---

### Test 2: Wallet Connection (Privy)
**Action:** Click "🔐 Connect Wallet" button

**Expected Results:**
- [ ] Privy login modal appears
- [ ] Can select email or wallet login
- [ ] After login, "Authenticated" shows "✅ Yes"
- [ ] Wallet address appears (truncated)
- [ ] "🚪 Disconnect" button appears

**Troubleshooting:**
- If Privy modal doesn't appear, check browser console
- If stuck, check VITE_PRIVY_APP_ID is valid
- Try refreshing the page

---

### Test 3: Smart Account Authorization
**Action:** Click "🔑 Authorize Smart Account" button

**Expected Results:**
- [ ] Signature request appears in wallet
- [ ] Message mentions EIP-7702 authorization
- [ ] After signing, "Smart Account Enabled" shows "✅ Yes"
- [ ] "KRNL Protocol Status" shows "✅ Yes" for authorization
- [ ] Button changes to "✅ Authorized"

**Troubleshooting:**
- If authorization fails, check delegated contract address
- Ensure you signed the message (didn't reject)
- Check browser console for errors

---

### Test 4: Workflow Execution
**Action:** Click "🚀 Test Workflow" button

**Expected Results:**
- [ ] "Test Status" shows "🔄 Executing test workflow..."
- [ ] "Workflow Steps" section appears with 3 steps
- [ ] Steps progress: pending → running → completed
- [ ] Current step increments (1 → 2 → 3)
- [ ] Final status shows "✅ Workflow executed successfully!"
- [ ] "Workflow Result" shows JSON data

**Step Progress Expected:**
1. Submit workflow: ⏳ → 🔄 → ✅
2. Execute workflow: ⏳ → 🔄 → ✅
3. On-chain status: ⏳ → 🔄 → ✅

**Troubleshooting:**
- If workflow fails, check KRNL node URL
- Ensure smart account is authorized
- Check network connectivity
- Review browser console for detailed errors

---

## 🔍 Verification Points

### Visual Checks
- [ ] No red error messages on page
- [ ] All checkmarks (✅) are green
- [ ] Workflow steps show proper icons (⏳ 🔄 ✅)
- [ ] Status codes display correctly
- [ ] No console errors in browser DevTools

### Functional Checks
- [ ] Can connect wallet
- [ ] Can disconnect wallet
- [ ] Can authorize smart account
- [ ] Can execute test workflow
- [ ] Workflow completes successfully
- [ ] Steps update in real-time
- [ ] Error messages display if something fails

### Console Checks (Browser DevTools)
Look for these logs:
```
🔧 KRNL SDK Configuration: { ... }
🔐 Connecting wallet...
🔑 Authorizing smart account...
✅ KRNL smart account authorized
🚀 Executing workflow: { ... }
✅ Workflow succeeded: { ... }
```

---

## 📊 Status Code Reference

During testing, you should see these status codes:

| Code | Meaning | When You'll See It |
|------|---------|-------------------|
| 0 | PENDING | Workflow just submitted |
| 1 | PROCESSING | Workflow executing |
| 2 | SUCCESS | ✅ Workflow completed |
| 3 | FAILED | ❌ Something went wrong |
| 4 | INTENT_NOT_FOUND | Backend issue |
| 5 | WORKFLOW_NOT_FOUND | Configuration issue |
| 6 | INVALID | Malformed request |

**Expected flow:** 0 (PENDING) → 1 (PROCESSING) → 2 (SUCCESS)

---

## 🎯 Success Criteria

### Minimum Viable Integration ✅
- [x] Configuration loads without errors
- [ ] Privy wallet connection works
- [ ] Smart account authorization succeeds
- [ ] Test workflow executes and completes
- [ ] No blocking errors in console

### Full Integration ✅
- [ ] All steps in minimum viable integration ✅
- [ ] Workflow steps display correctly
- [ ] Progress tracking updates in real-time
- [ ] Error handling shows appropriate messages
- [ ] Can disconnect and reconnect wallet
- [ ] Can re-authorize if needed
- [ ] Multiple workflows can be executed

---

## 🐛 Common Issues & Solutions

### Issue: "VITE_PRIVY_APP_ID is not set"
**Solution:**
1. Check `.env` file has the variable
2. Restart dev server: `npm run dev`
3. Clear browser cache

### Issue: Privy modal doesn't open
**Solution:**
1. Check browser console for errors
2. Verify VITE_PRIVY_APP_ID is valid
3. Try different browser (Chrome/Firefox)
4. Disable ad blockers

### Issue: "No embedded wallet"
**Solution:**
1. Disconnect wallet (if partially connected)
2. Refresh page
3. Connect wallet again
4. Check Privy configuration in PrivyProvider.jsx

### Issue: Authorization fails
**Solution:**
1. Verify delegated contract address is correct
2. Ensure you're on Sepolia network
3. Check wallet has some ETH (for gas)
4. Try disconnecting and reconnecting

### Issue: Workflow times out
**Solution:**
1. Verify KRNL node URL: `https://v0-1-0.node.lat/`
2. Check network connectivity
3. Try a simpler workflow
4. Check browser console for network errors

### Issue: Steps don't update
**Solution:**
1. Check `resetSteps()` is called before workflow
2. Verify steps array is being updated
3. Check React state updates
4. Look for console errors

---

## 📸 Screenshot Checklist

Take screenshots of:
1. [ ] Configuration table (all green checkmarks)
2. [ ] Connected wallet status
3. [ ] Authorized smart account status
4. [ ] Workflow execution in progress
5. [ ] Completed workflow with results
6. [ ] Workflow steps progress
7. [ ] Any errors (for troubleshooting)

---

## 🚀 Next Steps After Testing

Once all tests pass:

### 1. Implement Production Workflows
- [ ] Ticket purchase workflow
- [ ] Ticket transfer workflow
- [ ] POAP/Badge minting workflow
- [ ] QR code verification workflow

### 2. Integrate into Existing Components
- [ ] Add KRNL to ticket purchase page
- [ ] Add to event creation flow
- [ ] Add to ticket resale marketplace
- [ ] Add to check-in system

### 3. Enhance Error Handling
- [ ] User-friendly error messages
- [ ] Retry logic for failed workflows
- [ ] Transaction status notifications
- [ ] Loading states and spinners

### 4. Production Preparation
- [ ] Test on Sepolia testnet
- [ ] Monitor workflow success rates
- [ ] Set up analytics
- [ ] Create user documentation

---

## 📝 Test Results

### Test Date: _____________

### Tester: _____________

### Results:
- Configuration Check: ⬜ Pass ⬜ Fail
- Wallet Connection: ⬜ Pass ⬜ Fail
- Smart Account Auth: ⬜ Pass ⬜ Fail
- Workflow Execution: ⬜ Pass ⬜ Fail

### Notes:
```
[Add any observations, issues, or comments here]
```

### Screenshots Attached:
⬜ Yes ⬜ No

### Overall Status:
⬜ All tests passed - Ready for production
⬜ Some tests passed - Needs fixes
⬜ Tests failed - Needs investigation

---

## 🎉 Success!

If all tests pass:
1. ✅ KRNL SDK is properly integrated
2. ✅ Privy authentication works
3. ✅ EIP-7702 authorization functions
4. ✅ Workflows execute successfully
5. ✅ Ready to implement production features

**Congratulations!** Your KRNL integration is complete and working.

**Next:** Start implementing your event ticketing workflows using the patterns in:
- [KRNL_INTEGRATION_COMPLETE.md](./KRNL_INTEGRATION_COMPLETE.md)
- [KRNL_QUICK_REFERENCE.md](./KRNL_QUICK_REFERENCE.md)
- [KRNLTicketPurchaseExample.jsx](../src/components/KRNLTicketPurchaseExample.jsx)

---

**Testing URL:** http://localhost:5175/krnl-status
