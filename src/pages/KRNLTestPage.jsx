import React from 'react';
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import KRNLTestComponent from '../components/kernels/KRNLTestComponent';

/**
 * Test page for KRNL SDK integration
 * Access at /test-krnl route
 */
const KRNLTestPage = () => {
  return (
    <Container maxW="1200px" py={8}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="xl" mb={2}>KRNL SDK Integration Test</Heading>
          <Text color="gray.600">
            This page tests the KRNL SDK integration to ensure everything is working correctly.
          </Text>
        </Box>

        <KRNLTestComponent />
      </VStack>
    </Container>
  );
};

export default KRNLTestPage;

