import { createConfig } from '@krnl-dev/sdk-react-7702';
import { sepolia } from 'viem/chains';

// KRNL SDK configuration for the frontend/event-vax app
// Uses environment variables with sensible fallbacks so the app still runs in dev.

const env = (import.meta as any).env || {};

const delegatedContractAddress =
  env.VITE_DELEGATED_ACCOUNT_ADDRESS ||
  '0x0000000000000000000000000000000000000000';

const privyAppId = env.VITE_PRIVY_APP_ID || 'development';

const krnlNodeUrl = env.VITE_KRNL_NODE_URL || 'https://node.krnl.xyz';

const rpcUrl =
  env.VITE_RPC_URL ||
  'https://lb.drpc.org/sepolia/AnRM4mK1tEyphrn_jexSLbrPxqT4wGIR760VIlZWwHzR';

export const krnlConfig = createConfig({
  // KRNL currently supports EVM chains; using Sepolia as default backing chain.
  chain: sepolia as any,
  delegatedContractAddress,
  privyAppId,
  krnlNodeUrl,
  rpcUrl,
});
