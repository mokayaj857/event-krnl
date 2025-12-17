import { ethers } from 'ethers';

// Import your contract ABI
import AvaraCoreABI from '../abis/AvaraCore.json';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const SEPOLIA_URL = import.meta.env.VITE_SEPOLIA_URL;

let provider;
let signer;
let contract;

// Initialize Web3 and connect to MetaMask
export const initWeb3 = async () => {
  try {
    // Check if window.ethereum is available
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('Please install MetaMask or another Web3 wallet!');
    }

    // Get the provider from window.ethereum
    const provider = window.ethereum;
    
    // Handle different provider APIs (MetaMask v9+ uses a different API)
    const isModernProvider = !!provider.providers;
    const ethereum = isModernProvider ? provider.providers[0] : provider;
    
    try {
      // Check if we need to request account access
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length === 0) {
        // Request account access if needed
        await ethereum.request({ method: 'eth_requestAccounts' });
      }
    } catch (error) {
      console.error('Error requesting accounts:', error);
      throw new Error('Failed to connect to MetaMask. Please try again.');
    }
    
    // Create Web3 provider and signer
    const web3Provider = new ethers.providers.Web3Provider(ethereum);
    
    // Get the signer
    signer = web3Provider.getSigner();
    let address;
    
    try {
      // Get the signer's address
      address = await signer.getAddress();
    } catch (error) {
      console.error('Error getting signer address:', error);
      throw new Error('Failed to get wallet address. Please check your wallet connection.');
    }
    
    // Create contract instance
    contract = new ethers.Contract(CONTRACT_ADDRESS, AvaraCoreABI, signer);
    
    return { 
      success: true, 
      contract, 
      signer, 
      provider: web3Provider,
      address
    };
  } catch (error) {
    console.error('Error initializing Web3:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to connect to wallet' 
    };
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
    if (typeof window !== 'undefined' && window.ethereum) {
      // Handle both modern and legacy MetaMask providers
      const ethereum = window.ethereum.providers ? 
        window.ethereum.providers[0] : window.ethereum;
      provider = new ethers.providers.Web3Provider(ethereum);
    } else if (SEPOLIA_URL) {
      provider = new ethers.providers.JsonRpcProvider(SEPOLIA_URL);
    } else {
      throw new Error('No Ethereum provider found and no fallback RPC URL provided');
    }
  }
  return provider;
};

// Check if MetaMask is connected
export const isMetaMaskConnected = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      return accounts && accounts.length > 0;
    } catch (error) {
      console.error('Error checking MetaMask connection:', error);
      return false;
    }
  }
  return false;
};

// Check if the correct network is connected
export const checkNetwork = async (requiredChainId = '0xaa36a7') => { // Default to Sepolia
  if (!window.ethereum) return false;
  
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== requiredChainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: requiredChainId }],
        });
        return true;
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          // Try to add the chain
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0xaa36a7', // Sepolia
                  chainName: 'Sepolia',
                  nativeCurrency: {
                    name: 'Sepolia ETH',
                    symbol: 'ETH',
                    decimals: 18,
                  },
                  rpcUrls: ['https://sepolia.infura.io/v3/YOUR_INFURA_KEY'],
                  blockExplorerUrls: ['https://sepolia.etherscan.io/'],
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
    }
    return true;
  } catch (error) {
    console.error('Error checking network:', error);
    return false;
  }
};
