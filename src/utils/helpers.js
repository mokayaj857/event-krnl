// Format Ethereum address to show first and last 4 characters
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Convert from wei to ether
export const toEther = (wei) => {
  return window.ethers.utils.formatEther(wei);
};

// Convert from ether to wei
export const toWei = (ether) => {
  return window.ethers.utils.parseEther(ether.toString());
};

// Handle transaction errors
export const handleTransactionError = (error) => {
  console.error('Transaction error:', error);
  
  // Handle common MetaMask errors
  if (error.code === 4001) {
    return 'Transaction was rejected by user';
  }
  
  if (error.code === -32603) {
    // Internal JSON-RPC error
    if (error.data?.message?.includes('insufficient funds')) {
      return 'Insufficient funds for transaction';
    }
  }
  
  return error.message || 'An error occurred with the transaction';
};
