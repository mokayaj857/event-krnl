import { useState, useCallback } from 'react';
import { useKRNL, WorkflowStatusCode } from '@krnl-dev/sdk-react-7702';
import { usePrivy } from '@privy-io/react-auth';

/**
 * Custom hook for KRNL Workflow execution with proper error handling
 * 
 * Example Usage:
 * ```jsx
 * const { executeCustomWorkflow, isExecuting, result, error } = useKRNLWorkflow();
 * 
 * const handleTransfer = async () => {
 *   const workflow = {
 *     action: "transfer_tokens",
 *     params: { from: "0x123", to: "0x456", amount: "1000" }
 *   };
 *   
 *   const result = await executeCustomWorkflow(workflow);
 *   if (result.success) {
 *     console.log('Workflow completed!', result.data);
 *   }
 * };
 * ```
 */
export const useKRNLWorkflow = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [workflowError, setWorkflowError] = useState(null);
  const [workflowResult, setWorkflowResult] = useState(null);

  // Privy authentication
  const { authenticated, login } = usePrivy();

  // KRNL SDK hooks
  const {
    isAuthorized,
    isAuthenticated,
    embeddedWallet,
    enableSmartAccount,
    executeWorkflow,
    executeWorkflowFromTemplate,
    resetSteps,
    steps,
    currentStep,
    statusCode,
    error: krnlError,
  } = useKRNL();

  /**
   * Ensure wallet is connected and authorized
   */
  const ensureAuthorized = useCallback(async () => {
    // Step 1: Check Privy authentication
    if (!authenticated) {
      throw new Error('Please connect your wallet first');
    }

    // Step 2: Check embedded wallet
    if (!embeddedWallet) {
      throw new Error('No embedded wallet found. Please reconnect.');
    }

    // Step 3: Check KRNL authorization
    if (!isAuthorized) {
      console.log('🔑 Authorizing KRNL smart account...');
      const success = await enableSmartAccount();
      if (!success) {
        throw new Error('Failed to authorize KRNL smart account');
      }
      console.log('✅ KRNL smart account authorized');
    }

    return true;
  }, [authenticated, embeddedWallet, isAuthorized, enableSmartAccount]);

  /**
   * Execute a workflow with proper error handling
   */
  const executeCustomWorkflow = useCallback(async (workflowDSL) => {
    try {
      setIsExecuting(true);
      setWorkflowError(null);
      setWorkflowResult(null);

      // Ensure authorization
      await ensureAuthorized();

      // Reset previous workflow state
      resetSteps();

      console.log('🚀 Executing workflow:', workflowDSL);

      // Execute workflow
      const result = await executeWorkflow(workflowDSL);

      // Check status
      if (statusCode === WorkflowStatusCode.SUCCESS) {
        console.log('✅ Workflow succeeded:', result);
        setWorkflowResult(result);
        return { success: true, data: result };
      } else if (statusCode === WorkflowStatusCode.FAILED) {
        const error = new Error('Workflow execution failed');
        setWorkflowError(error);
        return { success: false, error };
      } else if (statusCode === WorkflowStatusCode.PROCESSING) {
        console.log('🔄 Workflow is processing...');
        return { success: false, processing: true };
      } else {
        const error = new Error(`Unknown status code: ${statusCode}`);
        setWorkflowError(error);
        return { success: false, error };
      }
    } catch (err) {
      console.error('❌ Workflow execution error:', err);
      setWorkflowError(err);
      return { success: false, error: err };
    } finally {
      setIsExecuting(false);
    }
  }, [ensureAuthorized, executeWorkflow, resetSteps, statusCode]);

  /**
   * Execute a workflow from template with parameter substitution
   */
  const executeTemplateWorkflow = useCallback(async (template, params) => {
    try {
      setIsExecuting(true);
      setWorkflowError(null);
      setWorkflowResult(null);

      // Ensure authorization
      await ensureAuthorized();

      // Reset previous workflow state
      resetSteps();

      console.log('🚀 Executing template workflow:', { template, params });

      // Execute workflow from template
      const result = await executeWorkflowFromTemplate(template, params);

      // Check status
      if (statusCode === WorkflowStatusCode.SUCCESS) {
        console.log('✅ Template workflow succeeded:', result);
        setWorkflowResult(result);
        return { success: true, data: result };
      } else if (statusCode === WorkflowStatusCode.FAILED) {
        const error = new Error('Template workflow execution failed');
        setWorkflowError(error);
        return { success: false, error };
      } else {
        console.log(`🔄 Template workflow status: ${statusCode}`);
        return { success: false, processing: true };
      }
    } catch (err) {
      console.error('❌ Template workflow execution error:', err);
      setWorkflowError(err);
      return { success: false, error: err };
    } finally {
      setIsExecuting(false);
    }
  }, [ensureAuthorized, executeWorkflowFromTemplate, resetSteps, statusCode]);

  /**
   * Connect wallet and authorize in one step
   */
  const connectAndAuthorize = useCallback(async () => {
    try {
      if (!authenticated) {
        console.log('🔐 Connecting wallet...');
        await login();
      }

      if (!isAuthorized) {
        console.log('🔑 Authorizing smart account...');
        const success = await enableSmartAccount();
        if (!success) {
          throw new Error('Failed to authorize smart account');
        }
      }

      return true;
    } catch (err) {
      console.error('❌ Connect and authorize error:', err);
      setWorkflowError(err);
      return false;
    }
  }, [authenticated, isAuthorized, login, enableSmartAccount]);

  return {
    // Execution methods
    executeCustomWorkflow,
    executeTemplateWorkflow,
    connectAndAuthorize,
    ensureAuthorized,

    // State
    isExecuting,
    workflowError: workflowError || krnlError,
    workflowResult,

    // KRNL state
    isAuthorized,
    isAuthenticated,
    embeddedWallet,
    steps,
    currentStep,
    statusCode,

    // Privy state
    privyAuthenticated: authenticated,
  };
};

export default useKRNLWorkflow;
