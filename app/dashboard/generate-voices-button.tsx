"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function GenerateVoicesButton() {
  const [loading, setLoading] =
    useState(false);

  const router = useRouter();

  async function handleClick() {
    setLoading(true);

    try {
      const res = await fetch(
        "/api/voices/generate-missing",
        {
          method: "POST",
        }
      );

      const data =
        await res.json();

      alert(
        `Created ${data.created} voices`
      );

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="rounded-lg bg-green-600 px-5 py-3 text-white"
    >
      {loading
        ? "Generating..."
        : "Generate Voices"}
    </button>
  );
}