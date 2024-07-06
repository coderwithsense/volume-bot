const {
  Raydium,
  TxVersion,
  parseTokenAccountRespApiV3PoolInfoConcentratedItem,
  ClmmKeys,
  ComputeClmmPoolInfo,
  PoolUtils,
  ReturnTypeFetchMultiplePoolTickArrays,
} = require("@raydium-io/raydium-sdk-v2");
const { Connection, Keypair, clusterApiUrl } = require("@solana/web3.js");
const {
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
} = require("@solana/spl-token");
const base58 = require("bs58");

const owner = Keypair.fromSecretKey(base58.decode("SOLANA_PRIVATE_KEY"));
const connection = new Connection(
  "SOLANA_RPC_ENDPOINT"
); //<YOUR_RPC_URL>
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
  });
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

const SOLANA_RPC_ENDPOINT = "SOLANA_RPC_ENDPOINT";

const main = async () => {
  console.time("Execution Time");
  try {
    const raydium = await initSdk();

    let poolInfo;
    const poolId = "61R1ndXxvsWXXkWSyNkCxnzwd3zUNB8Q2ibmkiLPC8ht";
    let poolKeys;
    let clmmPoolInfo;
    let tickCache;

    const inputAmount = new BN(1);

    const data = await raydium.api.fetchPoolById({ ids: poolId });
    poolInfo = data[0];
    if (!isValidClmm(poolInfo.programId))
      throw new Error("target pool is not CLMM pool");

    clmmPoolInfo = await PoolUtils.fetchComputeClmmInfo({
      connection: raydium.connection,
      poolInfo,
    });
    tickCache = await PoolUtils.fetchMultiplePoolTickArrays({
      connection: raydium.connection,
      poolKeys: [clmmPoolInfo],
    });

    const { minAmountOut, remainingAccounts } =
      await PoolUtils.computeAmountOutFormat({
        poolInfo: clmmPoolInfo,
        tickArrayCache: tickCache[poolId],
        amountIn: inputAmount,
        tokenOut: poolInfo.mintB,
        slippage: 0.01,
        epochInfo: await raydium.fetchEpochInfo(),
      });
  } catch (e) {
    console.log(e);
  }
  console.timeEnd("Execution Time");
};

main();
