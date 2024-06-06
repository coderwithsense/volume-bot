import { Keypair } from "@solana/web3.js";
import { initRaydiumSdk } from "../config.ts";

async function createKeypair(amount) {
  const keypairs = [];
  for (let i = 0; i < amount; i++) {
    keypairs.push(Keypair.generate());
  }
  return keypairs;
}

async function getTokenPool() {
  const raydium = initRaydiumSdk();
  try {
    const pool = (await raydium).api.fetchPoolByMints({
      mint1: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    })
    console.log(pool);
  } catch (e) {
    console.log(e);
  }
}

const pool = async () => {
  const p = await getTokenPool();
  console.log(p);
}
pool();

export { createKeypair };