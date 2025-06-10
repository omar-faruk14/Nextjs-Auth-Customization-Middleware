"use server";

import { db } from "@/app/lib/db";
import { z } from "zod";

const UpdateEmailSchema = z.object({
  email: z.string().email(),
});

export async function updateEmail(
  formData: FormData,
  { headers }: { headers: Headers }
) {
  const raw = {
    email: formData.get("email"),
  };

  const parsed = UpdateEmailSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Invalid email address" };
  }

  const userId = Number(headers.get("x-user-id"));
  if (!userId) {
    return { error: "Unauthorized" };
  }

  const { email } = parsed.data;

  await db.query("UPDATE users SET email = ? WHERE id = ?", [email, userId]);

  return { success: true };
}
