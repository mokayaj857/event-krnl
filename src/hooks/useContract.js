import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import AvaraABI from '../abi/Avara.json';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const SEPOLIA_URL = import.meta.env.VITE_SEPOLIA_URL;

export function useContract() {
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  // Initialize provider and signer
  useEffect(() => {
    const init = async () => {
      try {
        // Check if MetaMask is installed
        if (window.ethereum) {
          // Create Web3Provider
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(web3Provider);

          // Request account access if needed
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
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
            } else {
              setIsConnected(false);
              setAccount('');
              setContract(null);
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
        console.error('Error initializing contract:', err);
        setError(err.message);
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
      } else {
        setError('Please install MetaMask to connect your wallet');
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err.message);
    }
  };

  return {
    contract,
    provider,
    signer,
    account,
    isConnected,
    error,
    connectWallet,
  };
}
