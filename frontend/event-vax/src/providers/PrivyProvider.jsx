import React from 'react';
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
 * - VITE_WALLETCONNECT_PROJECT_ID (optional)
 */
export const PrivyProvider = ({ children }) => {
  const appId = import.meta.env.VITE_PRIVY_APP_ID;

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

  return (
    <PrivyRootProvider
      appId={appId}
      config={{
        // Privy UI customization
        appearance: {
          theme: 'light',
          accentColor: '#7C3AED',
          logo: 'https://your-logo-url.com/logo.png', // Optional: Add your logo
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

        // WalletConnect support (optional)
        ...(import.meta.env.VITE_WALLETCONNECT_PROJECT_ID && {
          walletConnectCloudProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
        }),

        // Enable login methods
        loginMethods: ['email', 'wallet'],
        
        // Wallet configuration
        appearance: {
          theme: 'light',
          accentColor: '#7C3AED',
        },
      }}
    >
      {children}
    </PrivyRootProvider>
  );
};

export default PrivyProvider;
