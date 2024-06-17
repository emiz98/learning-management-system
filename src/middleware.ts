import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { IUserRole } from "./interfaces/IUserRole";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });
  const { pathname } = req.nextUrl;

  if (!token) {
    if (pathname.startsWith("/user") || pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  } else {
    const userRole = token.role;

    if (pathname.startsWith("/user") && userRole === IUserRole.ADMIN) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (pathname.startsWith("/admin") && userRole === IUserRole.USER) {
      return NextResponse.redirect(new URL("/user", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
