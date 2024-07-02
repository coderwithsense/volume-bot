// const { TOKEN_LIST_URL } = require("@jup-ag/core");
// const { Connection } = require("@solana/web3.js");
import { TOKEN_LIST_URL }  from "@jup-ag/core";
import { Connection } from "@solana/web3.js";

const SOLANA_RPC_ENDPOINT =
  "https://solana-mainnet.g.alchemy.com/v2/tIBMsQHQZOcg9utnPnp5y0_JDYkQO3Qk";
const ENV = process.env.CLUSTER || "mainnet-beta";

const main = async () => {
    try {
        const connection = new Connection(SOLANA_RPC_ENDPOINT, "confirmed");
        const tokens = await (await fetch(TOKEN_LIST_URL[ENV])).json();
        console.log(tokens);
    } catch (error) {
        console.error(error);
    }
}

main();