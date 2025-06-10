import { db } from "@/app/lib/db";
import { comparePassword } from "@/app/lib/auth/crypto";
import { generateAccessToken, generateRefreshToken } from "@/app/lib/auth/token";
import { AuthSchema } from "@/app/lib/auth/schema";
import { setAuthCookies } from "@/app/lib/auth/cookies";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = AuthSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

  const { email, password } = parsed.data;
  const [rows] = await db.query(
    "SELECT id, password FROM users WHERE email = ?",
    [email]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = (rows as any[])[0];
  if (!user || !comparePassword(password, user.password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const accessToken = await generateAccessToken(user.id);
  const refreshToken = await generateRefreshToken(user.id);

  const res = NextResponse.json({ message: "Logged in" });
  setAuthCookies(res, accessToken, refreshToken);
  return res;
}
