import { ethers } from 'ethers';
import ABI from '../abi/YourContractABI.json'; // Replace with your actual ABI file

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const SEPOLIA_URL = import.meta.env.VITE_SEPOLIA_URL;

// Create a provider (you can use any RPC URL)
const provider = new ethers.providers.JsonRpcProvider(SEPOLIA_URL);

// Create a signer if you need to send transactions
const signer = new ethers.Wallet(import.meta.env.VITE_PRIVATE_KEY, provider);

// Create a contract instance
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

export const getContract = () => contract;
export const getSigner = () => signer;
export const getProvider = () => provider;
