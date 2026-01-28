import { useEffect, useState } from 'react';
import { PrivyProvider as PrivyRootProvider } from '@privy-io/react-auth';
import { sepolia } from 'viem/chains';

/**
 * Privy Provider Wrapper for KRNL Integration
 *
 * Privy is required for KRNL SDK because:
 * - Full EIP-7702 account abstraction support
 * - Temporary delegation of account authority
 * - Smart account capabilities on existing EOAs
 * - Gasless transactions via delegation
 *
 * Environment Variables:
 * - VITE_PRIVY_APP_ID (required)
 * - VITE_WALLETCONNECT_PROJECT_ID (NOT USED - Privy embedded wallets only)
 *
 * IMPORTANT: KRNL uses ONLY Privy's embedded wallets.
 * External wallet extensions (MetaMask, Polkadot.js, etc.) are DISABLED
 * because they cause "Cannot redefine property: ethereum" conflicts.
 */

// Ensure wallet environment is clean
const ensureCleanWalletEnvironment = () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Verify ethereum is blocked at window level
    if (window.ethereum !== undefined) {
      console.warn('[PrivyProvider] External wallet detected. Privy will ignore it.');
    }
  } catch (e) {
    console.debug('[PrivyProvider] Wallet check:', e.message);
  }
};

export const PrivyProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const appId = import.meta.env.VITE_PRIVY_APP_ID;

  // Initialize on mount
  useEffect(() => {
    ensureCleanWalletEnvironment();
    setIsReady(true);
  }, []);

  // Require Privy App ID in production
  if (!appId) {
    console.error(
      '[PrivyProvider] VITE_PRIVY_APP_ID is not set. KRNL SDK requires Privy for EIP-7702 support.'
    );
    if (import.meta.env.PROD) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Configuration Error</h2>
          <p>VITE_PRIVY_APP_ID is required for KRNL SDK integration.</p>
          <p>Please set this in your .env file.</p>
        </div>
      );
    }
    // Allow dev mode to continue with warning
    return <>{children}</>;
  }

  if (!isReady) {
    return null; // Wait for wallet environment setup
  }

  return (
    <PrivyRootProvider
      appId={appId}
      config={{
        // Privy UI customization
        appearance: {
          theme: 'light',
          accentColor: '#7C3AED',
        },
        
        // CRITICAL: Enable embedded wallets for EIP-7702 support
        embeddedWallets: {
          createOnLogin: 'all-users', // Auto-create embedded wallet
          requireUserPasswordOnCreate: false, // Streamlined UX
        },

        // Default to Sepolia for KRNL Protocol
        defaultChain: sepolia,
        
        // Support additional chains if needed
        supportedChains: [sepolia],

        // CRITICAL: DISABLE all external wallets completely
        // Only use Privy's embedded wallets with EIP-7702
        // Do NOT initialize any external wallet connectors
        externalWallets: {
          injected: {
            shimDisableFlag: true,
          },
          walletConnect: {
            enabled: false,
          },
        },

        // ONLY email login - no external wallet options
        // This prevents Privy from trying to initialize wallet connectors
        loginMethods: ['email'],
      }}
    >
      {children}
    </PrivyRootProvider>
  );
};

export default PrivyProvider;
