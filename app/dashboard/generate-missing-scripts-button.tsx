"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function GenerateMissingScriptsButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);

    try {
      const res = await fetch("/api/scripts/generate-missing", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Tạo script hàng loạt thất bại");
      }

      alert(`Đã tạo ${data.created} script`);
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      className="rounded-lg bg-purple-500 px-5 py-3 font-semibold text-white disabled:opacity-50"
    >
      {loading ? "Đang tạo script..." : "Tạo script còn thiếu"}
    </button>
  );
}