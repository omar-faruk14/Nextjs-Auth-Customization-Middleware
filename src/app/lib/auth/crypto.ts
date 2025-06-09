import { pbkdf2Sync, randomBytes } from "crypto";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export function comparePassword(password: string, stored: string): boolean {
  const [salt, originalHash] = stored.split(":");
  const hash = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return originalHash === hash;
}
