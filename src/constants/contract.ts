// Import the initialized Thirdweb client
// This client contains your app's Thirdweb credentials (clientId)
import { client } from "@/app/client";

// getContract is used to create a typed contract instance
// that allows reading from and writing to a deployed smart contract
import { getContract } from "thirdweb";

// Import the Base Sepolia testnet configuration
// This defines which blockchain network the contract lives on
import { baseSepolia } from "thirdweb/chains";

// Address of your Prediction Market smart contract
// This is the main contract handling market logic (create, trade, resolve)
export const contractAddress = "0x124D803F8BC43cE1081110a08ADd1cABc5c83a3f";

// Address of the ERC20 token used for betting/trading in the market
// Users approve and spend this token when placing predictions
export const tokenAddress = "0x4D9604603527322F44c318FB984ED9b5A9Ce9f71";

// Create a contract instance for the Prediction Market contract
// This instance is reused across the app for reads/writes
export const contract = getContract({
    client: client,          // Thirdweb client with auth
    chain: baseSepolia,      // Network where the contract is deployed
    address: contractAddress // Prediction Market contract address
});

// Create a contract instance for the ERC20 token contract
// Used for balance checks, approvals, and transfers
export const tokenContract = getContract({
    client: client,        // Same Thirdweb client
    chain: baseSepolia,    // Same network
    address: tokenAddress  // ERC20 token contract address
});
