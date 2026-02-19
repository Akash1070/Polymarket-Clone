// src/client.ts
// This file creates a reusable client for interacting with Thirdweb services.

import { createThirdwebClient } from "thirdweb";
// Imports the function used to initialize a Thirdweb client.
// This client handles wallet connections and blockchain interactions.

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string,
  // Public client ID provided by Thirdweb.
  // Used to identify this application when connecting to wallets or blockchain services.
  // The "NEXT_PUBLIC_" prefix allows this value to be safely exposed to the browser.
});
