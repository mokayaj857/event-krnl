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
  const rawAppId = import.meta.env.VITE_PRIVY_APP_ID;
  const appId = rawAppId || (import.meta.env.PROD ? 'development' : undefined);

  // In dev, allow the app to run even if PRIVY_APP_ID is not set.
  if (!appId) {
    console.warn(
      '[PrivyProvider] VITE_PRIVY_APP_ID is not set. Skipping Privy initialization.'
    );
    return <>{children}</>;
  }

  if (appId === 'development' && import.meta.env.PROD) {
    console.warn(
      '[PrivyProvider] Using fallback Privy app id "development" in production. Set VITE_PRIVY_APP_ID to your real value.'
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
