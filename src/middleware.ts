import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
    try {
        // const token = await getToken({ req: request });
        const token = await getToken({ req: request, secret: process.env.NEXT_AUTH_SECRET||"hello_world" });
        const url = request.nextUrl;
        console.log(token)
        if (
            token &&
            (url.pathname.startsWith("/sign-in") ||
                url.pathname.startsWith("/sign-up") ||
                url.pathname.startsWith("/verify") )
        ) {
            console.log("redirected to dashboard");
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        if (!token && url.pathname.startsWith("/dashboard")) {
            console.log("redirected to sign-in");
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    } catch (error) {
        console.error("Middleware error:", error);
        return NextResponse.redirect(new URL("/", request.url));
    }
}

export const config = {
    matcher: ["/sign-in", "/sign-up", "/dashboard/:path*", "/", "/verify/:path*"],
};
