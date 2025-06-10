// Converts Uint8Array to hex string
function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Converts hex string to Uint8Array
function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

// Edge-compatible password hashing
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 10000,
      hash: "SHA-512",
    },
    key,
    64 * 8 // 64 bytes
  );

  const saltHex = toHex(salt);
  const hashHex = toHex(new Uint8Array(derivedBits));

  return `${saltHex}:${hashHex}`;
}

export async function comparePassword(
  password: string,
  stored: string
): Promise<boolean> {
  const [saltHex, originalHash] = stored.split(":");
  const salt = fromHex(saltHex);

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 10000,
      hash: "SHA-512",
    },
    key,
    64 * 8
  );

  const hashHex = toHex(new Uint8Array(derivedBits));

  return originalHash === hashHex;
}
