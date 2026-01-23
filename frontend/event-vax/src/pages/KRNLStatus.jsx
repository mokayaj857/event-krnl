import React from 'react';
import { useKRNL } from '@krnl-dev/sdk-react-7702';

/**
 * Simple status page to verify that KRNL SDK is wired into the frontend/event-vax app.
 */
const KRNLStatus = () => {
  const {
    isReady,
    isAuthorized,
    smartAccountEnabled,
    delegatedContractAddress,
    error,
  } = useKRNL();

  return (
    <div
      style={{
        maxWidth: 640,
        margin: '2rem auto',
        padding: '1.5rem',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
      }}
    >
      <h1
        style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
        }}
      >
        KRNL SDK Status
      </h1>
      <p style={{ color: '#4a5568', marginBottom: '1rem' }}>
        This page verifies that the KRNL SDK and wallet integration are wired
        into the <code style={{ marginLeft: 4 }}>frontend/event-vax</code> app.
      </p>
      <ul style={{ listStyle: 'none', paddingLeft: 0, lineHeight: 1.8 }}>
        <li>
          <strong>SDK ready:</strong> {isReady ? '✅ Yes' : '⏳ Not yet'}
        </li>
        <li>
          <strong>Smart account enabled:</strong>{' '}
          {smartAccountEnabled ? '✅ Yes' : '—'}
        </li>
        <li>
          <strong>KRNL authorized:</strong> {isAuthorized ? '✅ Yes' : '—'}
        </li>
        <li>
          <strong>Delegated contract:</strong>{' '}
          {delegatedContractAddress || 'not set (VITE_DELEGATED_ACCOUNT_ADDRESS)'}
        </li>
      </ul>
      {error && (
        <p style={{ color: 'red', marginTop: '1rem' }}>
          <strong>SDK error:</strong> {String(error)}
        </p>
      )}
      <p style={{ fontSize: '0.9rem', color: '#718096', marginTop: '1rem' }}>
        To complete configuration, ensure you have set{' '}
        <code>VITE_PRIVY_APP_ID</code>, <code>VITE_KRNL_NODE_URL</code>,{' '}
        <code>VITE_RPC_URL</code>, and{' '}
        <code>VITE_DELEGATED_ACCOUNT_ADDRESS</code> in your <code>.env</code>{' '}
        file.
      </p>
    </div>
  );
};

export default KRNLStatus;
