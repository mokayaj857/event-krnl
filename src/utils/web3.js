import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

// Import your contract ABI
import AvaraCoreABI from '../abis/AvaraCore.json';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const SEPOLIA_URL = import.meta.env.VITE_SEPOLIA_URL;

let provider;
let signer;
let contract;
let ethereum;

// Initialize Web3 and connect to MetaMask
export const initWeb3 = async () => {
  try {
    // Check if MetaMask is installed
    const provider = await detectEthereumProvider();
    
    if (provider) {
      ethereum = window.ethereum;
      
      // Request account access if needed
      await ethereum.request({ method: 'eth_requestAccounts' });
      
      // Create Web3 provider and signer
      const web3Provider = new ethers.providers.Web3Provider(ethereum);
      signer = web3Provider.getSigner();
      
      // Create contract instance
      contract = new ethers.Contract(CONTRACT_ADDRESS, AvaraCoreABI, signer);
      
      return { success: true, contract, signer, provider: web3Provider };
    } else {
      console.error('Please install MetaMask!');
      return { success: false, error: 'Please install MetaMask!' };
    }
  } catch (error) {
    console.error('Error initializing Web3:', error);
    return { success: false, error: error.message };
  }
};

// Get contract instance
export const getContract = () => {
  if (!contract) {
    throw new Error('Contract not initialized. Call initWeb3() first.');
  }
  return contract;
};

// Get signer
export const getSigner = () => {
  if (!signer) {
    throw new Error('Signer not initialized. Call initWeb3() first.');
  }
  return signer;
};

// Get provider
export const getProvider = () => {
  if (!provider) {
    provider = new ethers.providers.JsonRpcProvider(SEPOLIA_URL);
  }
  return provider;
};

// Check if MetaMask is connected
export const isMetaMaskConnected = async () => {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts && accounts.length > 0;
  }
  return false;
};
