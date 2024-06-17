import { auth } from "@clerk/nextjs/server";
import { Keypair } from "@solana/web3.js";
import prismadb from "./prismadb";
import base58 from "bs58";

const createKeypairs = async (userId: string, amount: number) => {
    if (!userId) {
        console.log("[ERROR_CREATING_KEYPAIRS]: User not authenticated");
        return;
    }
    if (amount > 100) {
        console.log("[ERROR_GENERATING_KEYPAIRS]: Too many keys requested");
        return;
    }
    const keypairs = [];
    for (let i=0; i<amount; i++){
        const keypair = Keypair.generate();
        keypairs.push(keypair);
        // await prismadb.solanaKeypair.createMany({
        //     data: {
        //         [
        //             {publicKey:}
        //         ]
        //     }
        // })

        // await prismadb.solanaKeypair.create({
        //     data: {
        //         publicKey: keypair.publicKey.toString(),
        //         privateKey: base58.encode(keypair.secretKey),
        //         user: {
        //             connect: {
        //                 userId: userId as string,
        //             }
        //         }
        //     }
        // })
    }
    console.log("[KEYPAIR_GENERATION_SUCCESS]", keypairs);
}

export default createKeypairs;