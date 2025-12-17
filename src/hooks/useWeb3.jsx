import { useState, useEffect, useCallback } from 'react';
import { initWeb3, isMetaMaskConnected, checkNetwork } from '../utils/web3';

export const useWeb3 = () => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handle account changes
  const handleAccountsChanged = useCallback(async (accounts) => {
    try {
      if (!accounts || accounts.length === 0) {
        // MetaMask is locked or the user has disconnected all accounts
        setAccount('');
        setContract(null);
        setIsConnected(false);
      } else if (accounts[0] !== account) {
        // Only update if we have a valid account
        if (accounts[0]) {
          setAccount(accounts[0]);
          // Reconnect with the new account
          await connectWallet();
        }
      }
    } catch (error) {
      console.error('Error in handleAccountsChanged:', error);
      setError('Failed to handle account change');
    }
  }, [account]);

  // Handle chain changes
  const handleChainChanged = useCallback(() => {
    // Reload the page when network changes
    window.location.reload();
  }, []);

  // Initialize Web3 and set up event listeners
  useEffect(() => {
    let isMounted = true;
    
    const init = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      try {
        // Check if already connected
        const connected = await isMetaMaskConnected();
        if (connected) {
          await connectWallet();
        }
        
        // Set up account change listener
        if (window.ethereum) {
          // Handle both new and old MetaMask provider APIs
          const ethereum = window.ethereum.providers ? 
            window.ethereum.providers[0] : window.ethereum;
            
          if (ethereum) {
            ethereum.on('accountsChanged', handleAccountsChanged);
            ethereum.on('chainChanged', handleChainChanged);
          }
        }
      } catch (error) {
        console.error('Error initializing Web3:', error);
        if (isMounted) {
          setError(error.message || 'Failed to initialize Web3');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Add a small delay to ensure the provider is fully initialized
    const timer = setTimeout(init, 100);

    // Cleanup
    return () => {
      isMounted = false;
      clearTimeout(timer);
      
      if (window.ethereum) {
        const ethereum = window.ethereum.providers ? 
          window.ethereum.providers[0] : window.ethereum;
          
        if (ethereum) {
          try {
            ethereum.removeListener('accountsChanged', handleAccountsChanged);
            ethereum.removeListener('chainChanged', handleChainChanged);
          } catch (e) {
            console.error('Error removing listeners:', e);
          }
        }
      }
    };
  }, [handleAccountsChanged, handleChainChanged]);

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Ensure we have access to window.ethereum
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask not detected. Please install MetaMask.');
      }
      
      // Handle different provider APIs
      const ethereum = window.ethereum.providers ? 
        window.ethereum.providers[0] : window.ethereum;
      
      // Request account access if needed
      try {
        await ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        if (error.code === 4001) {
          // User rejected the request
          throw new Error('Please connect your MetaMask account to continue.');
        }
        throw error;
      }
      
      // Check if we're on the correct network
      const isCorrectNetwork = await checkNetwork();
      if (!isCorrectNetwork) {
        throw new Error('Please switch to the Sepolia testnet');
      }
      
      // Initialize Web3
      const result = await initWeb3();
      
      if (result && result.success) {
        setAccount(result.address || '');
        setContract(result.contract || null);
        setIsConnected(true);
        setError(null);
        return true;
      } else {
        throw new Error(result?.error || 'Failed to connect to wallet');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      const errorMessage = error.message || 'Failed to connect to wallet';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setContract(null);
    setIsConnected(false);
    setError(null);
  };

  return {
    account,
    contract,
    isConnected,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    provider: getProvider(),
  };
};
};

export default useWeb3;
