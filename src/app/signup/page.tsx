"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema, AuthFormData } from "@/lib/validators/authSchema";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const { register, handleSubmit, formState } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });
  const router = useRouter();

  const onSubmit = async (data: AuthFormData) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) router.push("/login");
    else alert("Signup failed");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-md mx-auto mt-12"
    >
      <input
        {...register("email")}
        placeholder="Email"
        className="border p-2 w-full"
      />
      <input
        {...register("password")}
        type="password"
        placeholder="Password"
        className="border p-2 w-full"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">
        Sign Up
      </button>
      {formState.errors.email && <p>{formState.errors.email.message}</p>}
      {formState.errors.password && <p>{formState.errors.password.message}</p>}
    </form>
  );
}
