import web3 from '@solana/web3.js';
import {Keypair} from '@solana/web3.js';
import base58 from 'bs58';
import {SolanaTracker} from 'solana-swap';

// const keypair = new Keypair();

// const publicKey = keypair.publicKey.toString();
// const secretKey = base58.encode(keypair.secretKey);
// const pub = Keypair.fromSecretKey(base58.decode(secretKey)).publicKey.toString();

// console.log(
//     `Public Key: ${publicKey}\nPublic Key: ${pub}`
// );

// const accountBalance = async (publicKey) => {
//     const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
//     const balance = await connection.getBalance(publicKey);
//     console.log(balance);
// }

const keypair = Keypair.fromSecretKey(base58.decode("5vRKt7xWDSQjFXDnuvsPY8QhYfGYNQSKyqocWgGm3hfkWKCn5XvLvNzuK6T6mb872ar9Uxw2gWHENdsMLBxMdLoR"));
const rpc = "https://api.devnet.solana.com"

const solanaTracker = new SolanaTracker(
    keypair,
    rpc
);

async function swap(token) {
    try {
        const swapResponse = await solanaTracker.getSwapInstructions(
            "So11111111111111111111111111111111111111112", // From Token
            "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // To Token
            1, // Amount to swap
            30, // Slippage
            keypair.publicKey.toString(), // Payer public key
            0.00005, // Priority fee (Recommended while network is congested)
            true // Force legacy transaction for Jupiter
        );
        return swapResponse;
    } catch (error) {
        return error;
    }
}

swap().then((res) => {
    console.log(res);
});