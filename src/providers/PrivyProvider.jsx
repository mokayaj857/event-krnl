import React from 'react';
import { PrivyProvider as PrivyProviderSDK } from '@privy-io/react-auth';

/**
 * Privy Provider wrapper
 * Required by KRNL SDK for wallet integration
 */
export const PrivyProvider = ({ children }) => {
  const privyAppId = import.meta.env.VITE_PRIVY_APP_ID || 'development';

  return (
    <PrivyProviderSDK
      appId={privyAppId}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
        },
      }}
    >
      {children}
    </PrivyProviderSDK>
  );
};

export default PrivyProvider;

