import React, { useState } from 'react';
import { Box, Button, Input, VStack, Text, Heading, useToast } from '@chakra-ui/react';
import { useTicketKernel } from '../../hooks/kernels/useTicketKernel';
import { useWeb3Context } from '../../context/Web3Context';

/**
 * Ticket Kernel Component
 * Demonstrates ticket minting with KRNL integration
 */
const TicketKernelComponent = ({ eventId, onTicketMinted }) => {
  const { account, isConnected } = useWeb3Context();
  const { mintTicket, recordProvenance, getProvenance, loading, error } = useTicketKernel();
  const toast = useToast();

  const [ticketData, setTicketData] = useState({
    uri: '',
    seat: '',
    tier: '',
    venue: '',
  });

  const handleMintTicket = async () => {
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
      const metadata = {
        seat: ticketData.seat,
        tier: ticketData.tier,
        venue: ticketData.venue,
        timestamp: Date.now(),
      };

      const result = await mintTicket(account, ticketData.uri, eventId, metadata);
      
      toast({
        title: 'Ticket Minted',
        description: 'Ticket has been minted successfully via KRNL',
        status: 'success',
        duration: 5000,
      });

      // Record provenance
      await recordProvenance(result.ticketId, 'MINT', metadata);

      if (onTicketMinted) {
        onTicketMinted(result);
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to mint ticket',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleViewProvenance = async (ticketId) => {
    try {
      const provenance = await getProvenance(ticketId);
      toast({
        title: 'Provenance History',
        description: `Ticket has ${provenance.length} provenance records`,
        status: 'info',
        duration: 5000,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to get provenance',
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Box p={5} borderWidth="1px" borderRadius="lg" boxShadow="md">
      <VStack spacing={4} align="stretch">
        <Heading size="md">🎫 Ticket Kernel</Heading>
        <Text fontSize="sm" color="gray.600">
          Mint NFT-based event tickets with metadata and provenance tracking via KRNL
        </Text>

        <Input
          placeholder="Ticket Metadata URI"
          value={ticketData.uri}
          onChange={(e) => setTicketData({ ...ticketData, uri: e.target.value })}
        />

        <Input
          placeholder="Seat Number"
          value={ticketData.seat}
          onChange={(e) => setTicketData({ ...ticketData, seat: e.target.value })}
        />

        <Input
          placeholder="Tier (e.g., VIP, General)"
          value={ticketData.tier}
          onChange={(e) => setTicketData({ ...ticketData, tier: e.target.value })}
        />

        <Input
          placeholder="Venue"
          value={ticketData.venue}
          onChange={(e) => setTicketData({ ...ticketData, venue: e.target.value })}
        />

        <Button
          colorScheme="blue"
          onClick={handleMintTicket}
          isLoading={loading}
          isDisabled={!isConnected || !ticketData.uri}
        >
          Mint Ticket via KRNL
        </Button>

        {error && (
          <Text color="red.500" fontSize="sm">
            {error}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default TicketKernelComponent;

