"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    fetch("/admin/api/check")
      .then((r) => r.json())
      .then((data) => {
        if (data.isAdmin) {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/login");
        }
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100">
      <p className="text-sm text-neutral-500">Redirecting...</p>
    </div>
  );
}
