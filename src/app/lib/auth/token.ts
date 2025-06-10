import { SignJWT, jwtVerify } from "jose";

const encoder = new TextEncoder();

const ACCESS_SECRET = encoder.encode(process.env.JWT_ACCESS_SECRET!);
const REFRESH_SECRET = encoder.encode(process.env.JWT_REFRESH_SECRET!);

export async function generateAccessToken(userId: number): Promise<string> {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(ACCESS_SECRET); // HS256 secret must be Uint8Array
}

export async function generateRefreshToken(userId: number): Promise<string> {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(REFRESH_SECRET);
}


export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, ACCESS_SECRET);
  return payload;
}

export async function verifyRefreshToken(
  token: string
): Promise<{ userId: number }> {
  const { payload } = await jwtVerify(token, REFRESH_SECRET);
  return payload as { userId: number };
}
