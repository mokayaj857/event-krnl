import React from 'react';
import { Box, Heading, Text, Button, VStack, useToast } from '@chakra-ui/react';
import { useWeb3Context } from '../../context/Web3Context.jsx';

const EventManager = () => {
  const { contract, account, isConnected } = useWeb3Context();
  const toast = useToast();

  const handleCreateEvent = async () => {
    if (!isConnected) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet first',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Example: Call a function on your smart contract
      // const tx = await contract.createEvent("Event Name", Date.now() / 1000, 100);
      // await tx.wait();
      
      toast({
        title: 'Success',
        description: 'Event created successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create event',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5} borderWidth="1px" borderRadius="lg" boxShadow="md">
      <VStack spacing={4} align="stretch">
        <Heading as="h2" size="lg">Event Manager</Heading>
        <Text>Manage your events and tickets in one place</Text>
        
        <Button 
          colorScheme="blue" 
          onClick={handleCreateEvent}
          isDisabled={!isConnected}
        >
          Create New Event
        </Button>

        {!isConnected && (
          <Text color="red.500" fontSize="sm">
            Please connect your wallet to manage events
          </Text>
        )}

        {/* Add more event management UI components here */}
      </VStack>
    </Box>
  );
};

export default EventManager;
