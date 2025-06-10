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
import { headers } from "next/headers";
import { updateEmail } from "@/app/actions/updateEmail";
import { redirect } from "next/navigation";

interface Props {
  searchParams?: {
    message?: string;
  };
}

export default async function UpdateEmailForm(props: Props) {
  const searchParams = props.searchParams
    ? await props.searchParams
    : undefined;

  async function handleUpdate(formData: FormData) {
    "use server";

    const hdrs = await headers();
    const result = await updateEmail(formData, { headers: hdrs });
    const message = result.error ?? "Email updated successfully.";
    redirect(`/profile?message=${encodeURIComponent(message)}`);

  }

  return (
    <form action={handleUpdate} className="space-y-4 mt-6">
      <label className="block">
        <span className="text-sm">New Email</span>
        <input
          name="email"
          type="email"
          required
          className="mt-1 w-full p-2 border rounded"
        />
      </label>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Update Email
      </button>

      {searchParams?.message && (
        <p className="text-sm mt-2">
          {decodeURIComponent(searchParams.message)}
        </p>
      )}
    </form>
  );
}