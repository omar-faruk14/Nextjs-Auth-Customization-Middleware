// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { fetchWithAuth } from "@/app/lib/fetchWithAuth";

// export default function ProfilePage() {
//   const [user, setUser] = useState<{ id: number; email: string } | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     fetchWithAuth("/api/me")
//       .then(async (res) => {
//         if (res.ok) {
//           const data = await res.json();
//           setUser(data.user);
//         } else {
//           router.push("/login");
//         }
//       })
//       .catch(() => router.push("/login"));
//   }, [router]);

//   const handleLogout = async () => {
//     await fetch("/api/auth/logout", { method: "POST" });
//     router.push("/login");
//   };

//   if (!user) return <p>Loading...</p>;

//   return (
//     <div className="max-w-xl mx-auto mt-10">
//       <h1 className="text-2xl font-bold">Welcome, {user.email}!</h1>
//       <p>User ID: {user.id}</p>
//       <button
//         onClick={handleLogout}
//         className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//       >
//         Logout
//       </button>
//     </div>
//   );
// }



"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { updateEmail } from "@/app/actions/updateEmail";


type FormValues = {
  email: string;
};

export default function UpdateEmailForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();
      formData.append("email", data.email);

      const result = await updateEmail(formData); 
      setServerMessage(result.error ?? "Email updated successfully.");
    } catch {
      setServerMessage("Something went wrong. Try again.");
    }
  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
      <label className="block">
        <span className="text-sm">New Email</span>
        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^@]+@[^@]+\.[^@]+$/,
              message: "Invalid email address",
            },
          })}
          type="email"
          className="mt-1 w-full p-2 border rounded"
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isSubmitting ? "Updating..." : "Update Email"}
      </button>

      {serverMessage && (
        <p className="text-sm mt-2 text-blue-600">{serverMessage}</p>
      )}
    </form>
  );
}
