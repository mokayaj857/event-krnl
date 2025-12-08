import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import toast from 'react-toastify';

export default function ConnectWalletButton() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [networkId, setNetworkId] = useState(null);

  // Function to connect to KRNL wallet
  const connectWallet = async () => {
    if (window.ethereum?.isKRNL) {
      try {
        setIsConnecting(true);
        
        // Request account access from KRNL wallet
        const accounts = await window.ethereum.request({ 
          method: 'krnl_requestAccounts' 
        });
        
        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts found in KRNL wallet');
        }

        // Get the signer from KRNL wallet
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        
        // Get the current network
        const network = await provider.getNetwork();
        
        // Update state
        setWalletAddress(address);
        setNetworkId(network.chainId);
        
        // Store the provider and signer for later use
        window.krnlProvider = provider;
        window.krnlSigner = signer;
        
        console.log('Connected to KRNL wallet:', { address, network });
        toast.success('KRNL Wallet connected!');
      } catch (error) {
        console.error('Error connecting KRNL wallet:', error);
        if (error.code === 4001) {
          toast.error('Connection request was rejected.');
        } else {
          toast.error('Failed to connect KRNL wallet. Please ensure it is installed and unlocked.');
        }
      } finally {
        setIsConnecting(false);
      }
    } else {
      toast.error('Please install the KRNL wallet extension to connect.');
      // Optionally provide a link to install KRNL
      window.open('https://krnl.gg/wallet', '_blank');
    }
  };

  // Function to disconnect the wallet
  const disconnectWallet = () => {
    setWalletAddress(null);
    setNetworkId(null);
    toast.info('Wallet disconnected.');
  };

  // Handle account and network changes
  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      console.log('Accounts changed:', accounts);
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
      } else {
        disconnectWallet();
      }
    };

    const handleChainChanged = (chainId) => {
      console.log('Chain changed:', chainId);
      // Just update the network ID without any specific chain validation
      const numericChainId = typeof chainId === 'string' ? parseInt(chainId, 16) : chainId;
      setNetworkId(numericChainId);
    };

    // Check if KRNL wallet is installed
    if (window.ethereum?.isKRNL) {
      console.log('KRNL wallet detected, setting up event listeners');
      
      // Set up event listeners for KRNL wallet
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      // Try to connect automatically if already authorized
      const checkConnection = async () => {
        try {
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' 
          });
          
          if (accounts && accounts.length > 0) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const network = await provider.getNetwork();
            const signer = provider.getSigner();
            
            setWalletAddress(accounts[0]);
            setNetworkId(network.chainId);
            window.krnlProvider = provider;
            window.krnlSigner = signer;
            
            console.log('Auto-connected to KRNL wallet:', {
              address: accounts[0],
              chainId: network.chainId
            });
          }
        } catch (error) {
          console.error('Error checking KRNL connection:', error);
        }
      };
      
      checkConnection().catch(console.error);
      
      checkConnection();
    }

    // Cleanup
    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  return (
    <div className="text-center">
      {/** Connect Wallet Button */}
      <button
        onClick={connectWallet}
        disabled={isConnecting || walletAddress}
        className={`rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 ${
          walletAddress ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-500 focus:ring-indigo-600'
        }`}
      >
        {isConnecting
          ? 'Connecting...'
          : walletAddress
          ? `Connected: ${walletAddress.slice(0, 6)}...`
          : 'Connect Wallet'}
      </button>

      {/** Display wallet info and disconnect button if connected */}
      {walletAddress && (
        <div className="mt-4">
          <p className="text-lg font-medium text-gray-500">
            Wallet Address: {walletAddress}
          </p>
          <p className="text-lg font-medium text-gray-500">
            Network ID: {networkId}
          </p>
          <button
            onClick={disconnectWallet}
            className="mt-2 rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
}





/***import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

export default function ConnectWalletButton() {
  const [walletAddress, setWalletAddress] = useState(null)

  // Function to connect the wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access from MetaMask
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        
        // Create an ethers provider
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        
        // Get the signer (the connected wallet)
        const signer = provider.getSigner()
        
        // Get the wallet address
        const address = await signer.getAddress()
        
        // Set the wallet address to state
        setWalletAddress(address)
        console.log('Connected wallet address:', address)
      } catch (error) {
        console.error('Error connecting wallet:', error)
        alert('Failed to connect wallet.')
      }
    } else {
      alert('Please install MetaMask or another Ethereum-compatible wallet to connect.')
    }
  }

  // Handle account and network changes
  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setWalletAddress(accounts[0])  // Set the first account address
      } else {
        setWalletAddress(null)
      }
    }

    const handleChainChanged = () => {
      window.location.reload()  // Reload to reflect network changes
    }

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)
    }

    // Cleanup listeners when the component is unmounted
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [])

  const disconnectWallet = () => setWalletAddress(null);


  return (
    <div className="text-center">
      {// Connect Wallet Button }
      <button
        onClick={connectWallet}  // Trigger wallet connection when clicked
        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
      >
        {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...` : 'Connect Wallet'}
      </button>

      {// Display the wallet address if connected }
      {walletAddress && (
        <div className="mt-4 text-lg font-medium text-gray-500">
          Wallet Address: {walletAddress}
        </div>
      )}
    </div>
  )
} ***/
