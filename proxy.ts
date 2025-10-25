import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getCurrentUserRole,
  publicApiRoutes,
  authPageRoutes,
  customerHomeRoutes,
  organizationHomeRoutes,
  UserRole,
} from "@/lib/guards";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicApiRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  try {
    const role = await getCurrentUserRole();

    if (!role) {
      if (authPageRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.next();
      }
      const loginUrl = new URL("/auth/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    if (authPageRoutes.some((route) => pathname.startsWith(route))) {
      if (role === UserRole.CUSTOMER) {
        const homeUrl = new URL(customerHomeRoutes, request.url);
        return NextResponse.redirect(homeUrl);
      }
      if (role === UserRole.ORGANIZATION) {
        const homeUrl = new URL(organizationHomeRoutes, request.url);
        return NextResponse.redirect(homeUrl);
      }
    }

    if (pathname === "/") {
      if (role === UserRole.CUSTOMER) {
        const homeUrl = new URL(customerHomeRoutes, request.url);
        return NextResponse.redirect(homeUrl);
      }
      if (role === UserRole.ORGANIZATION) {
        const homeUrl = new URL(organizationHomeRoutes, request.url);
        return NextResponse.redirect(homeUrl);
      }
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
