import React from 'react';
import { Web3Provider } from './context/Web3Context';
import WalletConnector from './components/WalletConnector';

function App() {
  return (
    <Web3Provider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Event Vax</h1>
            <WalletConnector />
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Your application content will go here */}
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <p className="text-gray-500">Your application content will appear here</p>
            </div>
          </div>
        </main>
      </div>
    </Web3Provider>
  );
}

export default App;
