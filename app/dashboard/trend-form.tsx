"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function TrendForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    const payload = {
      keyword: String(form.get("keyword") || ""),
      title: String(form.get("title") || ""),
      description: String(form.get("description") || ""),
      score: Number(form.get("score") || 50),
      source: "manual",
    };

    try {
      const res = await fetch("/api/trends/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Tạo kịch bản thất bại");
      }

      e.currentTarget.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4"
    >
      <h2 className="text-xl font-semibold">Tạo kịch bản từ trend</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          name="keyword"
          required
          placeholder="Keyword, ví dụ: mở nồi xe tay ga"
          className="rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 outline-none"
        />

        <input
          name="score"
          type="number"
          min="0"
          max="100"
          defaultValue="80"
          className="rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 outline-none"
        />
      </div>

      <input
        name="title"
        required
        placeholder="Tiêu đề trend"
        className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 outline-none"
      />

      <textarea
        name="description"
        placeholder="Mô tả trend / insight / sản phẩm liên quan"
        rows={4}
        className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 outline-none"
      />

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        disabled={loading}
        className="rounded-lg bg-emerald-500 text-slate-950 font-semibold px-5 py-3 disabled:opacity-50"
      >
        {loading ? "Đang tạo kịch bản..." : "Tạo script bằng AI"}
      </button>
    </form>
  );
}