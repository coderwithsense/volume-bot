import prismadb from "./prismadb";

const createBot = async (
    userId: string,
    name: string,
    exchange: string,
    tokenAddress: string,
    walletsAmount: number,
    capitalAmount: number,
    expiryDate: number,
) => {
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
    const newBot = await prismadb.bot.create({
        data: {
            exchange: exchange,
            TokenAddress: tokenAddress,
            WalletsAmount: walletsAmount,
            capitalAmount: capitalAmount,
            expiryDate: expiryDate,
            user: {
                connect: {
                    userId: userId
                }
            }
        }
    })
    console.log("[BOT_CREATED]", newBot);
    return newBot;
}

export default createBot;