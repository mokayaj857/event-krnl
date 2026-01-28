# KRNL SDK Quick Reference

## 🚀 Quick Start

### 1. Import the Hook
```jsx
import { useKRNLWorkflow } from '../hooks/useKRNLWorkflow';
```

### 2. Use in Component
```jsx
const {
  executeCustomWorkflow,
  connectAndAuthorize,
  isAuthorized,
  isExecuting
} = useKRNLWorkflow();
```

### 3. Execute Workflow
```jsx
const handleAction = async () => {
  // Ensure authorized
  if (!isAuthorized) {
    await connectAndAuthorize();
  }

  // Execute workflow
  const workflow = {
    action: "your_action",
    params: { /* your params */ }
  };

  const result = await executeCustomWorkflow(workflow);
  
  if (result.success) {
    console.log('Success!', result.data);
  }
};
```

## 📦 Available Hooks

### useKRNLWorkflow (Custom Hook - Recommended)

```jsx
const {
  // Methods
  executeCustomWorkflow,      // Execute workflow DSL
  executeTemplateWorkflow,    // Execute with template
  connectAndAuthorize,        // Connect + authorize in one step
  ensureAuthorized,           // Check/ensure authorization

  // State
  isExecuting,                // Is workflow running?
  workflowError,              // Any errors
  workflowResult,             // Workflow result
  isAuthorized,               // Smart account authorized?
  isAuthenticated,            // KRNL authenticated?
  embeddedWallet,             // Wallet address
  steps,                      // Workflow steps array
  currentStep,                // Current step number (0-3)
  statusCode,                 // Workflow status code (0-6)
  privyAuthenticated,         // Privy auth status
} = useKRNLWorkflow();
```

### useKRNL (Direct SDK Hook)

```jsx
import { useKRNL } from '@krnl-dev/sdk-react-7702';

const {
  isAuthorized,              // Smart account authorized?
  isAuthenticated,           // KRNL authenticated?
  embeddedWallet,            // Wallet address
  enableSmartAccount,        // Authorize smart account
  executeWorkflow,           // Execute workflow DSL
  executeWorkflowFromTemplate, // Execute template
  resetSteps,                // Clear workflow state
  initializeSteps,           // Initialize steps
  steps,                     // Workflow steps
  currentStep,               // Current step (0-3)
  statusCode,                // Status code (0-6)
  error,                     // Error if any
} = useKRNL();
```

### usePrivy

```jsx
import { usePrivy } from '@privy-io/react-auth';

const {
  login,                     // Connect wallet
  logout,                    // Disconnect wallet
  ready,                     // Privy ready?
  authenticated,             // User authenticated?
  user,                      // User object
} = usePrivy();
```

## 🔢 Status Codes

```javascript
0 = PENDING              // Workflow queued
1 = PROCESSING           // Workflow executing
2 = SUCCESS              // Completed successfully
3 = FAILED               // Execution failed
4 = INTENT_NOT_FOUND     // Intent ID missing
5 = WORKFLOW_NOT_FOUND   // Workflow missing
6 = INVALID              // Invalid request
```

## 📊 Workflow Steps

```javascript
steps = [
  {
    id: 1,
    title: "Submit workflow",
    status: "completed",    // "pending" | "running" | "completed" | "error"
    error: undefined,       // Error message if failed
    result: { ... }         // Step result data
  },
  // ... more steps
];

currentStep = 2;  // Current step number (0 = idle, 1-3 = active)
```

## 🎯 Common Patterns

### Pattern 1: Simple Workflow
```jsx
const result = await executeCustomWorkflow({
  action: "transfer_tokens",
  params: { from: "0x...", to: "0x...", amount: "1000" }
});
```

### Pattern 2: Template Workflow
```jsx
const template = {
  action: "mint_nft",
  params: {
    to: "{{RECIPIENT}}",
    tokenId: "{{TOKEN_ID}}"
  }
};

const params = {
  "{{RECIPIENT}}": "0x123...",
  "{{TOKEN_ID}}": "42"
};

const result = await executeTemplateWorkflow(template, params);
```

### Pattern 3: Authorization Check
```jsx
// Quick check and authorize
if (!isAuthorized) {
  const success = await connectAndAuthorize();
  if (!success) {
    console.error('Failed to authorize');
    return;
  }
}
```

### Pattern 4: Progress Tracking
```jsx
{steps.map((step) => (
  <div key={step.id}>
    {step.title}: {step.status}
    {step.error && <span>{step.error}</span>}
  </div>
))}

<p>Current Step: {currentStep}</p>
<p>Status: {statusCode}</p>
```

### Pattern 5: Error Handling
```jsx
const result = await executeCustomWorkflow(workflow);

if (result.success) {
  // ✅ Success
  console.log('Data:', result.data);
} else if (result.processing) {
  // ⏳ Still processing
  console.log('Workflow is processing...');
} else if (result.error) {
  // ❌ Error
  console.error('Error:', result.error.message);
}
```

## 🔐 Authorization Flow

```
1. User clicks "Connect Wallet"
   → Privy login dialog appears
   → User authenticates

2. User clicks "Authorize Smart Account"
   → enableSmartAccount() called
   → User signs EIP-7702 authorization
   → Smart account enabled

3. User can now execute workflows
   → executeWorkflow() or executeCustomWorkflow()
   → KRNL processes workflow
   → Result returned
```

## 🌐 Environment Variables

Required in `.env`:

```bash
VITE_PRIVY_APP_ID=your_privy_app_id
VITE_KRNL_NODE_URL=https://v0-1-0.node.lat/
VITE_DELEGATED_ACCOUNT_ADDRESS=0x...
VITE_RPC_URL=https://... # Optional
```

## 📍 File Locations

```
src/
├── lib/krnl.ts                    # KRNL config
├── providers/PrivyProvider.jsx    # Privy provider
├── hooks/useKRNLWorkflow.js       # Custom hook
└── pages/KRNLStatus.jsx           # Test page
```

## 🧪 Testing

Visit `/krnl-status` to test:
1. Check configuration
2. Connect wallet
3. Authorize smart account
4. Execute test workflow

## ⚠️ Common Errors

| Error | Solution |
|-------|----------|
| "Please connect wallet first" | Call `connectAndAuthorize()` |
| "No embedded wallet" | Ensure Privy is connected |
| "Failed to authorize" | Check delegated contract address |
| "VITE_PRIVY_APP_ID not set" | Add to .env file |
| Workflow timeout | Check KRNL node URL |

## 💡 Tips

1. **Always check authorization before executing workflows**
   ```jsx
   if (!isAuthorized) await connectAndAuthorize();
   ```

2. **Reset steps before new workflow**
   ```jsx
   resetSteps(); // Clear previous state
   await executeWorkflow(workflow);
   ```

3. **Use custom hook for easier integration**
   ```jsx
   // Recommended ✅
   const { executeCustomWorkflow } = useKRNLWorkflow();
   
   // Also works, but more manual ⚠️
   const { executeWorkflow } = useKRNL();
   ```

4. **Monitor workflow progress**
   ```jsx
   console.log('Steps:', steps);
   console.log('Current:', currentStep);
   console.log('Status:', statusCode);
   ```

5. **Handle all result cases**
   ```jsx
   if (result.success) { /* Success */ }
   else if (result.processing) { /* Still running */ }
   else { /* Error */ }
   ```

## 📚 Examples

- Full integration test: [`/krnl-status`](src/pages/KRNLStatus.jsx)
- Custom hook: [`useKRNLWorkflow`](src/hooks/useKRNLWorkflow.js)
- Ticket purchase example: [`KRNLTicketPurchaseExample`](src/components/KRNLTicketPurchaseExample.jsx)
- Configuration: [`krnl.ts`](src/lib/krnl.ts)

---

**Need help?** Check [KRNL_INTEGRATION_COMPLETE.md](./KRNL_INTEGRATION_COMPLETE.md) for full documentation.
