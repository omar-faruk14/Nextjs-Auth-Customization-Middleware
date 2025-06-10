import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "@/app/lib/auth/token";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;

  console.log("📥 middleware: Incoming request for", req.nextUrl.pathname);
  console.log("🍪 middleware: Access token from cookies:", accessToken);

  if (!accessToken) {
    console.log("❌ middleware: No access token");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const payload = await verifyAccessToken(accessToken);
    console.log("✅ middleware: Token verified for user", payload.userId);
    // Attach userId to request headers to be available in the server action
    const response = NextResponse.next();
    response.headers.set("x-user-id", String(payload.userId));
    return response;
  } catch (err) {
    console.error("❌ middleware: Token verification failed:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/profile"],
};
