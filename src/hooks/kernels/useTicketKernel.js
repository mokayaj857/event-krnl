import { useState, useCallback } from 'react';
import { useKRNLContext } from '../../context/KRNLContext';
import { TicketAction } from '../../lib/krnl';
import { ethers } from 'ethers';
import { getAvaraCoreContract } from '../../utils/contracts';

// Note: This hook uses KRNL SDK's transaction intent system
// The actual signature will be provided by KRNL's decentralized orchestrator

/**
 * Ticket Kernel Hook
 * Manages NFT-based event tickets with metadata and provenance tracking
 */
export const useTicketKernel = () => {
  const { createTransactionIntent, nodeConfig } = useKRNLContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Mint a ticket via KRNL-signed proof
   * @param {string} to - Recipient address
   * @param {string} uri - Ticket metadata URI
   * @param {number} eventId - Event ID
   * @param {object} metadata - Ticket metadata (seat, tier, venue, timestamps)
   * @returns {Promise<string>} Transaction hash
   */
  const mintTicket = useCallback(async (to, uri, eventId, metadata = {}) => {
    try {
      setLoading(true);
      setError(null);

      const timestamp = Math.floor(Date.now() / 1000);
      const nonce = Date.now();

      // Note: KRNL SDK will handle workflow creation and execution
      // The orchestrator will sign the transaction with the KRNL signature
      // For now, we prepare the transaction data
      // In production, this will be handled by KRNL's workflow system
      
      const contractAddress = import.meta.env.VITE_AVARA_CORE_ADDRESS;
      if (!contractAddress) {
        throw new Error('VITE_AVARA_CORE_ADDRESS not configured');
      }

      // Prepare transaction intent for KRNL
      // The actual signature will be provided by KRNL orchestrator
      const txData = encodeMintTicketData(to, uri, eventId, timestamp, nonce);
      
      // If createTransactionIntent is available, use it
      if (createTransactionIntent) {
        const result = await createTransactionIntent({
          to: contractAddress,
          data: txData,
          value: '0',
        });
        return { success: true, ticketId: result.ticketId || null, txHash: result.txHash };
      }

      // Fallback: Direct contract interaction (for development)
      const contract = getAvaraCoreContract(window.ethereum?.provider || window.ethereum);
      // Note: This requires the KRNL signature to be provided separately
      // In production, KRNL orchestrator handles this
      throw new Error('KRNL transaction intent system not fully configured. Please set up KRNL node.');

      return result;
    } catch (err) {
      console.error('Error minting ticket:', err);
      setError(err.message || 'Failed to mint ticket');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createTransactionIntent, nodeConfig]);

  /**
   * Record ticket provenance (created → sold → scanned → invalidated)
   */
  const recordProvenance = useCallback(async (ticketId, action, metadata = {}) => {
    try {
      setLoading(true);
      setError(null);

      const workflow = {
        name: 'RecordProvenance',
        steps: [
          {
            executor: 'http',
            config: {
              url: `${nodeConfig?.nodeUrl || 'https://node.krnl.xyz'}/api/ticket/provenance`,
              method: 'POST',
              body: JSON.stringify({
                ticketId,
                action,
                metadata,
                timestamp: Math.floor(Date.now() / 1000),
              }),
            },
          },
        ],
      };

      // Submit provenance record via KRNL
      return await createTransactionIntent({
        to: import.meta.env.VITE_AVARA_CORE_ADDRESS,
        data: encodeProvenanceData(ticketId, action),
        value: '0',
      });
    } catch (err) {
      console.error('Error recording provenance:', err);
      setError(err.message || 'Failed to record provenance');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createTransactionIntent, nodeConfig]);

  /**
   * Get ticket provenance history
   */
  const getProvenance = useCallback(async (ticketId) => {
    try {
      const contract = getAvaraCoreContract(window.ethereum);
      return await contract.getTicketProvenance(ticketId);
    } catch (err) {
      console.error('Error getting provenance:', err);
      throw err;
    }
  }, []);

  return {
    mintTicket,
    recordProvenance,
    getProvenance,
    loading,
    error,
  };
};

// Helper function to encode mint ticket data
function encodeMintTicketData(to, uri, eventId, timestamp, nonce) {
  const iface = new ethers.utils.Interface([
    'function mintTicketWithKrnl(address to, string calldata uri, uint256 eventId, uint256 timestamp, uint256 nonce, bytes calldata krnlSignature)'
  ]);
  // Note: krnlSignature will be provided by KRNL orchestrator
  return iface.encodeFunctionData('mintTicketWithKrnl', [to, uri, eventId, timestamp, nonce, '0x']);
}

// Helper function to encode provenance data
function encodeProvenanceData(ticketId, action) {
  const iface = new ethers.utils.Interface([
    'function recordProvenance(uint256 ticketId, string calldata action)'
  ]);
  return iface.encodeFunctionData('recordProvenance', [ticketId, action]);
}

