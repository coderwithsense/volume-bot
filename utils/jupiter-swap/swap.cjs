console.clear();

const { TOKEN_LIST_URL, Jupiter } = require("@jup-ag/core");
const { Wallet } = require("@project-serum/anchor");
const { Connection, Keypair } = require("@solana/web3.js");
const base58 = require("bs58");
// import { TOKEN_LIST_URL }  from "@jup-ag/core";
// import { Connection } from "@solana/web3.js";

const SOLANA_RPC_ENDPOINT = "SOLANA_RPC_ENDPOINT";

const ENV = "mainnet-beta";
const connection = new Connection(SOLANA_RPC_ENDPOINT, "confirmed");

const WALLET_PRIVATE_KEY = "SOLANA_PRIVATE_KEY";
const USER_PRIVATE_KEY = base58.decode(WALLET_PRIVATE_KEY);
const USER_KEYPAIR = Keypair.fromSecretKey(USER_PRIVATE_KEY);

const setup = async () => {
  try {
    const jupiter = await Jupiter.load({
      connection,
      cluster: ENV,
      user: USER_KEYPAIR,
    });
    return { jupiter };
  } catch (error) {
    console.error(error);
  }
};

const swap = async () => {
  try {
    const { jupiter } = await setup();
    console.log(jupiter);
  } catch (error) {
    console.error(error);
  }
};

swap();
