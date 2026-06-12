import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { generateVoice } from "@/lib/ai/generate-voice";

export async function POST() {
  try {
    const scenes =
      await prisma.scene.findMany({
        where: {
          voiceAsset: null,
        },
        take: 10,
      });

    let created = 0;

    for (const scene of scenes) {
      const filePath =
        await generateVoice(
          scene.id,
          scene.voiceText
        );

      await prisma.voiceAsset.create({
        data: {
          sceneId: scene.id,
          filePath,
        },
      });

      created++;
    }

    return NextResponse.json({
      scenes: scenes.length,
      created,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}