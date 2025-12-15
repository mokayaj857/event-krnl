import { useState, useEffect } from 'react';
import { initWeb3, getContract, isMetaMaskConnected } from '../utils/web3';

export const useWeb3 = () => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize Web3 and set up event listeners
  useEffect(() => {
    const init = async () => {
      try {
        const { ethereum } = window;
        
        if (!ethereum) {
          setError('Please install MetaMask!');
          setLoading(false);
          return;
        }

        // Check if already connected
        const connected = await isMetaMaskConnected();
        if (connected) {
          await connectWallet();
        }
        
        // Set up account change listener
        ethereum.on('accountsChanged', handleAccountsChanged);
        
        // Set up chain change listener
        ethereum.on('chainChanged', handleChainChanged);
        
        setLoading(false);
      } catch (error) {
        console.error('Error initializing Web3:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    init();

    // Cleanup
    return () => {
      const { ethereum } = window;
      if (ethereum) {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await initWeb3();
      
      if (result.success) {
        const signer = await result.signer.getAddress();
        setAccount(signer);
        setContract(result.contract);
        setIsConnected(true);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setContract(null);
    setIsConnected(false);
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has disconnected all accounts
      disconnectWallet();
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
      // Re-initialize contract with new account
      connectWallet();
    }
  };

  const handleChainChanged = (chainId) => {
    // Reload the page when network changes
    window.location.reload();
  };

  return {
    account,
    contract,
    isConnected,
    loading,
    error,
    connectWallet,
    disconnectWallet,
  };
};

export default useWeb3;
