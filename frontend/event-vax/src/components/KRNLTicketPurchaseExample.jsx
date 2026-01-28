import { useState } from 'react';
import { useKRNLWorkflow } from '../hooks/useKRNLWorkflow';

/**
 * Example: KRNL-Powered Event Ticket Purchase
 * 
 * This component demonstrates how to integrate KRNL workflows
 * into the Event-Vax ticketing system.
 * 
 * Features:
 * - Wallet connection with Privy
 * - Smart account authorization (EIP-7702)
 * - Workflow execution for ticket purchase
 * - Step-by-step progress tracking
 */
const KRNLTicketPurchaseExample = ({ eventId, ticketPrice, eventName }) => {
  const [purchaseStatus, setPurchaseStatus] = useState('');

  const {
    executeCustomWorkflow,
    connectAndAuthorize,
    isExecuting,
    isAuthorized,
    privyAuthenticated,
    workflowError,
    steps,
    currentStep,
  } = useKRNLWorkflow();

  /**
   * Handle ticket purchase using KRNL workflow
   */
  const handlePurchaseTicket = async () => {
    try {
      setPurchaseStatus('Initiating purchase...');

      // Step 1: Ensure wallet is connected and authorized
      if (!isAuthorized) {
        setPurchaseStatus('Connecting wallet and authorizing...');
        const authorized = await connectAndAuthorize();
        if (!authorized) {
          setPurchaseStatus('❌ Failed to authorize wallet');
          return;
        }
      }

      // Step 2: Create ticket purchase workflow
      const ticketPurchaseWorkflow = {
        action: "purchase_event_ticket",
        params: {
          eventId: eventId,
          ticketPrice: ticketPrice,
          purchaser: "{{USER_WALLET}}", // Will be replaced with actual wallet
          timestamp: Date.now(),
          metadata: {
            eventName: eventName,
            purchaseMethod: "krnl_workflow"
          }
        }
      };

      setPurchaseStatus('🔄 Executing purchase workflow...');

      // Step 3: Execute workflow
      const result = await executeCustomWorkflow(ticketPurchaseWorkflow);

      // Step 4: Handle result
      if (result.success) {
        setPurchaseStatus('✅ Ticket purchased successfully!');
        console.log('Purchase result:', result.data);
        
        // Here you would typically:
        // - Update UI to show purchased ticket
        // - Mint NFT ticket
        // - Update database
        // - Show success notification
      } else if (result.processing) {
        setPurchaseStatus('⏳ Purchase is processing...');
      } else {
        setPurchaseStatus(`❌ Purchase failed: ${result.error?.message}`);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      setPurchaseStatus(`❌ Error: ${error.message}`);
    }
  };

  /**
   * Render workflow progress steps
   */
  const renderWorkflowSteps = () => {
    if (!steps || steps.length === 0) return null;

    return (
      <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          Workflow Progress:
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {steps.map((step) => (
            <div 
              key={step.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem',
                backgroundColor: getStepBackgroundColor(step.status),
                borderRadius: '4px',
                fontSize: '0.875rem'
              }}
            >
              <span>{step.title}</span>
              <span>{getStepIcon(step.status)}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
          Current Step: {currentStep || 0}
        </p>
      </div>
    );
  };

  return (
    <div style={{ 
      border: '1px solid #e2e8f0', 
      borderRadius: '12px', 
      padding: '1.5rem',
      maxWidth: '500px',
      margin: '2rem auto'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          {eventName || 'Event Ticket'}
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
          Purchase using KRNL Protocol
        </p>
      </div>

      {/* Ticket Info */}
      <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontWeight: '500' }}>Event ID:</span>
          <span style={{ fontFamily: 'monospace' }}>{eventId}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: '500' }}>Price:</span>
          <span style={{ fontWeight: 'bold', color: '#7c3aed' }}>{ticketPrice} ETH</span>
        </div>
      </div>

      {/* Connection Status */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem' }}>Wallet Connected:</span>
          <span>{privyAuthenticated ? '✅' : '❌'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem' }}>Smart Account Authorized:</span>
          <span>{isAuthorized ? '✅' : '❌'}</span>
        </div>
      </div>

      {/* Purchase Button */}
      <button
        onClick={handlePurchaseTicket}
        disabled={isExecuting}
        style={{
          width: '100%',
          padding: '1rem',
          backgroundColor: isExecuting ? '#94a3b8' : '#7c3aed',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: isExecuting ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          marginBottom: '1rem'
        }}
      >
        {isExecuting ? '⏳ Processing...' : '🎫 Purchase Ticket with KRNL'}
      </button>

      {/* Status Message */}
      {purchaseStatus && (
        <div style={{
          padding: '1rem',
          backgroundColor: purchaseStatus.includes('❌') ? '#fee2e2' : '#f0f9ff',
          color: purchaseStatus.includes('❌') ? '#991b1b' : '#1e40af',
          borderRadius: '8px',
          fontSize: '0.875rem',
          marginBottom: '1rem'
        }}>
          {purchaseStatus}
        </div>
      )}

      {/* Error Display */}
      {workflowError && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          borderRadius: '8px',
          fontSize: '0.875rem',
          marginBottom: '1rem'
        }}>
          <strong>Error:</strong> {workflowError.message}
        </div>
      )}

      {/* Workflow Steps */}
      {renderWorkflowSteps()}

      {/* Info */}
      <div style={{ 
        marginTop: '1rem', 
        padding: '0.75rem', 
        backgroundColor: '#fef3c7', 
        borderRadius: '6px',
        fontSize: '0.75rem',
        color: '#92400e'
      }}>
        <strong>ℹ️ About KRNL Workflow:</strong> This purchase uses KRNL Protocol for gasless, 
        secure transactions with EIP-7702 account abstraction. Your wallet will be authorized 
        temporarily for this transaction only.
      </div>
    </div>
  );
};

// Helper functions
const getStepBackgroundColor = (status) => {
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

export default KRNLTicketPurchaseExample;
