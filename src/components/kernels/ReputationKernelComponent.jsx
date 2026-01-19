import React, { useState, useEffect } from 'react';
import { Box, Button, VStack, Text, Heading, useToast, Select, Badge } from '@chakra-ui/react';
import { useReputationKernel } from '../../hooks/kernels/useReputationKernel';
import { useWeb3Context } from '../../context/Web3Context';

/**
 * Reputation Kernel Component
 * Demonstrates reputation scores, badges, and fraud detection with KRNL AI
 */
const ReputationKernelComponent = ({ address }) => {
  const { account, isConnected } = useWeb3Context();
  const {
    getReputation,
    calculateReputation,
    issueBadge,
    checkEligibility,
    detectFraud,
    getReputationBreakdown,
    loading,
    error,
  } = useReputationKernel();
  const toast = useToast();

  const [reputation, setReputation] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [benefitType, setBenefitType] = useState('early_access');
  const [badgeType, setBadgeType] = useState('early_access');

  const targetAddress = address || account;

  useEffect(() => {
    if (targetAddress) {
      loadReputation();
    }
  }, [targetAddress]);

  const loadReputation = async () => {
    try {
      const rep = await getReputation(targetAddress);
      setReputation(rep.toString());

      const breakdownData = await getReputationBreakdown(targetAddress, 'all');
      setBreakdown(breakdownData);
    } catch (err) {
      console.error('Error loading reputation:', err);
    }
  };

  const handleCalculateReputation = async () => {
    try {
      const result = await calculateReputation(targetAddress, {
        organizer: null,
        category: null,
      });

      toast({
        title: 'Reputation Calculated',
        description: 'Reputation score updated using KRNL AI analysis',
        status: 'success',
        duration: 5000,
      });

      await loadReputation();
    } catch (err) {
      toast({
        title: 'Calculation Failed',
        description: err.message || 'Failed to calculate reputation',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleIssueBadge = async () => {
    try {
      const result = await issueBadge(targetAddress, badgeType);

      toast({
        title: 'Badge Issued',
        description: `${badgeType} badge has been issued`,
        status: 'success',
        duration: 5000,
      });
    } catch (err) {
      toast({
        title: 'Badge Issue Failed',
        description: err.message || 'Failed to issue badge',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleCheckEligibility = async () => {
    try {
      const result = await checkEligibility(targetAddress, benefitType);

      toast({
        title: 'Eligibility Checked',
        description: `Eligibility for ${benefitType}: ${result.eligible ? 'Eligible' : 'Not Eligible'}`,
        status: result.eligible ? 'success' : 'info',
        duration: 5000,
      });
    } catch (err) {
      toast({
        title: 'Check Failed',
        description: err.message || 'Failed to check eligibility',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleDetectFraud = async () => {
    try {
      const result = await detectFraud(targetAddress);

      toast({
        title: 'Fraud Detection Complete',
        description: result.isFraud
          ? '⚠️ Suspicious activity detected'
          : '✅ No fraud detected',
        status: result.isFraud ? 'warning' : 'success',
        duration: 5000,
      });
    } catch (err) {
      toast({
        title: 'Detection Failed',
        description: err.message || 'Failed to detect fraud',
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Box p={5} borderWidth="1px" borderRadius="lg" boxShadow="md">
      <VStack spacing={4} align="stretch">
        <Heading size="md">⭐ Reputation Kernel</Heading>
        <Text fontSize="sm" color="gray.600">
          Generate reputation scores, badges, and detect fraud using KRNL AI access layer
        </Text>

        {reputation !== null && (
          <Box p={3} bg="purple.50" borderRadius="md">
            <Text fontWeight="bold">Current Reputation Score</Text>
            <Badge colorScheme="purple" fontSize="xl" p={2}>
              {reputation} points
            </Badge>
          </Box>
        )}

        <Button
          colorScheme="purple"
          onClick={handleCalculateReputation}
          isLoading={loading}
          isDisabled={!targetAddress}
        >
          Calculate Reputation (KRNL AI)
        </Button>

        <Select
          value={badgeType}
          onChange={(e) => setBadgeType(e.target.value)}
          placeholder="Select Badge Type"
        >
          <option value="early_access">Early Access</option>
          <option value="vip">VIP</option>
          <option value="exclusive">Exclusive</option>
          <option value="loyalty">Loyalty</option>
        </Select>

        <Button
          colorScheme="blue"
          onClick={handleIssueBadge}
          isLoading={loading}
          isDisabled={!targetAddress}
        >
          Issue Badge
        </Button>

        <Select
          value={benefitType}
          onChange={(e) => setBenefitType(e.target.value)}
          placeholder="Select Benefit Type"
        >
          <option value="early_access">Early Access</option>
          <option value="exclusive_drops">Exclusive Drops</option>
          <option value="vip_tier">VIP Tier</option>
          <option value="discount">Discount</option>
        </Select>

        <Button
          colorScheme="green"
          onClick={handleCheckEligibility}
          isLoading={loading}
          isDisabled={!targetAddress}
        >
          Check Eligibility
        </Button>

        <Button
          colorScheme="orange"
          onClick={handleDetectFraud}
          isLoading={loading}
          isDisabled={!targetAddress}
        >
          Detect Fraud (KRNL AI)
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

export default ReputationKernelComponent;

