import prismadb from "./prismadb";


const createKeypair = async (amount: number) => {
    if (amount > 100) {
        console.log("Too many keys requested");
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