import { clerkMiddleware } from "@clerk/nextjs/server";


export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/dashboard", "/(api|trpc)(.*)"],
};
export default clerkMiddleware();