import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import createBot from "../../../../lib/bot-data";
import prismadb from "../../../../lib/prismadb";

export async function GET(
    req: Request,
) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const bot = await prismadb.bot.findMany({
            where: {
                user: {
                    userId: userId
                }
            }
        })
        if (bot.length === 0) {
            return new NextResponse("No bot running...", { status: 404 });
        }
        return NextResponse.json({ bot }, { status: 200 });
    } catch {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(
    req: Request,
) {
    try {
        const { userId, botName, exchange, tokenAddress, walletsAmount, capitalAmount, expiryDate, overwrite } = await req.json();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!botName || !exchange || !tokenAddress || !walletsAmount || !capitalAmount || !expiryDate) {
            return new NextResponse("Missing fields", { status: 400 });
        }
        // check if bot already exists
        const botExists = await prismadb.bot.findUnique({
            where: {
                userId: userId,
            }
        })
        if (botExists && !overwrite) {
            return new NextResponse("Bot already exists, use overwrite: true, if you want to delete and make a new one.", { status: 409 });
        }
        if (botExists && overwrite) {
            await prismadb.bot.delete({
                where: {
                    userId: userId
                }
            })
        }
        const bot = await createBot(userId, botName, exchange, tokenAddress, walletsAmount, capitalAmount, expiryDate);
        // creating keypairs for the bot
        fetch("http://localhost:3000/api/keypair",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: userId,
                    amount: walletsAmount,
                    overwrite: true
                })
            }
        )
            .then((res) => res.json())
            .then((data) => {
                console.log("🚀 ~ .then ~ data:", data)
            })
            .catch((e) => {
                console.log("🚀 ~ .catch ~ e", e)
                return new NextResponse("Internal Error, creating keypairs", { status: 500 });
            })
        // end of creating keypairs
        return NextResponse.json({ bot }, { status: 200 });
    } catch (e) {
        console.log("[BOT_GENERATION_ERROR]", e);
        return new NextResponse("Internal Error", { status: 500 });
    }
}