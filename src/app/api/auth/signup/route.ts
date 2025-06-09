import { db } from "@/app/lib/db";
import { hashPassword } from "@/app/lib/auth/crypto";
import { AuthSchema } from "@/app/lib/auth/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = AuthSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const { email, password } = parsed.data;

  const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [
    email,
  ]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((rows as any[]).length > 0) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 409 }
    );
  }

  const hashed = hashPassword(password);
  await db.query("INSERT INTO users (email, password) VALUES (?, ?)", [
    email,
    hashed,
  ]);

  return NextResponse.json({ message: "User created" });
}
