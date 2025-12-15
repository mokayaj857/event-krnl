import { ethers } from 'ethers';
import AvaraABI from '../abi/Avara.json';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

// Get contract instance with signer for write operations
export const getContractWithSigner = (signer) => {
  if (!signer || !CONTRACT_ADDRESS) return null;
  return new ethers.Contract(CONTRACT_ADDRESS, AvaraABI.abi || AvaraABI, signer);
};

// Get contract instance with provider for read-only operations
export const getContractWithProvider = (provider) => {
  if (!provider || !CONTRACT_ADDRESS) return null;
  return new ethers.Contract(CONTRACT_ADDRESS, AvaraABI.abi || AvaraABI, provider);
};

// Format BigNumber to a readable number
export const formatTokenAmount = (amount, decimals = 18) => {
  if (!amount) return '0';
  return ethers.utils.formatUnits(amount, decimals);
};

// Parse a number to BigNumber with the specified decimals
export const parseTokenAmount = (amount, decimals = 18) => {
  if (!amount) return ethers.BigNumber.from(0);
  return ethers.utils.parseUnits(amount.toString(), decimals);
};

// Format wallet address to show first and last 4 characters
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Check if the current network is supported
export const isSupportedNetwork = async (provider) => {
  try {
    const network = await provider.getNetwork();
    // Add your supported network IDs here
    const supportedNetworks = [1, 5, 11155111]; // Mainnet, Goerli, Sepolia
    return supportedNetworks.includes(network.chainId);
  } catch (error) {
    console.error('Error checking network:', error);
    return false;
  }
};

// Switch to a specific network
export const switchNetwork = async (provider, chainId) => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
    return true;
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${chainId.toString(16)}`,
              // Add other chain parameters as needed
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error('Error adding network:', addError);
        return false;
      }
    }
    console.error('Error switching network:', switchError);
    return false;
  }
};
