import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;
  const isAuth = !!token;

  const protectedPaths = ["/dashboard"];
  const isProtectedRoute = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  const authPages = ["/auth/signin", "/auth/error"];
  const isAuthPage = authPages.some((path) => pathname.startsWith(path));

  if (isProtectedRoute && !isAuth) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
}; 