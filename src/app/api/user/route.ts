import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createUser, getUser } from "../../../../lib/user-data";

export async function GET(
    req: Request,
) {
    try {
        const {userId} = auth();
        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }
        createUser(userId.toString());
        const user = await getUser(userId);
        console.log("[USER_FETCH_SUCCESS]", user);
        return NextResponse.json({user: user}, {status: 200});
    } catch (e) {
        console.log("[USER_FETCH_ERROR]", e);
        return new NextResponse("Internal Error", {status: 500});
    }
}