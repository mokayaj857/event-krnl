import React from 'react';
import { useWeb3Context } from '../context/Web3Context';
import { formatAddress } from '../utils/helpers';

const WalletConnector = () => {
  const { 
    account, 
    isConnected, 
    loading, 
    error, 
    connectWallet, 
    disconnectWallet 
  } = useWeb3Context();

  if (loading) {
    return (
      <button 
        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md cursor-not-allowed"
        disabled
      >
        Loading...
      </button>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm">
        {error}
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-700">
          {formatAddress(account)}
        </span>
        <button
          onClick={disconnectWallet}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
    >
      Connect Wallet
    </button>
  );
};

export default WalletConnector;
