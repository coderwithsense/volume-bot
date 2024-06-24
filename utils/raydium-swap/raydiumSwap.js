import { NATIVE_MINT } from "@solana/spl-token";
import { initRaydiumSdk } from "./config.js";
import { USDCMint } from "@raydium-io/raydium-sdk-v2";
import { readCachePoolData, writeCachePoolData } from "./cache.js";
console.log("🚀 ~ readCachePoolData:", readCachePoolData);

const poolType = {
  4: "AMM",
  5: "AMM Stable",
  6: "CLMM",
  7: "CPMM",
};

async function routeSwap() {
  const raydium = await initRaydiumSdk();
  await raydium.fetchChainTime();

  const inputAmount = "0.001";
  const SOL = NATIVE_MINT;
  const [inputeMint, outputMint] = [SOL, USDCMint];
  const [inputMintStr, outputMintStr] = [
    inputeMint.toBase58(),
    outputMint.toBase58(),
  ];

  let poolData = readCachePoolData(1000 * 60 * 60 * 24 * 10);
  if (poolData.ammPools.length === 0) {
    console.log(
      "fetching all pool basic info, this might take a while (more than 30 seconds).."
    );
    poolData = await raydium.tradeV2.fetchRoutePoolBasicInfo();
    writeCachePoolData(poolData);
  }

  console.log("computing swap route..");
  // const routes = raydium.tradeV2.getAllRoute({
  //     inputeMint,
  //     outputMint,
  //     ...poolData,
  // })
  // console.log(routes);
  const v2 = raydium.tradeV2;
  console.log(v2);
}

routeSwap();
