import { createKeypair } from "$/solana-daddy";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import createKeypairs from "../../../../lib/keypair-data";
import prismadb from "../../../../lib/prismadb";
import { o } from "@raydium-io/raydium-sdk-v2/lib/type-9fe71e3c";

export async function GET(
    req: Request,
) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
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
        return NextResponse.json({ keypairs: length }, { status: 200 });
    } catch (e) {
        console.log("[KEYPAIR_FETCH_ERROR]", e);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(
    req: Request,
) {
    try {
        const { userId, amount, overwrite } = await req.json();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!amount) {
            return new NextResponse("Amount not provided", { status: 400 });
        }
        if (overwrite === undefined) {
            return new NextResponse("Overwrite not provided", { status: 400 });
        }
        // check if keypairs already exist, if yes and overwrite is false, return error message
        const prismaKeys = await prismadb.solanaKeypair.findMany({
            where: {
                user: {
                    userId: userId
                }
            }
        })
        if (prismaKeys && overwrite === false) {
            return new NextResponse("Keypairs already exist", { status: 400 });
        }
        // delete existing keypairs
        if (prismaKeys && overwrite === true) {
            const deleted = await prismadb.solanaKeypair.deleteMany({
                where: {
                    user: {
                        userId: userId
                    }
                }
            })
            console.log("[KEYPAIR_DELETE_SUCCESS]", deleted);
        }
        // generate keypairs
        const keypairs = await createKeypairs(userId, amount);
        if (!keypairs || !keypairs.success) {
            return new NextResponse("Something Went Wrong Generating Keys", { status: 400 });
        }
        console.log("[KEYPAIR_GENERATION_SUCCESS]", keypairs);
        return NextResponse.json(`${amount} Keypairs generated for user`, { status: 200 });
    } catch (e) {
        console.log("[USER_FETCH_ERROR]", e);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
) {
    try {
        const { userId } = await req.json();
        if (!userId) {
            return new NextResponse("Unauthorized: provide userId", { status: 401 });
        }
        const keypairs = await prismadb.solanaKeypair.deleteMany({
            where: {
                user: {
                    userId: userId
                }
            }
        })
        console.log("[KEYPAIR_DELETE_SUCCESS]", keypairs);
        return NextResponse.json("Keypairs deleted", { status: 200 });
    } catch (e) {
        console.log("[KEYPAIR_DELETE_ERROR]", e);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
