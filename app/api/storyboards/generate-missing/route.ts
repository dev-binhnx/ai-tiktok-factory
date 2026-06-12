import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateStoryboard } from "@/lib/ai/generate-storyboard";

export async function POST() {
  try {
    const scripts = await prisma.script.findMany({
      where: {
        scenes: {
          none: {},
        },
      },
      take: 5,
    });

    let created = 0;

    for (const script of scripts) {
      const scenes = await generateStoryboard({
        title: script.title,
        hook: script.hook,
        content: script.content,
        cta: script.cta,
      });

      await prisma.scene.createMany({
        data: scenes.map((scene) => ({
          scriptId: script.id,
          order: scene.order,
          voiceText: scene.voiceText,
          visualText: scene.visualText,
          captionText: scene.captionText,
          durationSec: scene.durationSec,
        })),
      });

      created += scenes.length;
    }

    return NextResponse.json({
      scripts: scripts.length,
      scenes: created,
    });
  } catch (error) {
    console.error("[GENERATE_STORYBOARD_ERROR]", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}