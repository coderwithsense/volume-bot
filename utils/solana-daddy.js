import { Keypair, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { initRaydiumSdk } from "../config";
import base58 from 'bs58';

function getAddressFromPrivateKey(privateKey) {
  try {
    const keypair = Keypair.fromSecretKey(base58.decode(privateKey));
    return keypair.publicKey;
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function getSolBalance(privateKey) {
  try {
    // get rpc from web3
  const address = getAddressFromPrivateKey(privateKey); 
  // console.log("Address: ", address);
  const connection = new Connection("https://api.devnet.solana.com");
  const balance = await connection.getBalance(address);
  // console.log("Balance: ", balance);
  if (balance === null) {
    return null;
  }
  return {
    address: address.toString(),
    balance: balance / LAMPORTS_PER_SOL,
  };
  } catch (e) {
    console.log(e);
    return null;
  }
}

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
// pool();

export { createKeypair, getSolBalance, getAddressFromPrivateKey };