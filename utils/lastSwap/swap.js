const { Keypair } = require("@solana/web3.js");
import { amountToUiAmount } from "@solana/spl-token";
import  
  buy_token
 from "solana-transactions-wrapper/dist/buy-helper";


const SECRET_KEY = "SOLANA_PRIVATE_KEY";
const SOLANA_RPC_ENDPOINT = "SOLANA_RPC_ENDPOINT";
const keypair = Keypair.fromSecretKey(base58.decode(SECRET_KEY));

async function swap() {
  console.time("Execution Time");
  
  console.timeEnd("Execution Time");
}

swap();


// npm i solana-transactions-wrapper
// https://www.npmjs.com/package/solana-transactions-wrapper