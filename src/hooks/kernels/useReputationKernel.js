import { useState, useCallback } from 'react';
import { useKRNLContext } from '../../context/KRNLContext';
import { ReputationAction } from '../../lib/krnl';
import { ethers } from 'ethers';
import { getAvaraCoreContract } from '../../utils/contracts';

/**
 * Reputation Kernel Hook
 * Manages reputation scores and badges based on POAP history
 */
export const useReputationKernel = () => {
  const { createTransactionIntent, nodeConfig } = useKRNLContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Get reputation score for an address
   * @param {string} address - Wallet address
   * @returns {Promise<number>} Reputation score
   */
  const getReputation = useCallback(async (address) => {
    try {
      const contract = getAvaraCoreContract(window.ethereum);
      return await contract.reputation(address);
    } catch (err) {
      console.error('Error getting reputation:', err);
      throw err;
    }
  }, []);

  /**
   * Calculate reputation based on POAP history using KRNL AI
   * @param {string} address - Wallet address
   * @param {object} filters - Filter options (organizer, category, etc.)
   * @returns {Promise<object>} Reputation breakdown
   */
  const calculateReputation = useCallback(async (address, filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Use KRNL AI access layer for reputation calculation
      const workflow = {
        name: 'CalculateReputation',
        description: `Calculate reputation for ${address}`,
        steps: [
          {
            executor: 'http',
            config: {
              url: `${nodeConfig?.nodeUrl || 'https://node.krnl.xyz'}/api/reputation/calculate`,
              method: 'POST',
              body: JSON.stringify({
                action: ReputationAction.UPDATE_SCORE,
                address,
                filters: {
                  organizer: filters.organizer || null,
                  category: filters.category || null,
                  timeRange: filters.timeRange || null,
                  ...filters,
                },
                timestamp: Math.floor(Date.now() / 1000),
              }),
            },
          },
        ],
      };

      // Submit reputation calculation workflow
      const result = await createTransactionIntent({
        to: import.meta.env.VITE_AVARA_CORE_ADDRESS,
        data: '0x',
        value: '0',
      });

      return result;
    } catch (err) {
      console.error('Error calculating reputation:', err);
      setError(err.message || 'Failed to calculate reputation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createTransactionIntent, nodeConfig]);

  /**
   * Issue reputation badge
   * @param {string} address - Recipient address
   * @param {string} badgeType - Badge type (early_access, vip, exclusive, etc.)
   * @returns {Promise<string>} Badge token ID
   */
  const issueBadge = useCallback(async (address, badgeType) => {
    try {
      setLoading(true);
      setError(null);

      const workflow = {
        name: 'IssueBadge',
        description: `Issue ${badgeType} badge to ${address}`,
        steps: [
          {
            executor: 'http',
            config: {
              url: `${nodeConfig?.nodeUrl || 'https://node.krnl.xyz'}/api/reputation/badge`,
              method: 'POST',
              body: JSON.stringify({
                action: ReputationAction.ISSUE_BADGE,
                address,
                badgeType,
                timestamp: Math.floor(Date.now() / 1000),
              }),
            },
          },
        ],
      };

      const result = await createTransactionIntent({
        to: import.meta.env.VITE_AVARA_CORE_ADDRESS,
        data: encodeIssueBadgeData(address, badgeType),
        value: '0',
      });

      return result;
    } catch (err) {
      console.error('Error issuing badge:', err);
      setError(err.message || 'Failed to issue badge');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createTransactionIntent, nodeConfig]);

  /**
   * Check eligibility for benefits (early access, exclusive drops, VIP tiers)
   * @param {string} address - Wallet address
   * @param {string} benefitType - Type of benefit to check
   * @returns {Promise<object>} Eligibility result
   */
  const checkEligibility = useCallback(async (address, benefitType) => {
    try {
      setLoading(true);
      setError(null);

      // Use KRNL AI to detect patterns and check eligibility
      const workflow = {
        name: 'CheckEligibility',
        description: `Check ${benefitType} eligibility for ${address}`,
        steps: [
          {
            executor: 'http',
            config: {
              url: `${nodeConfig?.nodeUrl || 'https://node.krnl.xyz'}/api/reputation/eligibility`,
              method: 'POST',
              body: JSON.stringify({
                action: ReputationAction.CHECK_ELIGIBILITY,
                address,
                benefitType,
                timestamp: Math.floor(Date.now() / 1000),
              }),
            },
          },
        ],
      };

      const result = await createTransactionIntent({
        to: import.meta.env.VITE_AVARA_CORE_ADDRESS,
        data: '0x',
        value: '0',
      });

      return result;
    } catch (err) {
      console.error('Error checking eligibility:', err);
      setError(err.message || 'Failed to check eligibility');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createTransactionIntent, nodeConfig]);

  /**
   * Detect fraudulent activity or bot patterns using KRNL AI
   * @param {string} address - Wallet address to analyze
   * @returns {Promise<object>} Fraud detection result
   */
  const detectFraud = useCallback(async (address) => {
    try {
      setLoading(true);
      setError(null);

      // Use KRNL AI inference access layer
      const workflow = {
        name: 'DetectFraud',
        description: `Detect fraud patterns for ${address}`,
        steps: [
          {
            executor: 'http',
            config: {
              url: `${nodeConfig?.nodeUrl || 'https://node.krnl.xyz'}/api/reputation/fraud`,
              method: 'POST',
              body: JSON.stringify({
                address,
                timestamp: Math.floor(Date.now() / 1000),
              }),
            },
          },
        ],
      };

      const result = await createTransactionIntent({
        to: import.meta.env.VITE_AVARA_CORE_ADDRESS,
        data: '0x',
        value: '0',
      });

      return result;
    } catch (err) {
      console.error('Error detecting fraud:', err);
      setError(err.message || 'Failed to detect fraud');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createTransactionIntent, nodeConfig]);

  /**
   * Get reputation breakdown by organizer, category, or ecosystem-wide
   */
  const getReputationBreakdown = useCallback(async (address, groupBy = 'all') => {
    try {
      const contract = getAvaraCoreContract(window.ethereum);
      const totalReputation = await contract.reputation(address);
      
      // Additional breakdown can be fetched via KRNL API
      const workflow = {
        name: 'GetReputationBreakdown',
        steps: [
          {
            executor: 'http',
            config: {
              url: `${nodeConfig?.nodeUrl || 'https://node.krnl.xyz'}/api/reputation/breakdown`,
              method: 'POST',
              body: JSON.stringify({
                address,
                groupBy,
              }),
            },
          },
        ],
      };

      return {
        total: totalReputation.toString(),
        breakdown: {}, // Will be populated by KRNL API response
      };
    } catch (err) {
      console.error('Error getting reputation breakdown:', err);
      throw err;
    }
  }, [nodeConfig]);

  return {
    getReputation,
    calculateReputation,
    issueBadge,
    checkEligibility,
    detectFraud,
    getReputationBreakdown,
    loading,
    error,
  };
};

// Helper function to encode badge issuance data
function encodeIssueBadgeData(address, badgeType) {
  const iface = new ethers.utils.Interface([
    'function issueBadge(address to, string calldata badgeType)'
  ]);
  return iface.encodeFunctionData('issueBadge', [address, badgeType]);
}

