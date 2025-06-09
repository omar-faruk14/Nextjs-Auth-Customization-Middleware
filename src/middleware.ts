import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "@/app/lib/auth/token";

export function middleware(req: NextRequest) {
  console.log("🔒 Middleware hit:", req.nextUrl.pathname);
  const accessToken = req.cookies.get("access_token")?.value;
  if (!accessToken) return NextResponse.redirect(new URL("/login", req.url));

  try {
    verifyAccessToken(accessToken);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
export const config = {
  matcher: ["/dashboard/:path*", "/profile"],
};

