import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createUser, getUser, updateUser } from "../../../../lib/user-data";

export async function GET(
    req: Request,
) {
    try {
        const {userId} = auth();
        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }
        createUser(userId);
        const user = await getUser(userId);
        console.log("[USER_FETCH_SUCCESS]", user);
        return NextResponse.json({user: user}, {status: 200});
    } catch (e) {
        console.log("[USER_FETCH_ERROR]", e);
        return new NextResponse("Internal Error", {status: 500});
    }
}

export async function POST (
    req: Request,
) {
    try {
        // const {userId} = auth();
        // if(!userId) {
        //     return new NextResponse("Unauthorized", {status: 401});
        // }
        const {userId, changes} = await req.json();
        if (!userId){
            return NextResponse.json({response: "No userId provided"}, {status: 400});
        }
        if (!changes){
            return NextResponse.json({response: "No changes provided"}, {status: 400});
        }
        const user = await updateUser(userId, changes);
        if(user.success) {
            console.log("[USER_UPDATE_SUCCESS]", user);
            return NextResponse.json({response: user}, {status: 200});
        }
        console.log("[USER_UPDATE_ERROR]", user);
        return NextResponse.json({response: user}, {status: 400});
    } catch (e) {
        console.log("[USER_UPDATE_ERROR]", e);
        return new NextResponse("Internal Error", {status: 500});
    }
}