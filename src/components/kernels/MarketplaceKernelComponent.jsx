import React, { useState, useEffect } from 'react';
import { Box, Button, Input, VStack, Text, Heading, useToast, HStack } from '@chakra-ui/react';
import { useMarketplaceKernel } from '../../hooks/kernels/useMarketplaceKernel';
import { useWeb3Context } from '../../context/Web3Context';
import { ethers } from 'ethers';

/**
 * Marketplace Kernel Component
 * Demonstrates ticket listing and purchasing with KRNL integration
 */
const MarketplaceKernelComponent = ({ ticketId, eventId }) => {
  const { account, isConnected } = useWeb3Context();
  const {
    listTicket,
    buyTicket,
    cancelListing,
    updatePrice,
    getListing,
    validateListingRules,
    loading,
    error,
  } = useMarketplaceKernel();
  const toast = useToast();

  const [price, setPrice] = useState('');
  const [listing, setListing] = useState(null);
  const [isListing, setIsListing] = useState(false);

  useEffect(() => {
    if (ticketId) {
      loadListing();
    }
  }, [ticketId]);

  const loadListing = async () => {
    try {
      const listingData = await getListing(ticketId);
      setListing(listingData);
      setIsListing(listingData?.active || false);
      if (listingData?.active && listingData?.price) {
        setPrice(ethers.utils.formatEther(listingData.price));
      }
    } catch (err) {
      console.error('Error loading listing:', err);
    }
  };

  const handleListTicket = async () => {
    if (!isConnected) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet first',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      // Validate listing rules first
      await validateListingRules(ticketId, price);

      const result = await listTicket(ticketId, price);

      toast({
        title: 'Ticket Listed',
        description: 'Ticket has been listed for sale via KRNL marketplace',
        status: 'success',
        duration: 5000,
      });

      await loadListing();
    } catch (err) {
      toast({
        title: 'Listing Failed',
        description: err.message || 'Failed to list ticket',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleBuyTicket = async () => {
    if (!isConnected) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet first',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      const listingPrice = listing?.price ? ethers.utils.formatEther(listing.price) : price;
      const result = await buyTicket(ticketId, listingPrice);

      toast({
        title: 'Ticket Purchased',
        description: 'Ticket purchase completed via KRNL (supports cross-chain payments)',
        status: 'success',
        duration: 5000,
      });

      await loadListing();
    } catch (err) {
      toast({
        title: 'Purchase Failed',
        description: err.message || 'Failed to purchase ticket',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleCancelListing = async () => {
    try {
      await cancelListing(ticketId);
      toast({
        title: 'Listing Cancelled',
        description: 'Ticket listing has been cancelled',
        status: 'success',
        duration: 3000,
      });
      await loadListing();
    } catch (err) {
      toast({
        title: 'Cancellation Failed',
        description: err.message || 'Failed to cancel listing',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleUpdatePrice = async () => {
    try {
      await updatePrice(ticketId, price);
      toast({
        title: 'Price Updated',
        description: 'Listing price has been updated',
        status: 'success',
        duration: 3000,
      });
      await loadListing();
    } catch (err) {
      toast({
        title: 'Update Failed',
        description: err.message || 'Failed to update price',
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Box p={5} borderWidth="1px" borderRadius="lg" boxShadow="md">
      <VStack spacing={4} align="stretch">
        <Heading size="md">🛒 Marketplace Kernel</Heading>
        <Text fontSize="sm" color="gray.600">
          Manage primary ticket sales and secondary resales with organizer rules enforcement via KRNL
        </Text>

        {listing && listing.active && (
          <Box p={3} bg="blue.50" borderRadius="md">
            <Text fontWeight="bold">Current Listing</Text>
            <Text>Price: {ethers.utils.formatEther(listing.price)} ETH</Text>
            <Text>Seller: {listing.seller}</Text>
          </Box>
        )}

        <Input
          placeholder="Price in ETH"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        {!isListing ? (
          <Button
            colorScheme="blue"
            onClick={handleListTicket}
            isLoading={loading}
            isDisabled={!isConnected || !price}
          >
            List Ticket for Sale via KRNL
          </Button>
        ) : (
          <HStack spacing={2}>
            <Button
              colorScheme="green"
              onClick={handleBuyTicket}
              isLoading={loading}
              isDisabled={!isConnected || listing?.seller === account}
            >
              Buy Ticket (Cross-Chain Supported)
            </Button>
            <Button
              variant="outline"
              onClick={handleUpdatePrice}
              isLoading={loading}
              isDisabled={listing?.seller !== account}
            >
              Update Price
            </Button>
            <Button
              variant="outline"
              colorScheme="red"
              onClick={handleCancelListing}
              isLoading={loading}
              isDisabled={listing?.seller !== account}
            >
              Cancel Listing
            </Button>
          </HStack>
        )}

        {error && (
          <Text color="red.500" fontSize="sm">
            {error}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default MarketplaceKernelComponent;

