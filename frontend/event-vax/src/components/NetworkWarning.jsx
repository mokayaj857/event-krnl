import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { AlertTriangle, X } from 'lucide-react';

const NetworkWarning = () => {
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [currentChainId, setCurrentChainId] = useState(null);
  const [showWarning, setShowWarning] = useState(true);
  
  const EXPECTED_CHAIN_ID = 43113; // Avalanche Fuji

  useEffect(() => {
    checkNetwork();

    if (window.ethereum) {
      window.ethereum.on('chainChanged', checkNetwork);
      return () => {
        window.ethereum.removeListener('chainChanged', checkNetwork);
      };
    }
  }, []);

  const checkNetwork = async () => {
    if (typeof window.ethereum === 'undefined') return;
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      
      setCurrentChainId(chainId);
      setIsWrongNetwork(chainId !== EXPECTED_CHAIN_ID);
    } catch (error) {
      console.error('Error checking network:', error);
    }
  };

  const switchToAvalanche = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xA869' }], // 43113 in hex
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xA869',
              chainName: 'Avalanche Fuji C-Chain',
              nativeCurrency: {
                name: 'Avalanche',
                symbol: 'AVAX',
                decimals: 18
              },
              rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
              blockExplorerUrls: ['https://testnet.snowtrace.io/']
            }]
          });
        } catch (addError) {
          console.error('Failed to add Avalanche Fuji network:', addError);
        }
      } else {
        console.error('Failed to switch network:', switchError);
      }
    }
  };

  if (!isWrongNetwork || !showWarning) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div className="text-sm">
            <span className="font-semibold">Wrong Network!</span>
            <span className="ml-2">
              Please switch to Avalanche Fuji Testnet. 
              {currentChainId && ` (Currently on Chain ID: ${currentChainId})`}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={switchToAvalanche}
            className="bg-white text-orange-600 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors"
          >
            Switch Network
          </button>
          <button
            onClick={() => setShowWarning(false)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetworkWarning;
