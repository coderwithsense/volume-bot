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

export {createUser, getUser, updateUser};