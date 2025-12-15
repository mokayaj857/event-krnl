import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import AvaraABI from '../abi/Avara.json';

const Web3Context = createContext();

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const SEPOLIA_URL = import.meta.env.VITE_SEPOLIA_URL;

export const Web3Provider = ({ children }) => {
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize provider and signer
  useEffect(() => {
    const init = async () => {
      try {
        // Check if MetaMask is installed
        if (window.ethereum) {
          // Create Web3Provider
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(web3Provider);

          // Check if already connected
          const accounts = await web3Provider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            
            // Get signer
            const signer = web3Provider.getSigner();
            setSigner(signer);

            // Create contract instance
            const contract = new ethers.Contract(
              CONTRACT_ADDRESS,
              AvaraABI.abi || AvaraABI,
              signer
            );
            setContract(contract);
          }

          // Handle account changes
          window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length > 0) {
              setAccount(accounts[0]);
              const signer = web3Provider.getSigner();
              setSigner(signer);
              setContract(new ethers.Contract(CONTRACT_ADDRESS, AvaraABI.abi || AvaraABI, signer));
              setIsConnected(true);
            } else {
              setIsConnected(false);
              setAccount('');
              setContract(null);
              setSigner(null);
            }
          });
        } else {
          // Fallback to JsonRpcProvider if no MetaMask
          const provider = new ethers.providers.JsonRpcProvider(SEPOLIA_URL);
          setProvider(provider);
          const contract = new ethers.Contract(CONTRACT_ADDRESS, AvaraABI.abi || AvaraABI, provider);
          setContract(contract);
        }
      } catch (err) {
        console.error('Error initializing web3:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    init();

    // Cleanup
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setIsConnected(true);
        
        // Update signer and contract with the new account
        const signer = provider.getSigner();
        setSigner(signer);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, AvaraABI.abi || AvaraABI, signer);
        setContract(contract);
        
        return true;
      } else {
        setError('Please install MetaMask to connect your wallet');
        return false;
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err.message);
      return false;
    }
  };

  const value = {
    contract,
    provider,
    signer,
    account,
    isConnected,
    error,
    isLoading,
    connectWallet,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
