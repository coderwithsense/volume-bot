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
    try {
        const keypairs = [];
        for (let i = 0; i < amount; i++) {
            const keypair = Keypair.generate();
            keypairs.push({
                publicKey: keypair.publicKey.toString(),
                privateKey: base58.encode(keypair.secretKey),
                userId: userId
            });
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
        await prismadb.solanaKeypair.createMany({
            data: keypairs
        })
        return { success: true, keypairs: keypairs };
    }catch (e) {
        const error = e as Error;
        console.log("[ERROR_GENERATING_KEYPAIRS]", error);
        return { success: false, error: "Something seems off! Check your data you sent maybe!" }
    }
}

export default createKeypairs;