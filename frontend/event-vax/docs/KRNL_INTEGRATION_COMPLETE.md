# KRNL SDK Integration Guide

## ✅ Integration Status

The KRNL SDK has been successfully integrated into the Event-Vax platform with full EIP-7702 account abstraction support via Privy.

## 📦 Dependencies

The following packages are installed:

```json
{
  "@krnl-dev/sdk-react-7702": "^0.1.4",
  "@privy-io/react-auth": "^3.11.0",
  "viem": "^2.44.4"
}
```

## 🔧 Configuration

### Environment Variables

All required environment variables are set in `.env`:

```bash
# Privy App ID for wallet authentication (EIP-7702 support)
VITE_PRIVY_APP_ID=cmkxm04ce02yxjy0cwaybxum6

# KRNL Node URL - Protocol endpoint for workflow execution
VITE_KRNL_NODE_URL=https://v0-1-0.node.lat/

# Sepolia RPC URL (KRNL uses optimized Privy RPC if not provided)
VITE_RPC_URL=https://lb.drpc.org/sepolia/AnRM4mK1tEyphrn_jexSLbrPxqT4wGIR760VIlZWwHzR

# Delegated Account Address - EIP-7702 contract for account abstraction
VITE_DELEGATED_ACCOUNT_ADDRESS=0x256ff3b9d3df415a05ba42beb5f186c28e103b2a
```

### KRNL Configuration

Located at: `/src/lib/krnl.ts`

```typescript
import { createConfig } from '@krnl-dev/sdk-react-7702';
import { sepolia } from 'viem/chains';

export const krnlConfig = createConfig({
  chain: sepolia,
  delegatedContractAddress: process.env.VITE_DELEGATED_ACCOUNT_ADDRESS,
  privyAppId: process.env.VITE_PRIVY_APP_ID,
  krnlNodeUrl: process.env.VITE_KRNL_NODE_URL,
  rpcUrl: process.env.VITE_RPC_URL, // Optional
});
```

### Provider Setup

Located at: `/src/main.jsx`

```jsx
import { PrivyProvider } from './providers/PrivyProvider';
import { KRNLProvider } from '@krnl-dev/sdk-react-7702';
import { krnlConfig } from './lib/krnl';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider value={defaultSystem}>
      <PrivyProvider>
        <KRNLProvider config={krnlConfig}>
          <WalletProvider>
            <RouterProvider router={router} />
          </WalletProvider>
        </KRNLProvider>
      </PrivyProvider>
    </ChakraProvider>
  </React.StrictMode>
);
```

## 🚀 Usage

### Using the Custom Hook

The easiest way to use KRNL in your components:

```jsx
import { useKRNLWorkflow } from '../hooks/useKRNLWorkflow';

function MyComponent() {
  const { 
    executeCustomWorkflow, 
    isExecuting, 
    workflowError,
    isAuthorized,
    connectAndAuthorize 
  } = useKRNLWorkflow();

  const handleTransfer = async () => {
    // Ensure wallet is connected and authorized
    if (!isAuthorized) {
      await connectAndAuthorize();
    }

    // Execute workflow
    const workflow = {
      action: "transfer_tokens",
      params: {
        from: "0x123...",
        to: "0x456...",
        amount: "1000"
      }
    };

    const result = await executeCustomWorkflow(workflow);
    
    if (result.success) {
      console.log('Success!', result.data);
    } else {
      console.error('Failed:', result.error);
    }
  };

  return (
    <button onClick={handleTransfer} disabled={isExecuting}>
      {isExecuting ? 'Processing...' : 'Transfer Tokens'}
    </button>
  );
}
```

### Direct Hook Usage

Using KRNL hooks directly:

```jsx
import { useKRNL, WorkflowStatusCode } from '@krnl-dev/sdk-react-7702';
import { usePrivy } from '@privy-io/react-auth';

function MyComponent() {
  const { login, authenticated } = usePrivy();
  const {
    isAuthorized,
    enableSmartAccount,
    executeWorkflow,
    resetSteps,
    statusCode,
    steps,
    currentStep,
    error
  } = useKRNL();

  // Step 1: Connect wallet
  const handleConnect = async () => {
    await login();
  };

  // Step 2: Authorize smart account
  const handleAuthorize = async () => {
    if (!isAuthorized) {
      await enableSmartAccount();
    }
  };

  // Step 3: Execute workflow
  const handleExecute = async () => {
    resetSteps(); // Clear previous state

    const workflow = {
      action: "your_action",
      params: { /* your params */ }
    };

    const result = await executeWorkflow(workflow);

    if (statusCode === WorkflowStatusCode.SUCCESS) {
      console.log('Workflow completed!');
    }
  };

  return (
    <div>
      {!authenticated && (
        <button onClick={handleConnect}>Connect Wallet</button>
      )}
      {authenticated && !isAuthorized && (
        <button onClick={handleAuthorize}>Authorize Smart Account</button>
      )}
      {isAuthorized && (
        <button onClick={handleExecute}>Execute Workflow</button>
      )}

      {/* Display workflow progress */}
      {steps.map(step => (
        <div key={step.id}>
          {step.title}: {step.status}
        </div>
      ))}
    </div>
  );
}
```

### Template Workflow Example

```jsx
import { useKRNLWorkflow } from '../hooks/useKRNLWorkflow';

function TemplateExample() {
  const { executeTemplateWorkflow } = useKRNLWorkflow();

  const handleTemplateWorkflow = async () => {
    const template = {
      action: "transfer_tokens",
      params: {
        from: "{{SENDER_ADDRESS}}",
        to: "{{RECIPIENT_ADDRESS}}",
        amount: "{{AMOUNT}}"
      }
    };

    const params = {
      "{{SENDER_ADDRESS}}": "0x123...",
      "{{RECIPIENT_ADDRESS}}": "0x456...",
      "{{AMOUNT}}": "1000"
    };

    const result = await executeTemplateWorkflow(template, params);
    
    if (result.success) {
      console.log('Template workflow succeeded!');
    }
  };

  return <button onClick={handleTemplateWorkflow}>Execute Template</button>;
}
```

## 🧪 Testing

Visit the KRNL Status page to test the integration:

1. Navigate to `/krnl-status` in your app
2. Click "Connect Wallet" to authenticate with Privy
3. Click "Authorize Smart Account" to enable EIP-7702 delegation
4. Click "Test Workflow" to verify KRNL Protocol integration

The status page shows:
- Configuration status
- Wallet connection status
- Smart account authorization status
- Workflow execution with step-by-step progress
- Error messages if any issues occur

## 📊 Workflow Status Codes

```javascript
WorkflowStatusCode.PENDING = 0           // Workflow queued
WorkflowStatusCode.PROCESSING = 1        // Workflow executing
WorkflowStatusCode.SUCCESS = 2           // Workflow completed
WorkflowStatusCode.FAILED = 3            // Execution failed
WorkflowStatusCode.INTENT_NOT_FOUND = 4  // Intent ID missing
WorkflowStatusCode.WORKFLOW_NOT_FOUND = 5 // Workflow missing
WorkflowStatusCode.INVALID = 6           // Invalid request
```

## 🔄 Workflow Steps

Each workflow progresses through these steps:

1. **Submit** (id: 1): Send workflow to KRNL node
2. **Execute** (id: 2): Off-chain execution (PENDING → PROCESSING → SUCCESS)
3. **On-chain Status** (id: 3): Monitor blockchain transaction confirmation

Step statuses:
- `pending`: Step not yet started
- `running`: Step currently executing
- `completed`: Step finished successfully
- `error`: Step failed with error

## 🔐 Why Privy?

KRNL requires Privy because it's currently one of the few wallet providers with full EIP-7702 support.

**EIP-7702 Benefits:**
- Temporary delegation of account authority
- Smart account capabilities on existing EOAs (no new contract deployment)
- Gasless transactions via delegation
- Enhanced security without complexity

Without Privy and EIP-7702, the KRNL smart account features cannot function.

## 🛠️ Troubleshooting

### Common Issues

**1. "VITE_PRIVY_APP_ID is not set"**
- Ensure `.env` file exists and contains `VITE_PRIVY_APP_ID`
- Restart dev server after changing `.env`

**2. "No embedded wallet found"**
- User must connect wallet via Privy first
- Check Privy authentication status

**3. "Failed to authorize smart account"**
- Ensure user is authenticated with Privy
- Check that embedded wallet exists
- Verify `VITE_DELEGATED_ACCOUNT_ADDRESS` is correct

**4. Workflow execution fails**
- Check workflow DSL structure is valid
- Verify KRNL node URL is accessible: `VITE_KRNL_NODE_URL`
- Ensure smart account is authorized
- Check browser console for detailed errors

**5. Environment variables not loading**
- Variables must start with `VITE_` prefix
- Restart dev server with `npm run dev`
- Check `.env` file is in project root

## 📁 File Structure

```
src/
├── lib/
│   └── krnl.ts                    # KRNL SDK configuration
├── providers/
│   └── PrivyProvider.jsx          # Privy authentication provider
├── hooks/
│   └── useKRNLWorkflow.js         # Custom KRNL workflow hook
├── pages/
│   └── KRNLStatus.jsx             # Integration test page
└── main.jsx                       # Provider setup
```

## 🎯 Next Steps

1. **Implement Event Ticketing Workflows:**
   - Ticket purchase workflow
   - Ticket transfer workflow
   - POAP/Badge minting workflow
   - QR verification workflow

2. **Add Error Handling:**
   - User-friendly error messages
   - Retry logic for failed workflows
   - Transaction status notifications

3. **Enhance UX:**
   - Loading states during workflow execution
   - Progress indicators for multi-step workflows
   - Success/failure notifications

4. **Production Preparation:**
   - Test on Sepolia testnet
   - Monitor workflow success rates
   - Implement analytics for workflow tracking

## 📚 Additional Resources

- [KRNL SDK Documentation](https://docs.krnl.xyz)
- [Privy Documentation](https://docs.privy.io)
- [EIP-7702 Specification](https://eips.ethereum.org/EIPS/eip-7702)
- [Viem Documentation](https://viem.sh)

## ✅ Integration Checklist

- [x] Install dependencies (`@krnl-dev/sdk-react-7702`, `@privy-io/react-auth`)
- [x] Configure environment variables
- [x] Set up KRNL config (`src/lib/krnl.ts`)
- [x] Configure Privy provider with EIP-7702 support
- [x] Wrap app with providers (Privy → KRNL)
- [x] Create custom workflow hook
- [x] Build test/status page
- [ ] Implement production workflows
- [ ] Add comprehensive error handling
- [ ] Test on Sepolia testnet
- [ ] Deploy to production

---

**Integration completed on:** January 28, 2026
**KRNL SDK Version:** 0.1.4
**Privy Version:** 3.11.0
