import React, { createContext, useContext, useMemo } from 'react';
import useWeb3 from '../hooks/useWeb3';

const Web3Context = createContext(null);

export const Web3Provider = ({ children }) => {
  const web3 = useWeb3();

  const value = useMemo(
    () => ({
      ...web3,
    }),
    [web3]
  );

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3Context = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3Context must be used within a Web3Provider');
  }
  return context;
};

export default Web3Context;
