"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function GenerateStoryboardsButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);

    try {
      const res = await fetch("/api/storyboards/generate-missing", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Tạo storyboard thất bại");
      }

      alert(`Đã tạo ${data.scenes} cảnh`);
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
      className="rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white disabled:opacity-50"
    >
      {loading ? "Đang tạo storyboard..." : "Tạo storyboard"}
    </button>
  );
}