import { ethers } from 'ethers';
import AvaraCoreABI from '../contracts/AvaraCore.json';
import POAPNFTABI from '../contracts/POAPNFT.json';
import TicketNFTABI from '../contracts/TicketNFT.json';

// Contract addresses - you'll need to replace these with your actual deployed contract addresses
const CONTRACT_ADDRESSES = {
  AvaraCore: import.meta.env.VITE_AVARA_CORE_ADDRESS || '0xYourAvaraCoreAddress',
  POAPNFT: import.meta.env.VITE_POAP_NFT_ADDRESS || '0xYourPOAPNFTAddress',
  TicketNFT: import.meta.env.VITE_TICKET_NFT_ADDRESS || '0xYourTicketNFTAddress',
};

// Get contract instance with signer for write operations
export const getAvaraCoreContract = (signerOrProvider) => {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.AvaraCore,
    AvaraCoreABI.abi,
    signerOrProvider
  );
};

export const getPOAPNFTContract = (signerOrProvider) => {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.POAPNFT,
    POAPNFTABI.abi,
    signerOrProvider
  );
};

export const getTicketNFTContract = (signerOrProvider) => {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.TicketNFT,
    TicketNFTABI.abi,
    signerOrProvider
  );
};

// Helper function to format token amounts
export const formatTokenAmount = (amount, decimals = 18) => {
  if (!amount) return '0';
  return ethers.utils.formatUnits(amount, decimals);
};

// Helper function to parse token amounts
export const parseTokenAmount = (amount, decimals = 18) => {
  if (!amount) return ethers.BigNumber.from(0);
  return ethers.utils.parseUnits(amount.toString(), decimals);
};

// Helper function to format wallet addresses
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Check if the current network is supported
export const isSupportedNetwork = async (provider) => {
  try {
    const network = await provider.getNetwork();
    // Add your supported network IDs here (e.g., 1 for Mainnet, 5 for Goerli, 11155111 for Sepolia)
    const supportedNetworks = [1, 5, 11155111];
    return supportedNetworks.includes(network.chainId);
  } catch (error) {
    console.error('Error checking network:', error);
    return false;
  }
};
