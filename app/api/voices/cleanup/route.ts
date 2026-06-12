import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

export async function POST() {
  await prisma.voiceAsset.deleteMany();

  const audioDir = path.join(process.cwd(), "storage", "audio");

  try {
    const files = await fs.readdir(audioDir);

    await Promise.all(
      files
        .filter((file) => file.endsWith(".wav"))
        .map((file) => fs.unlink(path.join(audioDir, file)))
    );
  } catch {}

  return NextResponse.json({
    deleted: true,
  });
}