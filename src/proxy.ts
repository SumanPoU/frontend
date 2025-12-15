import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isAuthRoute = pathname === "/login" || pathname === "/register";

  const isPublicRoute =
    isAuthRoute || pathname.startsWith("/_next") || pathname.startsWith("/api");

  const isProtectedRoute = pathname.startsWith("/dashboard");

  if (isAuthRoute && (accessToken || refreshToken)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (isProtectedRoute) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (accessToken) {
      return NextResponse.next();
    }

    try {
      const refreshResponse = await fetch(
        `${process.env.API_BASE_URL}/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        }
      );

      if (!refreshResponse.ok) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return response;
      }

      const data = await refreshResponse.json();

      const response = NextResponse.next();
      response.cookies.set("accessToken", data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 900,
        path: "/",
      });

      return response;
    } catch (error) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
