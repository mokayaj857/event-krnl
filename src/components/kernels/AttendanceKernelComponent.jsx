import React, { useState } from 'react';
import { Box, Button, Input, VStack, Text, Heading, useToast, Checkbox } from '@chakra-ui/react';
import { useAttendanceKernel } from '../../hooks/kernels/useAttendanceKernel';
import { useWeb3Context } from '../../context/Web3Context';

/**
 * Attendance & POAP Kernel Component
 * Demonstrates check-in verification and POAP issuance with KRNL
 */
const AttendanceKernelComponent = ({ ticketId, eventId, onCheckInSuccess }) => {
  const { account, isConnected } = useWeb3Context();
  const { verifyCheckIn, issuePOAP, checkInAndMintPOAP, verifyGeofence, loading, error } = useAttendanceKernel();
  const toast = useToast();

  const [checkInData, setCheckInData] = useState({
    poapUri: '',
    soulbound: true,
    latitude: '',
    longitude: '',
    deviceId: '',
  });

  const handleCheckIn = async () => {
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
      const verificationData = {
        geofence: checkInData.latitude && checkInData.longitude ? {
          latitude: parseFloat(checkInData.latitude),
          longitude: parseFloat(checkInData.longitude),
        } : null,
        device: checkInData.deviceId ? { id: checkInData.deviceId } : null,
      };

      const result = await checkInAndMintPOAP(
        ticketId,
        eventId,
        checkInData.poapUri,
        verificationData
      );

      toast({
        title: 'Check-In Successful',
        description: 'POAP has been issued via KRNL verification',
        status: 'success',
        duration: 5000,
      });

      if (onCheckInSuccess) {
        onCheckInSuccess(result);
      }
    } catch (err) {
      toast({
        title: 'Check-In Failed',
        description: err.message || 'Failed to verify check-in',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleVerifyGeofence = async () => {
    if (!checkInData.latitude || !checkInData.longitude) {
      toast({
        title: 'Missing Location',
        description: 'Please provide latitude and longitude',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      await verifyGeofence(
        parseFloat(checkInData.latitude),
        parseFloat(checkInData.longitude),
        eventId
      );

      toast({
        title: 'Geofence Verified',
        description: 'Location verified successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: 'Verification Failed',
        description: err.message || 'Failed to verify geofence',
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Box p={5} borderWidth="1px" borderRadius="lg" boxShadow="md">
      <VStack spacing={4} align="stretch">
        <Heading size="md">✅ Attendance & POAP Kernel</Heading>
        <Text fontSize="sm" color="gray.600">
          Verify check-in and issue POAP NFTs with geofence, device, or multi-sensor verification via KRNL
        </Text>

        <Input
          placeholder="POAP Metadata URI"
          value={checkInData.poapUri}
          onChange={(e) => setCheckInData({ ...checkInData, poapUri: e.target.value })}
        />

        <Input
          placeholder="Latitude (for geofence)"
          type="number"
          value={checkInData.latitude}
          onChange={(e) => setCheckInData({ ...checkInData, latitude: e.target.value })}
        />

        <Input
          placeholder="Longitude (for geofence)"
          type="number"
          value={checkInData.longitude}
          onChange={(e) => setCheckInData({ ...checkInData, longitude: e.target.value })}
        />

        <Input
          placeholder="Device ID (optional)"
          value={checkInData.deviceId}
          onChange={(e) => setCheckInData({ ...checkInData, deviceId: e.target.value })}
        />

        <Checkbox
          isChecked={checkInData.soulbound}
          onChange={(e) => setCheckInData({ ...checkInData, soulbound: e.target.checked })}
        >
          Soulbound POAP (non-transferable)
        </Checkbox>

        <Button
          colorScheme="green"
          onClick={handleCheckIn}
          isLoading={loading}
          isDisabled={!isConnected || !checkInData.poapUri}
        >
          Check-In & Mint POAP via KRNL
        </Button>

        <Button
          variant="outline"
          onClick={handleVerifyGeofence}
          isDisabled={!checkInData.latitude || !checkInData.longitude}
        >
          Verify Geofence Only
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

export default AttendanceKernelComponent;

