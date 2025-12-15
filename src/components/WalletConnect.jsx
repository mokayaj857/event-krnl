import React from 'react';
import { Button, Text, HStack, Avatar, useToast } from '@chakra-ui/react';
import { useWeb3 } from '../context/Web3Context';

export const WalletConnect = () => {
  const { account, isConnected, connectWallet, isLoading } = useWeb3();
  const toast = useToast();

  const handleConnect = async () => {
    try {
      await connectWallet();
      toast({
        title: 'Wallet connected',
        description: 'Your wallet has been connected successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: 'Error connecting wallet',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Format the wallet address to show first and last 4 characters
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (isLoading) {
    return (
      <Button isLoading loadingText="Loading..." colorScheme="blue" variant="outline" />
    );
  }

  return (
    <HStack spacing={4}>
      {isConnected ? (
        <HStack
          px={4}
          py={2}
          borderRadius="full"
          bg="white"
          boxShadow="sm"
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Avatar size="sm" bg="blue.500" color="white" name={account} />
          <Text fontWeight="medium">{formatAddress(account)}</Text>
        </HStack>
      ) : (
        <Button
          onClick={handleConnect}
          colorScheme="blue"
          variant="solid"
          isLoading={isLoading}
          loadingText="Connecting..."
        >
          Connect Wallet
        </Button>
      )}
    </HStack>
  );
};

export default WalletConnect;
