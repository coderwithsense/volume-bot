import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
) {
    try {
        const {userId} = auth();
        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }
        return new NextResponse("Logged in as " + userId);
    } catch (e) {
        console.log("[USER_FETCH_ERROR]", e);
        return new NextResponse("Internal Error", {status: 500});
    }
}