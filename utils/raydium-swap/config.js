import {
  Raydium,
  TxVersion,
  parseTokenAccountResp,
} from "@raydium-io/raydium-sdk-v2";
import { Connection, Keypair, clusterApiUrl } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import bs58 from "bs58";
import { config } from "dotenv";
config();

export const owner = Keypair.fromSecretKey(
  bs58.decode(process.env.NEXT_PUBLIC_SECRET_KEY)
);
export const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL
);
let cluster;
if (process.env.NEXT_PUBLIC_SOLANA_NETWORK === "mainnet-beta") {
  cluster = "mainnet";
} else if (process.env.NEXT_PUBLIC_SOLANA_NETWORK === "devnet") {
  cluster = "devnet";
} else {
  cluster = "devnet";
}

let raydium;
export const initRaydiumSdk = async (params) => {
  if (raydium) return raydium;
  console.log("Init Raydium SDK");
  raydium = await Raydium.load({
    owner,
    connection,
    cluster,
    disableFeatureCheck: true,
    disableLoadToken: !params?.loadToken,
  });
  raydium.account.updateTokenAccount(await fetchTokenAccountData());
  connection.onAccountChange(owner.publicKey, async () => {
    if (raydium && raydium.account) {
      raydium.account.updateTokenAccount(await fetchTokenAccountData());
    }
  });
  return raydium;
};

export const fetchTokenAccountData = async () => {
  const solAccountResp = await connection.getAccountInfo(owner.publicKey);
  const tokenAccountResp = await connection.getTokenAccountsByOwner(
    owner.publicKey,
    {
      programId: TOKEN_PROGRAM_ID,
    }
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
