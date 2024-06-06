const { Keypair } = require("@solana/web3.js");
const web3 = require('@solana/web3.js');
const base58 = require('bs58');
const keypair = new Keypair();

const publicKey = keypair.publicKey.toString();
const secretKey = base58.encode(keypair.secretKey);
const pub = Keypair.fromSecretKey(base58.decode(secretKey)).publicKey.toString();

console.log(
    `Public Key: ${publicKey}\nPublic Key: ${pub}`
);

const accountBalance = async (publicKey) => {
    const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
    const balance = await connection.getBalance(publicKey);
    console.log(balance);
}