import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthenticated } from "./lib/guards";

const publicRoutes = [
  "/auth/login",
  "/auth/register",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  try {
    const isAuth = await isAuthenticated();
    if (!isAuth) {
      const loginUrl = new URL("/auth/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    if (isAuth && pathname === "/") {
      const homeUrl = new URL("/home", request.url);
      return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Invalid JWT token:", error);
    const loginUrl = new URL("/auth/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("auth-token");
    return response;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
