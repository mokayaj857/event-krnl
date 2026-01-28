import { createConfig } from '@krnl-dev/sdk-react-7702';
import { sepolia } from 'viem/chains';

/**
 * KRNL SDK Configuration for Event-Vax
 * 
 * KRNL Protocol requires:
 * - Privy for wallet integration (EIP-7702 support)
 * - Delegated contract address for account abstraction
 * - KRNL node endpoint for workflow execution
 */

const env = (import.meta as any).env || {};

// Get configuration from environment variables
const delegatedContractAddress =
  env.VITE_DELEGATED_ACCOUNT_ADDRESS ||
  '0x256ff3b9d3df415a05ba42beb5f186c28e103b2a';

const privyAppId = env.VITE_PRIVY_APP_ID || 'cmkxm04ce02yxjy0cwaybxum6';

// KRNL Protocol node endpoint - uses v0-1-0.node.lat as per official documentation
const krnlNodeUrl = env.VITE_KRNL_NODE_URL || 'https://v0-1-0.node.lat/';

// RPC URL - optional, KRNL uses optimized Privy RPC if not provided
const rpcUrl = env.VITE_RPC_URL || 
  'https://lb.drpc.org/sepolia/AnRM4mK1tEyphrn_jexSLbrPxqT4wGIR760VIlZWwHzR';

// Debug logging for development
console.log('🔧 KRNL SDK Configuration:', {
  chain: 'Sepolia',
  delegatedContractAddress,
  privyAppId: privyAppId.substring(0, 10) + '...',
  krnlNodeUrl,
  rpcUrl: rpcUrl.substring(0, 50) + '...',
  hasEnvVars: !!env.VITE_PRIVY_APP_ID
});

export const krnlConfig = createConfig({
  chain: sepolia,
  delegatedContractAddress,
  privyAppId,
  krnlNodeUrl,
  // rpcUrl is optional - uses KRNL-optimized Privy RPC if not provided
  rpcUrl,
});
