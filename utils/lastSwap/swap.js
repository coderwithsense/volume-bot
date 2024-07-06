const { Keypair } = require("@solana/web3.js");
import { amountToUiAmount } from "@solana/spl-token";
import  
  buy_token
 from "solana-transactions-wrapper/dist/buy-helper";


const SECRET_KEY =
  "22sUmGv4VSSA9DNAiGHx4sSTQCaPeC9QXNZ6pMzfraXCj88AxsNhxnhwEKknNxiNgEWQRCNh74mFWw9sHk8jVFoc";
const SOLANA_RPC_ENDPOINT =
  "https://solana-mainnet.g.alchemy.com/v2/CJgyaDQq3FOXk6gmFEi0cDm8Te9beZoM";
const keypair = Keypair.fromSecretKey(base58.decode(SECRET_KEY));

async function swap() {
  console.time("Execution Time");
  
  console.timeEnd("Execution Time");
}

swap();


// npm i solana-transactions-wrapper
// https://www.npmjs.com/package/solana-transactions-wrapper