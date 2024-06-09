import { createKeypair } from "$/solana-daddy";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import createKeypairs from "../../../../lib/keypair-data";
import prismadb from "../../../../lib/prismadb";

export async function GET(
    req: Request,
) {
    try {
        const {userId} = auth();
        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }
        const keypairs = await prismadb.solanaKeypair.findMany({
            where: {
                user: {
                    userId: userId
                }
            }
        })
        const length = keypairs.length;
        // console.log("[KEYPAIR_FETCH_SUCCESS]", keypairs);
        return NextResponse.json({keypairs: length}, {status: 200});
    } catch (e) {
        console.log("[KEYPAIR_FETCH_ERROR]", e);
        return new NextResponse("Internal Error", {status: 500});  
    }
}

export async function POST(
    req: Request,
) {
    try {
        const {userId, amount} = await req.json();
        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }
        if(!amount) {
            return new NextResponse("Amount not provided", {status: 400});
        }
        const keypairs = await createKeypairs(userId, amount);
        console.log("[KEYPAIR_GENERATION_SUCCESS]", keypairs);
        return NextResponse.json("Keypairs generated for user", {status: 200});
    } catch (e) {
        console.log("[USER_FETCH_ERROR]", e);
        return new NextResponse("Internal Error", {status: 500});
    }
}

export async function DELETE(
    req: Request,
) {
    try {
        const {userId} = await req.json();
        if(!userId) {
            return new NextResponse("Unauthorized: provide userId", {status: 401});
        }
        const keypairs = await prismadb.solanaKeypair.deleteMany({
            where: {
                user: {
                    userId: userId
                }
            }
        })
        console.log("[KEYPAIR_DELETE_SUCCESS]", keypairs);
        return NextResponse.json("Keypairs deleted", {status: 200});
    } catch (e) {
        console.log("[KEYPAIR_DELETE_ERROR]", e);
        return new NextResponse("Internal Error", {status: 500});
    }
}
