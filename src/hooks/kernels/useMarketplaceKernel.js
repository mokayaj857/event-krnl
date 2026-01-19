import { useState, useCallback } from 'react';
import { useKRNLContext } from '../../context/KRNLContext';
import { MarketplaceAction } from '../../lib/krnl';
import { ethers } from 'ethers';
import { getAvaraCoreContract } from '../../utils/contracts';

/**
 * Marketplace Kernel Hook
 * Manages primary ticket sales and secondary resales
 */
export const useMarketplaceKernel = () => {
  const { createTransactionIntent, nodeConfig } = useKRNLContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * List a ticket for sale
   * @param {number} ticketId - Ticket ID
   * @param {string} price - Price in ETH
   * @returns {Promise<string>} Transaction hash
   */
  const listTicket = useCallback(async (ticketId, price) => {
    try {
      setLoading(true);
      setError(null);

      const priceInWei = ethers.utils.parseEther(price.toString());

      // Create workflow for listing via KRNL
      const workflow = {
        name: 'ListTicket',
        description: `List ticket ${ticketId} for sale`,
        steps: [
          {
            executor: 'http',
            config: {
              url: `${nodeConfig?.nodeUrl || 'https://node.krnl.xyz'}/api/marketplace/list`,
              method: 'POST',
              body: JSON.stringify({
                action: MarketplaceAction.LIST,
                ticketId,
                price: priceInWei.toString(),
                timestamp: Math.floor(Date.now() / 1000),
              }),
            },
          },
        ],
      };

      const result = await createTransactionIntent({
        to: import.meta.env.VITE_AVARA_CORE_ADDRESS,
        data: encodeListTicketData(ticketId, priceInWei),
        value: '0',
      });

      return result;
    } catch (err) {
      console.error('Error listing ticket:', err);
      setError(err.message || 'Failed to list ticket');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createTransactionIntent, nodeConfig]);

  /**
   * Buy a listed ticket
   * @param {number} ticketId - Ticket ID
   * @param {string} price - Price in ETH
   * @returns {Promise<string>} Transaction hash
   */
  const buyTicket = useCallback(async (ticketId, price) => {
    try {
      setLoading(true);
      setError(null);

      const priceInWei = ethers.utils.parseEther(price.toString());

      // Create workflow for buying via KRNL (supports cross-chain payments)
      const workflow = {
        name: 'BuyTicket',
        description: `Buy ticket ${ticketId}`,
        steps: [
          {
            executor: 'http',
            config: {
              url: `${nodeConfig?.nodeUrl || 'https://node.krnl.xyz'}/api/marketplace/buy`,
              method: 'POST',
              body: JSON.stringify({
                action: MarketplaceAction.BUY,
                ticketId,
                price: priceInWei.toString(),
                timestamp: Math.floor(Date.now() / 1000),
              }),
            },
          },
        ],
      };

      const result = await createTransactionIntent({
        to: import.meta.env.VITE_AVARA_CORE_ADDRESS,
        data: encodeBuyTicketData(ticketId),
        value: priceInWei.toString(),
      });

      return result;
    } catch (err) {
      console.error('Error buying ticket:', err);
      setError(err.message || 'Failed to buy ticket');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createTransactionIntent, nodeConfig]);

  /**
   * Cancel a listing
   */
  const cancelListing = useCallback(async (ticketId) => {
    try {
      setLoading(true);
      setError(null);

      const result = await createTransactionIntent({
        to: import.meta.env.VITE_AVARA_CORE_ADDRESS,
        data: encodeCancelListingData(ticketId),
        value: '0',
      });

      return result;
    } catch (err) {
      console.error('Error canceling listing:', err);
      setError(err.message || 'Failed to cancel listing');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createTransactionIntent]);

  /**
   * Update listing price
   */
  const updatePrice = useCallback(async (ticketId, newPrice) => {
    try {
      setLoading(true);
      setError(null);

      const priceInWei = ethers.utils.parseEther(newPrice.toString());

      const result = await createTransactionIntent({
        to: import.meta.env.VITE_AVARA_CORE_ADDRESS,
        data: encodeListTicketData(ticketId, priceInWei),
        value: '0',
      });

      return result;
    } catch (err) {
      console.error('Error updating price:', err);
      setError(err.message || 'Failed to update price');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createTransactionIntent]);

  /**
   * Get listing details
   */
  const getListing = useCallback(async (ticketId) => {
    try {
      const contract = getAvaraCoreContract(window.ethereum);
      return await contract.listings(ticketId);
    } catch (err) {
      console.error('Error getting listing:', err);
      throw err;
    }
  }, []);

  /**
   * Check if listing respects organizer rules (price caps, max transfers)
   */
  const validateListingRules = useCallback(async (ticketId, price) => {
    try {
      const contract = getAvaraCoreContract(window.ethereum);
      const listing = await contract.listings(ticketId);
      const ticket = await contract.tickets.ticketEvent(ticketId);
      const rules = await contract.rules(ticket);

      // Check price cap
      if (rules.maxResalePrice > 0) {
        const priceInWei = ethers.utils.parseEther(price.toString());
        if (priceInWei.gt(rules.maxResalePrice)) {
          throw new Error('Price exceeds maximum resale price');
        }
      }

      // Check transfer limit
      if (rules.maxTransfers > 0) {
        const transfers = await contract.ticketTransfers(ticketId);
        if (transfers.gte(rules.maxTransfers)) {
          throw new Error('Maximum transfers reached');
        }
      }

      return { valid: true, rules };
    } catch (err) {
      console.error('Error validating listing rules:', err);
      throw err;
    }
  }, []);

  return {
    listTicket,
    buyTicket,
    cancelListing,
    updatePrice,
    getListing,
    validateListingRules,
    loading,
    error,
  };
};

// Helper functions to encode contract data
function encodeListTicketData(ticketId, price) {
  const iface = new ethers.utils.Interface([
    'function listTicket(uint256 ticketId, uint256 price)'
  ]);
  return iface.encodeFunctionData('listTicket', [ticketId, price]);
}

function encodeBuyTicketData(ticketId) {
  const iface = new ethers.utils.Interface([
    'function buyTicket(uint256 ticketId) payable'
  ]);
  return iface.encodeFunctionData('buyTicket', [ticketId]);
}

function encodeCancelListingData(ticketId) {
  const iface = new ethers.utils.Interface([
    'function cancelListing(uint256 ticketId)'
  ]);
  return iface.encodeFunctionData('cancelListing', [ticketId]);
}

