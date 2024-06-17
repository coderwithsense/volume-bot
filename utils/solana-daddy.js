import { Keypair, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { initRaydiumSdk } from "../config";
import base58 from "bs58";
import { SolanaTracker } from "solana-swap";

class Bot {
  constructor(keypair, rpcUrl, exchange, capitalAmount, expiryDate, walletAmount) {
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

  async swap(address, token, amount, slippage, priorityFee) {
    
  }
}

function getKeypair(secretKey) {
  const keypair = new Keypair.fromSecretKey(base58.decode(secretKey));
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
  token,
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
      "So11111111111111111111111111111111111111112", // From Sol
      token, // To Token
      amount ? amount : 1, // Amount to swap, default is 1
      slippage ? slippage : 30, // Slippage
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
    const connection = new Connection("https://api.devnet.solana.com");
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

export { createKeypair, getSolBalance, getAddressFromPrivateKey, swapTokenInstructions };
