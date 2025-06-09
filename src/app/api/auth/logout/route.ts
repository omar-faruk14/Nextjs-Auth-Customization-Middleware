import { clearAuthCookies } from "@/app/lib/auth/cookies";
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" });
  clearAuthCookies(res);
  return res;
}
