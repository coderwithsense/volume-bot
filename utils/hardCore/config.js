// import {
//   Raydium,
//   TxVersion,
//   parseTokenAccountResp,
// } from "@raydium-io/raydium-sdk-v2";
// import { Connection, Keypair, clusterApiUrl } from "@solana/web3.js";
// import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
// import base58 from "bs58";
const { Raydium, TxVersion, parseTokenAccountResp } = require("@raydium-io/raydium-sdk-v2");
const { Connection, Keypair, clusterApiUrl } = require("@solana/web3.js");
const { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } = require("@solana/spl-token");
const base58 = require("bs58");

const owner = Keypair.fromSecretKey(
  base58.decode("22sUmGv4VSSA9DNAiGHx4sSTQCaPeC9QXNZ6pMzfraXCj88AxsNhxnhwEKknNxiNgEWQRCNh74mFWw9sHk8jVFoc")
);
const connection = new Connection("https://solana-mainnet.g.alchemy.com/v2/CJgyaDQq3FOXk6gmFEi0cDm8Te9beZoM"); //<YOUR_RPC_URL>
// export const connection = new Connection(clusterApiUrl('devnet')) //<YOUR_RPC_URL>
const txVersion = TxVersion.V0; // or TxVersion.LEGACY
const cluster = "mainnet"; // 'mainnet' | 'devnet'

let raydium;
const initSdk = async (params) => {
  if (raydium) return raydium;
  console.log(`connect to rpc ${connection.rpcEndpoint} in ${cluster}`);
  raydium = await Raydium.load({
    owner,
    connection,
    cluster,
    disableFeatureCheck: true,
    disableLoadToken: !params?.loadToken,
    blockhashCommitment: "finalized",
    // urlConfigs: {
    //   BASE_HOST: '<API_HOST>', // api url configs, currently api doesn't support devnet
    // },
  });

  /**
   * By default: sdk will automatically fetch token account data when need it or any sol balace changed.
   * if you want to handle token account by yourself, set token account data after init sdk
   * code below shows how to do it.
   * note: after call raydium.account.updateTokenAccount, raydium will not automatically fetch token account
   */

  /*  
  raydium.account.updateTokenAccount(await fetchTokenAccountData())
  connection.onAccountChange(owner.publicKey, async () => {
    raydium!.account.updateTokenAccount(await fetchTokenAccountData())
  })
  */

  return raydium;
};

const fetchTokenAccountData = async () => {
  const solAccountResp = await connection.getAccountInfo(owner.publicKey);
  const tokenAccountResp = await connection.getTokenAccountsByOwner(
    owner.publicKey,
    { programId: TOKEN_PROGRAM_ID }
  );
  const token2022Req = await connection.getTokenAccountsByOwner(
    owner.publicKey,
    { programId: TOKEN_2022_PROGRAM_ID }
  );
  const tokenAccountData = parseTokenAccountResp({
    owner: owner.publicKey,
    solAccountResp,
    tokenAccountResp: {
      context: tokenAccountResp.context,
      value: [...tokenAccountResp.value, ...token2022Req.value],
    },
  });
  return tokenAccountData;
};

