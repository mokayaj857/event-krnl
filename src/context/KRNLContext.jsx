import { useKRNL, useNodeConfig } from '@krnl-dev/sdk-react-7702';

/**
 * Custom hook that wraps KRNL SDK hooks for easier use throughout the app
 * This provides a unified interface to KRNL functionality
 */
export const useKRNLContext = () => {
  try {
    const krnl = useKRNL();
    const nodeConfig = useNodeConfig();

    return {
      ...krnl,
      nodeConfig,
      isReady: !!krnl && !!nodeConfig,
      nodeUrl: nodeConfig?.nodeUrl || nodeConfig?.workflow?.node_address || 'https://node.krnl.xyz',
      // Common methods that might be available
      signTransactionIntent: krnl?.signTransactionIntent,
      executeWorkflowFromTemplate: krnl?.executeWorkflowFromTemplate,
      createTransactionIntent: krnl?.createTransactionIntent,
      resetSteps: krnl?.resetSteps,
    };
  } catch (error) {
    console.error('Error initializing KRNL context:', error);
    // Return a safe fallback
    return {
      isReady: false,
      nodeUrl: 'https://node.krnl.xyz',
      error: error.message,
    };
  }
};

export default useKRNLContext;

