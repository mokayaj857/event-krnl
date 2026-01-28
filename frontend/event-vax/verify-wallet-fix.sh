#!/bin/bash

# ============================================
# KRNL WALLET INTEGRATION VERIFICATION TEST
# ============================================
# This script verifies all fixes are in place

echo "🔍 KRNL Wallet Integration Verification"
echo "========================================"
echo ""

PROJECT_ROOT="/home/junia-loves-juniour/code/event-vax/frontend/event-vax"
ISSUES=0

# Test 1: Check index.html has wallet blocking script
echo "✓ Test 1: Checking index.html wallet blocking..."
if grep -q "WALLET INJECTION PREVENTION" "$PROJECT_ROOT/index.html"; then
    echo "  ✅ Wallet blocking script found"
else
    echo "  ❌ Wallet blocking script NOT FOUND"
    ISSUES=$((ISSUES + 1))
fi

# Test 2: Check PrivyProvider has shimDisableFlag
echo "✓ Test 2: Checking PrivyProvider configuration..."
if grep -q "shimDisableFlag: true" "$PROJECT_ROOT/src/providers/PrivyProvider.jsx"; then
    echo "  ✅ External wallet shimming disabled"
else
    echo "  ❌ shimDisableFlag NOT FOUND"
    ISSUES=$((ISSUES + 1))
fi

# Test 3: Check embedded wallets enabled
echo "✓ Test 3: Checking embedded wallet configuration..."
if grep -q "createOnLogin: 'all-users'" "$PROJECT_ROOT/src/providers/PrivyProvider.jsx"; then
    echo "  ✅ Embedded wallets enabled for all users"
else
    echo "  ❌ Embedded wallet config NOT FOUND"
    ISSUES=$((ISSUES + 1))
fi

# Test 4: Check WalletConnect is disabled
echo "✓ Test 4: Checking WalletConnect disabled..."
if grep -q "walletConnect: {" "$PROJECT_ROOT/src/providers/PrivyProvider.jsx" && \
   grep -q "enabled: false," "$PROJECT_ROOT/src/providers/PrivyProvider.jsx"; then
    echo "  ✅ WalletConnect is disabled"
else
    echo "  ❌ WalletConnect disable config NOT FOUND"
    ISSUES=$((ISSUES + 1))
fi

# Test 5: Check KRNL SDK config exists
echo "✓ Test 5: Checking KRNL SDK configuration..."
if [ -f "$PROJECT_ROOT/src/lib/krnl.ts" ]; then
    echo "  ✅ KRNL SDK config file exists"
else
    echo "  ❌ KRNL SDK config NOT FOUND"
    ISSUES=$((ISSUES + 1))
fi

# Test 6: Check PrivyProvider exists
echo "✓ Test 6: Checking PrivyProvider component..."
if [ -f "$PROJECT_ROOT/src/providers/PrivyProvider.jsx" ]; then
    echo "  ✅ PrivyProvider component exists"
else
    echo "  ❌ PrivyProvider NOT FOUND"
    ISSUES=$((ISSUES + 1))
fi

# Test 7: Check .env file has required variables
echo "✓ Test 7: Checking environment variables..."
if [ -f "$PROJECT_ROOT/.env" ]; then
    if grep -q "VITE_PRIVY_APP_ID" "$PROJECT_ROOT/.env"; then
        echo "  ✅ VITE_PRIVY_APP_ID is configured"
    else
        echo "  ⚠️  VITE_PRIVY_APP_ID not found in .env"
    fi
    if grep -q "VITE_KRNL_NODE_URL" "$PROJECT_ROOT/.env"; then
        echo "  ✅ VITE_KRNL_NODE_URL is configured"
    else
        echo "  ⚠️  VITE_KRNL_NODE_URL not found in .env"
    fi
else
    echo "  ❌ .env file NOT FOUND"
    ISSUES=$((ISSUES + 1))
fi

# Test 8: Check KRNLStatus page exists
echo "✓ Test 8: Checking KRNLStatus test page..."
if [ -f "$PROJECT_ROOT/src/pages/KRNLStatus.jsx" ]; then
    echo "  ✅ KRNLStatus test page exists"
else
    echo "  ❌ KRNLStatus page NOT FOUND"
    ISSUES=$((ISSUES + 1))
fi

echo ""
echo "========================================"

if [ $ISSUES -eq 0 ]; then
    echo "✅ ALL CHECKS PASSED"
    echo ""
    echo "Next steps:"
    echo "1. Hard refresh browser (Ctrl+Shift+R)"
    echo "2. Visit http://localhost:5173/krnl-status"
    echo "3. Open DevTools (F12)"
    echo "4. Check console - should have NO errors"
    echo "5. Click 'Connect Wallet' - Privy modal should appear"
    echo ""
    exit 0
else
    echo "❌ $ISSUES ISSUE(S) FOUND"
    echo ""
    echo "Please fix the issues listed above."
    echo ""
    exit 1
fi
