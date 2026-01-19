import { createConfig } from '@krnl-dev/sdk-react-7702';
import { sepolia } from 'viem/chains';

// Get environment variables with fallbacks for development
const delegatedContractAddress = import.meta.env.VITE_DELEGATED_ACCOUNT_ADDRESS as string || '0x0000000000000000000000000000000000000000';
const privyAppId = import.meta.env.VITE_PRIVY_APP_ID as string || 'development';
const krnlNodeUrl = import.meta.env.VITE_KRNL_NODE_URL as string || 'https://node.krnl.xyz';
const rpcUrl = import.meta.env.VITE_RPC_URL as string || 'https://lb.drpc.org/sepolia/AnRM4mK1tEyphrn_jexSLbrPxqT4wGIR760VIlZWwHzR';

// Create KRNL config with viem chain
export const config = createConfig({
  chain: sepolia as any,
  delegatedContractAddress,
  privyAppId,
  krnlNodeUrl,
  rpcUrl
});

// KRNL Kernel Types
export enum KernelType {
  TICKET = 'ticket',
  ATTENDANCE = 'attendance',
  MARKETPLACE = 'marketplace',
  REPUTATION = 'reputation'
}

// Ticket Kernel Actions
export enum TicketAction {
  MINT = 'MINT',
  TRANSFER = 'TRANSFER',
  SCAN = 'SCAN',
  INVALIDATE = 'INVALIDATE'
}

// Attendance Kernel Actions
export enum AttendanceAction {
  CHECKIN = 'CHECKIN',
  VERIFY_GEOFENCE = 'VERIFY_GEOFENCE',
  VERIFY_DEVICE = 'VERIFY_DEVICE',
  ISSUE_POAP = 'ISSUE_POAP'
}

// Marketplace Kernel Actions
export enum MarketplaceAction {
  LIST = 'LIST',
  BUY = 'BUY',
  CANCEL = 'CANCEL',
  UPDATE_PRICE = 'UPDATE_PRICE'
}

// Reputation Kernel Actions
export enum ReputationAction {
  UPDATE_SCORE = 'UPDATE_SCORE',
  ISSUE_BADGE = 'ISSUE_BADGE',
  CHECK_ELIGIBILITY = 'CHECK_ELIGIBILITY'
}

