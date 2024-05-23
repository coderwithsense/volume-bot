import { Keypair } from "@solana/web3.js";

async function createKeypair(amount: number): Promise<Keypair[]> {
  const keypairs = [];
  for (let i = 0; i < amount; i++) {
    keypairs.push(Keypair.generate());
  }
  return keypairs;
}


export { createKeypair };