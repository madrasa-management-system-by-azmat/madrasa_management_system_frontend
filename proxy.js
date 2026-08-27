import { NextResponse } from "next/server";

const AUTH_ROUTE_COOKIE = "madrasa-authenticated";

export function proxy(request) {
  const isAuthenticated =
    request.cookies.get(AUTH_ROUTE_COOKIE)?.value === "true";
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth", "/dashboard/:path*"],
};
