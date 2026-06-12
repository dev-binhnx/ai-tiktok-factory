"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CollectRepairSeedsButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCollect() {
    setLoading(true);

    try {
      const res = await fetch("/api/trends/collect/repair-seeds", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Tạo trend sửa xe thất bại");
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
      className="rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-slate-950 disabled:opacity-50"
    >
      {loading ? "Đang tạo..." : "Tạo trend sửa xe"}
    </button>
  );
}