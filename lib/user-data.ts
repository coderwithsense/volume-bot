import { Keypair } from "@solana/web3.js";
import prismadb from "./prismadb";
import base58 from "bs58";
import { auth } from "@clerk/nextjs/server";

const createUser = async (username: string) => {
    const {userId} = auth();
    if (!userId) {
        console.log("[ERROR_CREATING_USER]: User not authenticated");
    }

    let userIdString = "";
    if(userId){
        userIdString = userId.toString()
    }
    const user = await prismadb.user.findUnique({
        where: {
            id: userIdString,
            userId: userIdString,
        }
    });
    if (user) {
        console.log("User already exists");
    }
    if(!userId) {
        const newUser = await prismadb.user.create({
            data: {
                id: userIdString,
                userId: userIdString,
                username: username,
            }
        })
        console.log("User created", newUser);
    }
} 

const getUser = async (userId: string) => {
    const user = await prismadb.user.findUnique({
        where: {
            id: userId,
        }
    });
    return user;
}

const createKeypair = async (amount: number) => {
    const {userId} = auth();
    if (!userId) {
        console.log("[ERROR_CREATING_KEYPAIRS]: User not authenticated");
    }
    if (amount > 100) {
        console.log("[ERROR_GENERATING_KEYPAIRS]: Too many keys requested");
    }
    const keypairs = [];
    for (let i=0; i<amount; i++){
        const keypair = Keypair.generate();
        keypairs.push(keypair);

        await prismadb.solanaKeypair.create({
            data: {
                publicKey: keypair.publicKey.toString(),
                privateKey: base58.encode(keypair.secretKey),
                userId: "mongoose"
            }
        })
    }
}

const createBot = async (
    name: string,
    exchange: string,
    tokenAddress: string,
    walletsAmount: number,
    capitalAmount: number,
    expiryDate: Date,
) => {
    // check if bot exists
    const bot = await prismadb.bot.findUnique({
        where: {
            id: name,
        }
    });
    if (bot) {
        console.log("Bot already exists");
        return;
    }
    // create bot
    // await prismadb.bot.create({
    //     where: {
    //         id: name,
    //         exchange: exchange,
    //         tokenAddress: tokenAddress,
    //         walletsAmount: walletsAmount,
    //         capitalAmount: capitalAmount,
    //         expiryDate: expiryDate,
    //     }
    // })
}

export {createUser, createKeypair, createBot, getUser};