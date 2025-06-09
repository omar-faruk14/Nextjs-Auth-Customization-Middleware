import { verifyAccessToken } from "@/app/lib/auth/token";
import { db } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const accessToken = (req.headers.get("cookie") || "")
    .split("; ")
    .find((cookie) => cookie.startsWith("access_token="))
    ?.split("=")[1];

  if (!accessToken)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = verifyAccessToken(accessToken);
    const [rows] = await db.query("SELECT id, email FROM users WHERE id = ?", [
      payload.userId,
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = (rows as any[])[0];

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
