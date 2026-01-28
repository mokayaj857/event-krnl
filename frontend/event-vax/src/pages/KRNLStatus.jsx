import React, { useState } from 'react';
import { useKRNL, WorkflowStatusCode } from '@krnl-dev/sdk-react-7702';
import { usePrivy } from '@privy-io/react-auth';

/**
 * KRNL SDK Integration Status & Test Page
 * 
 * Tests:
 * 1. Privy wallet connection (EIP-7702 support)
 * 2. KRNL SDK initialization
 * 3. Smart account authorization
 * 4. Workflow execution
 */
const KRNLStatus = () => {
  const [testStatus, setTestStatus] = useState('');
  const [workflowResult, setWorkflowResult] = useState(null);

  // Privy hooks
  const { 
    login, 
    logout, 
    ready: privyReady, 
    authenticated,
    user 
  } = usePrivy();

  // KRNL hooks
  const {
    isAuthorized,
    isAuthenticated,
    embeddedWallet,
    enableSmartAccount,
    executeWorkflow,
    resetSteps,
    steps,
    currentStep,
    statusCode,
    error,
  } = useKRNL();

  // Handler: Authorize KRNL smart account
  const handleAuthorize = async () => {
    try {
      setTestStatus('Authorizing KRNL smart account...');
      
      if (!embeddedWallet) {
        setTestStatus('❌ Error: No embedded wallet. Please connect wallet first.');
        return;
      }

      if (!isAuthorized) {
        const success = await enableSmartAccount();
        if (success) {
          setTestStatus('✅ KRNL smart account authorized successfully!');
        } else {
          setTestStatus('❌ Failed to authorize smart account');
        }
      } else {
        setTestStatus('ℹ️ Smart account already authorized');
      }
    } catch (err) {
      setTestStatus(`❌ Authorization error: ${err.message}`);
      console.error('Authorization error:', err);
    }
  };

  // Handler: Test workflow execution
  const handleTestWorkflow = async () => {
    try {
      if (!isAuthorized) {
        setTestStatus('❌ Please authorize smart account first');
        return;
      }

      setTestStatus('🔄 Executing test workflow...');
      resetSteps();

      // Simple test workflow DSL
      const testWorkflowDSL = {
        action: "test_action",
        params: {
          message: "KRNL SDK Integration Test",
          timestamp: Date.now()
        }
      };

      const result = await executeWorkflow(testWorkflowDSL);
      setWorkflowResult(result);

      if (statusCode === WorkflowStatusCode.SUCCESS) {
        setTestStatus('✅ Workflow executed successfully!');
      } else if (statusCode === WorkflowStatusCode.FAILED) {
        setTestStatus('❌ Workflow execution failed');
      } else if (statusCode === WorkflowStatusCode.PROCESSING) {
        setTestStatus('🔄 Workflow is processing...');
      } else {
        setTestStatus(`ℹ️ Workflow status: ${statusCode}`);
      }
    } catch (err) {
      setTestStatus(`❌ Workflow error: ${err.message}`);
      console.error('Workflow execution error:', err);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1.5rem' }}>
      <div style={{ 
        border: '1px solid #e2e8f0', 
        borderRadius: '8px', 
        padding: '1.5rem',
        backgroundColor: '#fff'
      }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          🔧 KRNL SDK Integration Status
        </h1>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
          Complete KRNL Protocol integration with EIP-7702 account abstraction
        </p>

        {/* Configuration Status */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            📋 Configuration
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <StatusRow label="Privy App ID" value={import.meta.env.VITE_PRIVY_APP_ID ? '✅ Set' : '❌ Missing'} />
              <StatusRow label="KRNL Node URL" value={import.meta.env.VITE_KRNL_NODE_URL || '❌ Missing'} />
              <StatusRow label="Delegated Contract" value={import.meta.env.VITE_DELEGATED_ACCOUNT_ADDRESS || '❌ Missing'} />
              <StatusRow label="RPC URL" value={import.meta.env.VITE_RPC_URL ? '✅ Set' : '❌ Missing'} />
            </tbody>
          </table>
        </div>

        {/* Privy Status */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            👛 Wallet Status (Privy)
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <StatusRow label="Privy Ready" value={privyReady ? '✅ Yes' : '⏳ Loading'} />
              <StatusRow label="Authenticated" value={authenticated ? '✅ Yes' : '❌ No'} />
              <StatusRow label="User Email" value={user?.email?.address || '—'} />
              <StatusRow label="Wallet Address" value={user?.wallet?.address?.substring(0, 10) + '...' || '—'} />
            </tbody>
          </table>
          
          <div style={{ marginTop: '1rem' }}>
            {!authenticated ? (
              <button onClick={login} style={buttonStyle}>
                🔐 Connect Wallet
              </button>
            ) : (
              <button onClick={logout} style={{ ...buttonStyle, backgroundColor: '#ef4444' }}>
                🚪 Disconnect
              </button>
            )}
          </div>
        </div>

        {/* KRNL Status */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            ⚡ KRNL Protocol Status
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <StatusRow label="SDK Authenticated" value={isAuthenticated ? '✅ Yes' : '❌ No'} />
              <StatusRow label="Smart Account Enabled" value={isAuthorized ? '✅ Yes' : '❌ No'} />
              <StatusRow label="Embedded Wallet" value={embeddedWallet ? `✅ ${embeddedWallet.substring(0, 10)}...` : '❌ None'} />
              <StatusRow label="Current Step" value={currentStep || '0 (Idle)'} />
              <StatusRow label="Status Code" value={getStatusCodeText(statusCode)} />
            </tbody>
          </table>

          {error && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              backgroundColor: '#fee2e2', 
              borderRadius: '6px',
              color: '#991b1b'
            }}>
              <strong>⚠️ SDK Error:</strong> {String(error)}
            </div>
          )}

          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={handleAuthorize} 
              disabled={!authenticated || isAuthorized}
              style={{
                ...buttonStyle,
                backgroundColor: isAuthorized ? '#10b981' : '#7c3aed',
                opacity: (!authenticated || isAuthorized) ? 0.5 : 1
              }}
            >
              {isAuthorized ? '✅ Authorized' : '🔑 Authorize Smart Account'}
            </button>
            
            <button 
              onClick={handleTestWorkflow}
              disabled={!isAuthorized}
              style={{
                ...buttonStyle,
                backgroundColor: '#3b82f6',
                opacity: !isAuthorized ? 0.5 : 1
              }}
            >
              🚀 Test Workflow
            </button>
          </div>
        </div>

        {/* Workflow Steps */}
        {steps && steps.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
              📊 Workflow Steps
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {steps.map((step) => (
                <div 
                  key={step.id}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    backgroundColor: getStepColor(step.status)
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{step.title}</strong>
                    <span>{getStepIcon(step.status)}</span>
                  </div>
                  {step.error && (
                    <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {step.error}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test Status */}
        {testStatus && (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f0f9ff', 
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            <strong>Test Status:</strong> {testStatus}
          </div>
        )}

        {/* Workflow Result */}
        {workflowResult && (
          <div style={{ marginTop: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Workflow Result:
            </h3>
            <pre style={{ 
              backgroundColor: '#1e293b', 
              color: '#e2e8f0', 
              padding: '1rem', 
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '0.875rem'
            }}>
              {JSON.stringify(workflowResult, null, 2)}
            </pre>
          </div>
        )}

        {/* Documentation */}
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          backgroundColor: '#f8fafc', 
          borderRadius: '6px',
          fontSize: '0.875rem',
          color: '#475569'
        }}>
          <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>📚 Integration Steps:</h3>
          <ol style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
            <li>Ensure all environment variables are set in .env</li>
            <li>Click "Connect Wallet" to authenticate with Privy</li>
            <li>Click "Authorize Smart Account" to enable EIP-7702 delegation</li>
            <li>Click "Test Workflow" to verify KRNL Protocol integration</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatusRow = ({ label, value }) => (
  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
    <td style={{ padding: '0.75rem', fontWeight: '500' }}>{label}</td>
    <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.875rem' }}>{value}</td>
  </tr>
);

// Helper Functions
const getStatusCodeText = (code) => {
  const statusMap = {
    0: '⏳ PENDING',
    1: '🔄 PROCESSING',
    2: '✅ SUCCESS',
    3: '❌ FAILED',
    4: '⚠️ INTENT_NOT_FOUND',
    5: '⚠️ WORKFLOW_NOT_FOUND',
    6: '❌ INVALID',
  };
  return statusMap[code] || `Unknown (${code})`;
};

const getStepColor = (status) => {
  const colors = {
    pending: '#fef3c7',
    running: '#dbeafe',
    completed: '#d1fae5',
    error: '#fee2e2',
  };
  return colors[status] || '#f3f4f6';
};

const getStepIcon = (status) => {
  const icons = {
    pending: '⏳',
    running: '🔄',
    completed: '✅',
    error: '❌',
  };
  return icons[status] || '—';
};

const buttonStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#7c3aed',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontWeight: '600',
  cursor: 'pointer',
  fontSize: '0.875rem',
  transition: 'all 0.2s',
};

export default KRNLStatus;
