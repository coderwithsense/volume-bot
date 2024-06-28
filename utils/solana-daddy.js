import { Keypair, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { initRaydiumSdk } from "../config.js";
import base58 from "bs58";
import { SolanaTracker } from "solana-swap";
import { config } from "dotenv";
config();
const SOL_ADDRESS = "So11111111111111111111111111111111111111112"; // Solana address

class Bot {
  constructor(
    keypair,
    rpcUrl,
    exchange,
    capitalAmount,
    expiryDate,
    walletAmount,
    keypairs
  ) {
    this.keypair = keypair;
    this.connection = new Connection(rpcUrl);
    this.address = getAddressFromPrivateKey(this.keypair.secretKey);
    this.capitalAmount = capitalAmount;
    this.exchange = exchange;
    this.expiryDate = expiryDate;
    this.walletAmount = walletAmount;
    generateWallets();
  }

  async generateWallets() {
    const wallets = [];
    for (let i = 0; i < this.walletAmount; i++) {
      wallets.push(Keypair.generate());
    }
    this.wallets = wallets;

    return wallets;
  }

  async getBalance() {
    const balance = await this.connection.getBalance(this.address);
    return balance;
  }
  wr;
  async startSwap(address, token, amount, slippage, priorityFee) {}

  async stopSwap() {}
}

class SwapManager {
  constructor(capacity) {
    this.transactionQueue = new TransactionQueue(capacity);
    this.isSwapping = false;
  }

  async startSwap() {
    this.isSwapping = true;
    this.processQueue();
  }

  async stopSwap() {
    this.isSwapping = false;
  }

  async processQueue() {
    while (!this.transactionQueue.isEmpty() && this.isSwapping) {
      const transaction = this.transactionQueue.dequeue();
      try {
        // Execute transaction with dynamic adjustment and jito bundling based on priority
        const tx = await this.executeSwap(transaction);
        console.log(tx);
      } catch (e) {
        console.log(e);
      }
    }
  }

  async executeSwap({ address, token, amount, slippage, priorityFee }) {
    // Implementaion of the swap logic, including batching and dynamic slippage adjustment

    // wait for 5 seconds before executing the transaction
    console.log(
      "Executing swap transaction...Next transaction in 5 seconds..."
    );
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

class TransactionQueue {
  constructor(capacity) {
    this.queue = [];
    this.capacity = capacity;
    this.space = 0;
  }

  enqueue(transaction) {
    if (!transaction || !transaction.data) {
      return ("Invalid transaction data...in transaction: ", transaction);
    }
    if (transaction.success === false || !transaction.success) {
      return ("Transaction creation failed...");
    }
    // Check if there is space available before adding the transaction
    if (this.spaceAvailable()) {
      // Corrected to call the method with ()
      this.queue.push(transaction.data);
      this.space++;
      console.log("Transaction added to the queue");
      return "Transaction added"; // More accurate return message
    } else {
      console.log("Queue full");
      return "Queue full"; // Only return "Queue full" if the queue is actually full
    }
  }

  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    // Remove transaction from the queue based on priority (expiry date)
    this.space--;
    return this.queue.shift();
  }

  lastTransaction() {
    return this.queue[this.queue.length - 1];
  }

  spaceAvailable() {
    return this.space < this.capacity;
  }

  isEmpty() {
    return this.queue.length === 0;
  }
}

async function transaction() {}

async function main() {
  const swapManager = new SwapManager(2);
  const transaction1 = await swapTokenInstructions(
    process.env.NEXT_PUBLIC_SECRET_KEY,
    SOL_ADDRESS,
    "AujTJJ7aMS8LDo3bFzoyXDwT3jBALUbu4VZhzZdTZLmG",
    1,
    30,
    0.00005
  );
  const transaction2 = await swapTokenInstructions(
    process.env.NEXT_PUBLIC_SECRET_KEY,
    "AujTJJ7aMS8LDo3bFzoyXDwT3jBALUbu4VZhzZdTZLmG",
    SOL_ADDRESS,
    1,
    30,
    0.00005
  );
  swapManager.transactionQueue.enqueue(transaction1);
  // swapManager.startSwap();
  console.log(swapManager.transactionQueue);
}
main();


// global functions for solana
function getKeypair(secretKey) {
  const keypair = Keypair.fromSecretKey(base58.decode(secretKey));
  return keypair;
}

function getAddressFromPrivateKey(privateKey) {
  try {
    const keypair = Keypair.fromSecretKey(base58.decode(privateKey));
    return keypair.publicKey;
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function swapTokenInstructions(
  secretKey,
  token1,
  token2,
  amount,
  slippage,
  priorityFee
) {
  try {
    const keypair = getKeypair(secretKey);
    const solanaTracker = new SolanaTracker(
      keypair,
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL
    );
    const swapResponse = await solanaTracker.getSwapInstructions(
      token1, // From token
      token2, // To Token
      amount ? amount : 1, // Amount to swap, default is 1
      slippage ? slippage : 30, // Slippage q
      keypair.publicKey.toString(), // Payer public key
      priorityFee ? priorityFee : 0.00005, // Priority fee (Recommended while network is congested)
      true // Force legacy transaction for Jupiter
    );

    return {
      success: true,
      data: swapResponse,
    };
  } catch (error) {
    console.log("[ERROR_CREATING_TRANSACTION]: ", error);
    return {
      success: false,
      data: error,
    };
  }
}

async function getSolBalance(privateKey) {
  try {
    // get rpc from web3
    const address = getAddressFromPrivateKey(privateKey);
    // console.log("Address: ", address);
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL);
    const balance = await connection.getBalance(address);
    // console.log("Balance: ", balance);
    if (balance === null) {
      return null;
    }
    return {
      address: address.toString(),
      balance: balance / LAMPORTS_PER_SOL,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function createKeypair(amount) {
  const keypairs = [];
  for (let i = 0; i < amount; i++) {
    keypairs.push(Keypair.generate());
  }
  return keypairs;
}

async function getTokenPool() {
  const raydium = initRaydiumSdk();
  try {
    const pool = (await raydium).api.fetchPoolByMints({
      mint1: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
    });
    console.log(pool);
  } catch (e) {
    console.log(e);
  }
}

const pool = async () => {
  const p = await getTokenPool();
  console.log(p);
};

// async function main() {
//   const instructions = await swapTokenInstructions(
//     "5vRKt7xWDSQjFXDnuvsPY8QhYfGYNQSKyqocWgGm3hfkWKCn5XvLvNzuK6T6mb872ar9Uxw2gWHENdsMLBxMdLoR",
//     "4Cnk9EPnW5ixfLZatCPJjDB1PUtcRpVVgTQukm9epump",
//     1,
//     30,
//     0.00005
//   );
//   console.log(instructions);
// }

// main();

export {
  createKeypair,
  getSolBalance,
  getAddressFromPrivateKey,
  swapTokenInstructions,
};
