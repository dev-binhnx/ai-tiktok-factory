"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CollectGoogleTrendsButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCollect() {
    setLoading(true);

    try {
      const res = await fetch("/api/trends/collect/google", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Quét Google Trends thất bại");
      }

      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleCollect}
      disabled={loading}
      className="rounded-lg bg-blue-500 px-5 py-3 font-semibold text-white disabled:opacity-50"
    >
      {loading ? "Đang quét..." : "Quét Google Trends"}
    </button>
  );
}