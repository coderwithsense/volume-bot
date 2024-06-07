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
            userId: userIdString,
        }
    });
    if (user) {
        console.log("User already exists");
    }
    if(!user) {
        const newUser = await prismadb.user.create({
            data: {
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
            userId: userId,
        }
    });
    return user;
}

const updateUser = async (userId: string, fields?: any) => {
    try {
        const user = await prismadb.user.update({
            where: {
                userId: userId as any,
            },
            data: fields
        })
        return {success: true, user: user};
    }
    catch (e) {
        const error = e as Error;
        console.log("[ERROR_UPDATING_USER]", error);
        return {success: false, error: "Something seems off! Check your data you sent maybe!"}
    }
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
                userId: userId,
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

export {createUser, createKeypair, createBot, getUser, updateUser};