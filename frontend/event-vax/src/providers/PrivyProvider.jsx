import React from 'react';
import { PrivyProvider as PrivyRootProvider } from '@privy-io/react-auth';

/**
 * Privy provider wrapper for KRNL wallet integration.
 *
 * Expects:
 * - VITE_PRIVY_APP_ID
 * - (optional) VITE_WALLETCONNECT_PROJECT_ID
 */
export const PrivyProvider = ({ children }) => {
  const appId = import.meta.env.VITE_PRIVY_APP_ID;

  // In dev, allow the app to run even if PRIVY_APP_ID is not set,
  // and simply skip initializing Privy. In prod, you should set this.
  if (!appId) {
    if (import.meta.env.DEV) {
      console.warn(
        '[PrivyProvider] VITE_PRIVY_APP_ID is not set. Skipping Privy initialization in dev.'
      );
      return <>{children}</>;
    }
    // In non-dev environments, fail fast so misconfiguration is obvious.
    throw new Error(
      'PrivyProvider: VITE_PRIVY_APP_ID is not configured. Please set it in your .env.'
    );
  }

  return (
    <PrivyRootProvider
      appId={appId}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#7C3AED',
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'all-users',
          },
        },
        walletConnectCloud: {
          projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '',
        },
      }}
    >
      {children}
    </PrivyRootProvider>
  );
};

export default PrivyProvider;
