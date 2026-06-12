import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTikTokScript } from "@/lib/ai/generate-script";

export async function POST() {
  try {
    const trends = await prisma.trend.findMany({
      where: {
        scripts: {
          none: {},
        },
      },
      orderBy: {
        score: "desc",
      },
      take: 10,
    });

    const created = [];

    for (const trend of trends) {
      const aiScript = await generateTikTokScript({
        keyword: trend.keyword,
        title: trend.title,
        description: trend.description,
      });

      const script = await prisma.script.create({
        data: {
          trendId: trend.id,
          title: aiScript.title,
          hook: aiScript.hook,
          content: aiScript.content,
          cta: aiScript.cta,
        },
      });

      created.push(script);
    }

    return NextResponse.json({
      found: trends.length,
      created: created.length,
      scripts: created,
    });
  } catch (error) {
    console.error("[GENERATE_MISSING_SCRIPTS_ERROR]", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}