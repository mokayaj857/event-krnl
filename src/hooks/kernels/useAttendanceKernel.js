import { useState, useCallback } from 'react';
import { useKRNLContext } from '../../context/KRNLContext';
import { AttendanceAction } from '../../lib/krnl';
import { ethers } from 'ethers';
import { getAvaraCoreContract } from '../../utils/contracts';

/**
 * Attendance & POAP Kernel Hook
 * Manages check-in verification and POAP issuance
 */
export const useAttendanceKernel = () => {
  const { createTransactionIntent, nodeConfig } = useKRNLContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Verify check-in with geofence, device, or multi-sensor verification
   * @param {number} ticketId - Ticket ID
   * @param {number} eventId - Event ID
   * @param {object} verificationData - Geofence, device, or sensor data
   * @returns {Promise<object>} Verification result
   */
  const verifyCheckIn = useCallback(async (ticketId, eventId, verificationData = {}) => {
    try {
      setLoading(true);
      setError(null);

      const timestamp = Math.floor(Date.now() / 1000);
      const nonce = Date.now();

      // Create workflow for attendance verification via KRNL
      const workflow = {
        name: 'VerifyCheckIn',
        description: `Verify check-in for ticket ${ticketId}`,
        steps: [
          {
            executor: 'http',
            config: {
              url: `${nodeConfig?.nodeUrl || 'https://node.krnl.xyz'}/api/attendance/verify`,
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                action: AttendanceAction.CHECKIN,
                ticketId,
                eventId,
                verificationData: {
                  geofence: verificationData.geofence || null,
                  device: verificationData.device || null,
                  sensors: verificationData.sensors || [],
                  ...verificationData,
                },
                timestamp,
                nonce,
              }),
            },
          },
        ],
      };

      // Submit verification workflow to KRNL
      const result = await createTransactionIntent({
        to: import.meta.env.VITE_AVARA_CORE_ADDRESS,
        data: encodeCheckInData(ticketId, eventId, timestamp, nonce),
        value: '0',
      });

      return result;
    } catch (err) {
      console.error('Error verifying check-in:', err);
      setError(err.message || 'Failed to verify check-in');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createTransactionIntent, nodeConfig]);

  /**
   * Issue POAP NFT upon successful check-in
   * @param {number} ticketId - Ticket ID
   * @param {number} eventId - Event ID
   * @param {string} poapUri - POAP metadata URI
   * @param {boolean} soulbound - Whether POAP should be soulbound
   * @returns {Promise<string>} POAP token ID
   */
  const issuePOAP = useCallback(async (ticketId, eventId, poapUri, soulbound = true) => {
    try {
      setLoading(true);
      setError(null);

      const timestamp = Math.floor(Date.now() / 1000);
      const nonce = Date.now();

      // Create workflow for POAP issuance via KRNL
      const workflow = {
        name: 'IssuePOAP',
        description: `Issue POAP for event ${eventId}`,
        steps: [
          {
            executor: 'http',
            config: {
              url: `${nodeConfig?.nodeUrl || 'https://node.krnl.xyz'}/api/attendance/poap`,
              method: 'POST',
              body: JSON.stringify({
                action: AttendanceAction.ISSUE_POAP,
                ticketId,
                eventId,
                poapUri,
                soulbound,
                timestamp,
                nonce,
              }),
            },
          },
        ],
      };

      // Submit POAP issuance workflow
      const result = await createTransactionIntent({
        to: import.meta.env.VITE_AVARA_CORE_ADDRESS,
        data: encodePOAPIssueData(ticketId, eventId, poapUri, timestamp, nonce),
        value: '0',
      });

      return result;
    } catch (err) {
      console.error('Error issuing POAP:', err);
      setError(err.message || 'Failed to issue POAP');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createTransactionIntent, nodeConfig]);

  /**
   * Check-in and mint POAP in one transaction
   */
  const checkInAndMintPOAP = useCallback(async (ticketId, eventId, poapUri, verificationData = {}) => {
    try {
      setLoading(true);
      setError(null);

      // First verify check-in
      const verification = await verifyCheckIn(ticketId, eventId, verificationData);
      
      if (!verification.success) {
        throw new Error('Check-in verification failed');
      }

      // Then issue POAP
      const poapResult = await issuePOAP(ticketId, eventId, poapUri);
      
      return {
        verification,
        poap: poapResult,
      };
    } catch (err) {
      console.error('Error in check-in and POAP mint:', err);
      setError(err.message || 'Failed to check-in and mint POAP');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [verifyCheckIn, issuePOAP]);

  /**
   * Verify geofence location
   */
  const verifyGeofence = useCallback(async (latitude, longitude, eventId) => {
    try {
      const workflow = {
        name: 'VerifyGeofence',
        steps: [
          {
            executor: 'http',
            config: {
              url: `${nodeConfig?.nodeUrl || 'https://node.krnl.xyz'}/api/attendance/geofence`,
              method: 'POST',
              body: JSON.stringify({
                action: AttendanceAction.VERIFY_GEOFENCE,
                latitude,
                longitude,
                eventId,
                timestamp: Math.floor(Date.now() / 1000),
              }),
            },
          },
        ],
      };

      return await createTransactionIntent({
        to: import.meta.env.VITE_AVARA_CORE_ADDRESS,
        data: '0x',
        value: '0',
      });
    } catch (err) {
      console.error('Error verifying geofence:', err);
      throw err;
    }
  }, [createTransactionIntent, nodeConfig]);

  return {
    verifyCheckIn,
    issuePOAP,
    checkInAndMintPOAP,
    verifyGeofence,
    loading,
    error,
  };
};

// Helper function to encode check-in data
function encodeCheckInData(ticketId, eventId, timestamp, nonce) {
  const iface = new ethers.utils.Interface([
    'function checkInAndMintPOAP(uint256 ticketId, uint256 eventId, string calldata poapUri, uint256 timestamp, uint256 nonce, bytes calldata krnlSignature)'
  ]);
  // Note: krnlSignature will be provided by KRNL orchestrator
  return iface.encodeFunctionData('checkInAndMintPOAP', [ticketId, eventId, '', timestamp, nonce, '0x']);
}

// Helper function to encode POAP issue data
function encodePOAPIssueData(ticketId, eventId, poapUri, timestamp, nonce) {
  const iface = new ethers.utils.Interface([
    'function checkInAndMintPOAP(uint256 ticketId, uint256 eventId, string calldata poapUri, uint256 timestamp, uint256 nonce, bytes calldata krnlSignature)'
  ]);
  return iface.encodeFunctionData('checkInAndMintPOAP', [ticketId, eventId, poapUri, timestamp, nonce, '0x']);
}

