import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Button, VStack, Input, Textarea, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Select } from '@chakra-ui/react';
import { useWeb3Context } from '../../context/Web3Context.jsx';
import { toaster } from '../../utils/toaster.js';
import { ethers } from 'ethers';

const EventManager = () => {
  const { contract, account, isConnected } = useWeb3Context();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    date: '',
    ticketPrice: '0.01',
    maxTickets: '100',
    category: '0' // 0 for General, 1 for VIP, etc.
  });

  // Load events on component mount
  useEffect(() => {
    if (isConnected && contract) {
      loadEvents();
    }
  }, [isConnected, contract]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      // Assuming your contract has a getEvents function
      const events = await contract.getEvents();
      setEvents(events);
    } catch (error) {
      console.error('Error loading events:', error);
      toaster.create({
        title: 'Error',
        description: 'Failed to load events',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateEvent = async () => {
    if (!isConnected) {
      toaster.create({
        title: 'Error',
        description: 'Please connect your wallet first',
        type: 'error',
      });
      return;
    }

    try {
      setLoading(true);
      const { name, description, date, ticketPrice, maxTickets, category } = eventData;
      
      // Convert values to appropriate types
      const eventDate = Math.floor(new Date(date).getTime() / 1000);
      const priceInWei = ethers.utils.parseEther(ticketPrice);
      const maxTicketsNum = parseInt(maxTickets);
      const categoryNum = parseInt(category);

      // Call the createEvent function on your smart contract
      const tx = await contract.createEvent(
        name,
        description,
        eventDate,
        priceInWei,
        maxTicketsNum,
        categoryNum
      );
      
      await tx.wait();
      
      // Refresh events list
      await loadEvents();
      
      // Reset form and close modal
      setEventData({
        name: '',
        description: '',
        date: '',
        ticketPrice: '0.01',
        maxTickets: '100',
        category: '0'
      });
      onClose();
      
      toaster.create({
        title: 'Success',
        description: 'Event created successfully!',
        type: 'success',
      });
    } catch (error) {
      console.error('Error creating event:', error);
      toaster.create({
        title: 'Error',
        description: error.message || 'Failed to create event',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={5} borderWidth="1px" borderRadius="lg" boxShadow="md">
      <VStack spacing={6} align="stretch">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Heading as="h2" size="lg">Event Manager</Heading>
            <Text color="gray.600">Manage your events and tickets in one place</Text>
          </Box>
          <Button 
            colorScheme="blue" 
            onClick={onOpen}
            isDisabled={!isConnected || loading}
            isLoading={loading}
            loadingText="Loading..."
          >
            Create New Event
          </Button>
        </Box>

        {!isConnected ? (
          <Text color="red.500" fontSize="md" textAlign="center" py={4}>
            Please connect your wallet to manage events
          </Text>
        ) : loading ? (
          <Text textAlign="center" py={4}>Loading events...</Text>
        ) : events.length === 0 ? (
          <Text textAlign="center" py={4} color="gray.500">
            No events found. Create your first event to get started.
          </Text>
        ) : (
          <Box mt={4}>
            <Heading size="md" mb={4}>Your Events</Heading>
            <VStack spacing={4} align="stretch">
              {events.map((event, index) => (
                <Box key={index} p={4} borderWidth="1px" borderRadius="md">
                  <Heading size="sm">{event.name}</Heading>
                  <Text fontSize="sm" color="gray.600" mt={1}>
                    {new Date(event.date * 1000).toLocaleDateString()}
                  </Text>
                  <Text mt={2}>{event.description}</Text>
                  <Text mt={2} fontWeight="bold">
                    {ethers.utils.formatEther(event.ticketPrice)} ETH
                  </Text>
                  <Text>Tickets: {event.ticketsSold?.toString() || '0'} / {event.maxTickets?.toString() || '0'}</Text>
                </Box>
              ))}
            </VStack>
          </Box>
        )}
      </VStack>

      {/* Create Event Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Event Name</FormLabel>
                <Input 
                  name="name"
                  value={eventData.name}
                  onChange={handleInputChange}
                  placeholder="Enter event name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={eventData.description}
                  onChange={handleInputChange}
                  placeholder="Enter event description"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Date & Time</FormLabel>
                <Input
                  type="datetime-local"
                  name="date"
                  value={eventData.date}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Ticket Price (ETH)</FormLabel>
                <Input
                  type="number"
                  name="ticketPrice"
                  value={eventData.ticketPrice}
                  onChange={handleInputChange}
                  min="0.01"
                  step="0.01"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Maximum Tickets</FormLabel>
                <Input
                  type="number"
                  name="maxTickets"
                  value={eventData.maxTickets}
                  onChange={handleInputChange}
                  min="1"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Category</FormLabel>
                <Select 
                  name="category" 
                  value={eventData.category}
                  onChange={handleInputChange}
                >
                  <option value="0">General</option>
                  <option value="1">VIP</option>
                  <option value="2">Exclusive</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={handleCreateEvent}
              isLoading={loading}
              loadingText="Creating..."
            >
              Create Event
            </Button>
            <Button onClick={onClose} isDisabled={loading}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EventManager;
