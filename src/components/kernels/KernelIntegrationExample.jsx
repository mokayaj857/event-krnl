import React from 'react';
import { Box, VStack, Heading, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import TicketKernelComponent from './TicketKernelComponent';
import AttendanceKernelComponent from './AttendanceKernelComponent';
import MarketplaceKernelComponent from './MarketplaceKernelComponent';
import ReputationKernelComponent from './ReputationKernelComponent';

/**
 * Example component demonstrating all four KRNL kernels
 * This can be integrated into your existing pages
 */
const KernelIntegrationExample = ({ eventId, ticketId, address }) => {
  return (
    <Box p={6} maxW="1200px" mx="auto">
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>KRNL Kernel Integration</Heading>
          <Text color="gray.600">
            Four composable kernels powering the Avara ticketing ecosystem
          </Text>
        </Box>

        <Tabs colorScheme="blue">
          <TabList>
            <Tab>🎫 Ticket Kernel</Tab>
            <Tab>✅ Attendance & POAP</Tab>
            <Tab>🛒 Marketplace</Tab>
            <Tab>⭐ Reputation</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <TicketKernelComponent 
                eventId={eventId || 1}
                onTicketMinted={(result) => {
                  console.log('Ticket minted:', result);
                }}
              />
            </TabPanel>

            <TabPanel>
              <AttendanceKernelComponent
                ticketId={ticketId || 1}
                eventId={eventId || 1}
                onCheckInSuccess={(result) => {
                  console.log('Check-in successful:', result);
                }}
              />
            </TabPanel>

            <TabPanel>
              <MarketplaceKernelComponent
                ticketId={ticketId || 1}
                eventId={eventId || 1}
              />
            </TabPanel>

            <TabPanel>
              <ReputationKernelComponent
                address={address}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
};

export default KernelIntegrationExample;

