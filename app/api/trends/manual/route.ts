import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateTikTokScript } from "@/lib/ai/generate-script";

const BodySchema = z.object({
  source: z.string().default("manual"),
  keyword: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  score: z.number().int().min(0).max(100).default(50),
});

export async function POST(req: Request) {
  try {
    const body = BodySchema.parse(await req.json());

    const trend = await prisma.trend.create({
      data: {
        source: body.source,
        keyword: body.keyword,
        title: body.title,
        description: body.description,
        score: body.score,
      },
    });

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

    return NextResponse.json({
      trend,
      script,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to create trend script",
      },
      { status: 500 }
    );
  }
}