import RaydiumSwap from './swap.js';
import { Transaction, VersionedTransaction } from '@solana/web3.js';
import 'dotenv/config';
import { swapConfig } from './swapConfig.js'; // Import the configuration

/**
 * Performs a token swap on the Raydium protocol.
 * Depending on the configuration, it can execute the swap or simulate it.
 */
const swap = async () => {
  /**
   * The RaydiumSwap instance for handling swaps.
   */
  const raydiumSwap = new RaydiumSwap(
    process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL,
    process.env.NEXT_PUBLIC_PRIVATE_KEYS
  );
  console.log(`Raydium swap initialized`);
  console.log(`Swapping ${swapConfig.tokenAAmount} of ${swapConfig.tokenAAddress} for ${swapConfig.tokenBAddress}...`)

  /**
   * Load pool keys from the Raydium API to enable finding pool information.
   */
  await raydiumSwap.loadPoolKeys(swapConfig.liquidityFile);
  console.log(`Loaded pool keys`);

  /**
   * Find pool information for the given token pair.
   */
  const poolInfo = raydiumSwap.findPoolInfoForTokens(swapConfig.tokenAAddress, swapConfig.tokenBAddress);
  if (!poolInfo) {
    console.error('Pool info not found');
    return 'Pool info not found';
  } else {
      console.log('Found pool info');
      console.log(poolInfo);
  }

  /**
   * Prepare the swap transaction with the given parameters.
   */
//   const tx = await raydiumSwap.getSwapTransaction(
//     swapConfig.tokenBAddress,
//     swapConfig.tokenAAmount,
//     poolInfo,
//     swapConfig.maxLamports, 
//     swapConfig.useVersionedTransaction,
//     swapConfig.direction
//   );

//     console.log(`Transaction prepared`);
//     console.log(tx);
  /**
   * Depending on the configuration, execute or simulate the swap.
   */
//   if (swapConfig.executeSwap) {
//     /**
//      * Send the transaction to the network and log the transaction ID.
//      */
//     const txid = swapConfig.useVersionedTransaction
//       ? await raydiumSwap.sendVersionedTransaction(tx, swapConfig.maxRetries)
//       : await raydiumSwap.sendLegacyTransaction(tx, swapConfig.maxRetries);

//     console.log(`https://solscan.io/tx/${txid}`);

//   } else {
//     /**
//      * Simulate the transaction and log the result.
//      */
//     const simRes = swapConfig.useVersionedTransaction
//       ? await raydiumSwap.simulateVersionedTransaction(tx)
//       : await raydiumSwap.simulateLegacyTransaction(tx);

//     console.log(simRes);
//   }
};

swap();