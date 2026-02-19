import { tokenAddress } from "@/constants/contract";
// Imports the blockchain token contract address from a shared constants file.
// This is the smart contract that will mint tokens.

import { NextResponse } from "next/server";
// Utility from Next.js used to send HTTP responses from API routes.

/* ----------------------------------
   Environment variables
---------------------------------- */

const {
  BACKEND_WALLET_ADDRESS,
  ENGINE_URL,
  THIRDWEB_SECRET_KEY,
} = process.env;
// Reads sensitive configuration values from environment variables.
// These should NEVER be hardcoded for security reasons.

/* ----------------------------------
   Check transaction mining status
---------------------------------- */

async function checkTransactionStatus(queueId: string): Promise<boolean> {
  // Calls the backend engine to check the current status of a transaction.

  const statusResponse = await fetch(
    `${ENGINE_URL}/transaction/status/${queueId}`,
    {
      headers: {
        Authorization: `Bearer ${THIRDWEB_SECRET_KEY}`,
        // Authenticates the request using a secret API key.
      },
    }
  );

  if (statusResponse.ok) {
    const statusData = await statusResponse.json();
    // Reads the response data returned by the engine.

    return statusData.result.status === "mined";
    // Returns TRUE only if the transaction has been mined on the blockchain.
  }

  return false;
  // If the request failed, assume the transaction is not mined yet.
}

/* ----------------------------------
   Poll transaction status repeatedly
---------------------------------- */

async function pollTransactionStatus(
  queueId: string,
  maxAttempts = 15,
  interval = 3000
): Promise<boolean> {
  // Repeatedly checks transaction status until:
  // 1) It is mined, OR
  // 2) We reach the maximum number of attempts.

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const isMined = await checkTransactionStatus(queueId);
    // Checks if the transaction is mined.

    if (isMined) return true;
    // Stops polling as soon as the transaction is confirmed.

    await new Promise(resolve => setTimeout(resolve, interval));
    // Waits for a few seconds before checking again.
  }

  return false;
  // Returns false if the transaction was not mined within the timeout window.
}

/* ----------------------------------
   API endpoint: POST request
---------------------------------- */

export async function POST(request: Request) {
  // This function runs when a POST request hits this API route.

  if (
    !BACKEND_WALLET_ADDRESS ||
    !ENGINE_URL ||
    !THIRDWEB_SECRET_KEY
  ) {
    // Safety check to ensure the server is properly configured.

    throw 'Server misconfigured. Did you forget to add a ".env.local" file?';
    // Stops execution if required environment variables are missing.
  }

  const { address } = await request.json();
  // Reads the wallet address sent by the client in the request body.

  /* ----------------------------------
     Mint tokens to user wallet
  ---------------------------------- */

  const resp = await fetch(
    `${ENGINE_URL}/contract/84532/${tokenAddress}/erc20/mint-to`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${THIRDWEB_SECRET_KEY}`,
        // Authenticates the request.

        "x-backend-wallet-address": BACKEND_WALLET_ADDRESS,
        // Specifies which backend wallet is allowed to mint tokens.
      },
      body: JSON.stringify({
        toAddress: address as string,
        amount: "100"
        // Sends 100 tokens to the user's wallet.
      }),
    }
  );

  /* ----------------------------------
     Handle mint response
  ---------------------------------- */

  if (resp.ok) {
    const data = await resp.json();
    // Reads the response from the engine.

    const queueId = data.result.queueId;
    // The transaction is queued for blockchain execution.
    // This ID is used to track its progress.

    const isMined = await pollTransactionStatus(queueId);
    // Waits until the transaction is confirmed (or times out).

    if (isMined) {
      return NextResponse.json({
        message: "Transaction mined successfully!",
        queueId
      });
      // Success response when the tokens are fully minted.
    } else {
      return NextResponse.json(
        {
          message: "Transaction not mined within the timeout period.",
          queueId
        },
        { status: 408 }
      );
      // Timeout response if mining takes too long.
    }
  } else {
    const errorText = await resp.text();
    // Reads error details from the engine.

    console.error("[DEBUG] not ok", errorText);
    // Logs the error for debugging.

    return NextResponse.json(
      {
        message: "Failed to initiate transaction",
        error: errorText
      },
      { status: 500 }
    );
    // Returns a server error to the client.
  }
}
