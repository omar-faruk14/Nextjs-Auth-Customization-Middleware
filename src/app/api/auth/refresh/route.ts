import { verifyRefreshToken, generateAccessToken } from "@/app/lib/auth/token";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();
  const refreshToken = (await cookieStore).get("refresh_token")?.value;
  if (!refreshToken)
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });

  try {
    const payload = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken(payload.userId);

    const res = NextResponse.json({ message: "Token refreshed" });
    res.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 15,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 401 }
    );
  }
}
