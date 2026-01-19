import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Text, Button, Code, Alert, AlertIcon, Spinner } from '@chakra-ui/react';
import { useKRNLContext } from '../../context/KRNLContext';

/**
 * Test component to verify KRNL SDK integration
 * This component tests basic KRNL SDK functionality
 */
const KRNLTestComponent = () => {
  const [testResults, setTestResults] = useState({
    config: null,
    hooks: null,
    nodeConfig: null,
    error: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  let krnlContext;
  let error = null;

  try {
    krnlContext = useKRNLContext();
  } catch (err) {
    error = err.message;
  }

  useEffect(() => {
    const runTests = async () => {
      setIsLoading(true);
      const results = {
        config: null,
        hooks: null,
        nodeConfig: null,
        error: null,
      };

      try {
        // Test 1: Check if hooks are available
        if (krnlContext) {
          results.hooks = {
            available: true,
            methods: Object.keys(krnlContext).filter(key => typeof krnlContext[key] === 'function'),
            properties: Object.keys(krnlContext).filter(key => typeof krnlContext[key] !== 'function'),
          };

          // Test 2: Check node config
          if (krnlContext.nodeConfig) {
            results.nodeConfig = {
              available: true,
              nodeUrl: krnlContext.nodeUrl || 'Not available',
              configKeys: Object.keys(krnlContext.nodeConfig || {}),
            };
          } else {
            results.nodeConfig = {
              available: false,
              message: 'Node config not loaded yet',
            };
          }

          // Test 3: Check readiness
          results.config = {
            isReady: krnlContext.isReady || false,
            nodeUrl: krnlContext.nodeUrl || 'https://node.krnl.xyz',
          };
        } else {
          results.error = 'KRNL context not available';
        }
      } catch (err) {
        results.error = err.message || 'Unknown error';
      }

      setTestResults(results);
      setIsLoading(false);
    };

    // Small delay to allow hooks to initialize
    const timer = setTimeout(runTests, 1000);
    return () => clearTimeout(timer);
  }, [krnlContext]);

  if (error) {
    return (
      <Box p={5} borderWidth="1px" borderRadius="lg" boxShadow="md">
        <Alert status="error">
          <AlertIcon />
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold">KRNL SDK Error</Text>
            <Text>{error}</Text>
            <Text fontSize="sm" color="gray.600">
              Make sure KRNLProvider is properly wrapped around your app in main.jsx
            </Text>
          </VStack>
        </Alert>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box p={5} borderWidth="1px" borderRadius="lg" boxShadow="md">
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Testing KRNL SDK integration...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box p={5} borderWidth="1px" borderRadius="lg" boxShadow="md">
      <VStack spacing={6} align="stretch">
        <Heading size="md">🧪 KRNL SDK Test Results</Heading>

        {/* Configuration Test */}
        <Box p={4} bg="blue.50" borderRadius="md">
          <Text fontWeight="bold" mb={2}>✅ Configuration</Text>
          <VStack align="start" spacing={1} fontSize="sm">
            <Text>
              <strong>Ready:</strong> {testResults.config?.isReady ? '✅ Yes' : '❌ No'}
            </Text>
            <Text>
              <strong>Node URL:</strong> <Code>{testResults.config?.nodeUrl}</Code>
            </Text>
          </VStack>
        </Box>

        {/* Hooks Test */}
        {testResults.hooks && (
          <Box p={4} bg="green.50" borderRadius="md">
            <Text fontWeight="bold" mb={2}>✅ KRNL Hooks</Text>
            <VStack align="start" spacing={2} fontSize="sm">
              <Text>
                <strong>Available:</strong> {testResults.hooks.available ? '✅ Yes' : '❌ No'}
              </Text>
              <Text>
                <strong>Methods Found:</strong> {testResults.hooks.methods.length}
              </Text>
              {testResults.hooks.methods.length > 0 && (
                <Box>
                  <Text fontWeight="semibold">Available Methods:</Text>
                  <Code display="block" p={2} mt={1} fontSize="xs">
                    {testResults.hooks.methods.slice(0, 10).join(', ')}
                    {testResults.hooks.methods.length > 10 && '...'}
                  </Code>
                </Box>
              )}
              <Text>
                <strong>Properties:</strong> {testResults.hooks.properties.length}
              </Text>
            </VStack>
          </Box>
        )}

        {/* Node Config Test */}
        {testResults.nodeConfig && (
          <Box p={4} bg="purple.50" borderRadius="md">
            <Text fontWeight="bold" mb={2}>
              {testResults.nodeConfig.available ? '✅' : '⏳'} Node Configuration
            </Text>
            <VStack align="start" spacing={1} fontSize="sm">
              <Text>
                <strong>Available:</strong>{' '}
                {testResults.nodeConfig.available ? '✅ Yes' : '⏳ Loading...'}
              </Text>
              {testResults.nodeConfig.nodeUrl && (
                <Text>
                  <strong>Node URL:</strong> <Code>{testResults.nodeConfig.nodeUrl}</Code>
                </Text>
              )}
              {testResults.nodeConfig.configKeys.length > 0 && (
                <Text>
                  <strong>Config Keys:</strong>{' '}
                  <Code>{testResults.nodeConfig.configKeys.join(', ')}</Code>
                </Text>
              )}
              {testResults.nodeConfig.message && (
                <Text color="gray.600">{testResults.nodeConfig.message}</Text>
              )}
            </VStack>
          </Box>
        )}

        {/* Error Display */}
        {testResults.error && (
          <Alert status="error">
            <AlertIcon />
            <Text>{testResults.error}</Text>
          </Alert>
        )}

        {/* Summary */}
        <Box p={4} bg="gray.50" borderRadius="md">
          <Text fontWeight="bold" mb={2}>📊 Summary</Text>
          <VStack align="start" spacing={1} fontSize="sm">
            <Text>
              SDK Import: ✅ <Code>@krnl-dev/sdk-react-7702</Code>
            </Text>
            <Text>
              Provider Setup: ✅ <Code>KRNLProvider</Code> in main.jsx
            </Text>
            <Text>
              Context Hook: ✅ <Code>useKRNLContext</Code> available
            </Text>
            <Text>
              Configuration: {testResults.config?.isReady ? '✅ Ready' : '⏳ Loading'}
            </Text>
          </VStack>
        </Box>

        <Button
          colorScheme="blue"
          onClick={() => window.location.reload()}
          size="sm"
        >
          Refresh Test
        </Button>
      </VStack>
    </Box>
  );
};

export default KRNLTestComponent;

