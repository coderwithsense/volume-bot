import {
  AMM_V4,
  AMM_STABLE,
  DEVNET_PROGRAM_ID,
} from "@raydium-io/raydium-sdk-v2";
import { initSdk } from "./config.ts";

const VALID_PROGRAM_ID = new Set([
  AMM_V4.toBase58(),
  AMM_STABLE.toBase58(),
  DEVNET_PROGRAM_ID.AmmV4.toBase58(),
  DEVNET_PROGRAM_ID.AmmStable.toBase58(),
]);

const swap = async () => {
  const raydium = initSdk();
  const amountIn = 1;
  const poolId = "FCEnSxyJfRSKsz6tASUENCsfGwKgkH6YuRn1AMmyHhZn";
  
};

// uninstall @raydium-io/raydium-sdk-v2 if not using this
