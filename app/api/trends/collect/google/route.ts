import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchGoogleTrendsVN } from "@/lib/trends/google-trends";
import { isVehicleRepairTrend } from "@/lib/trends/relevance";

export async function POST() {
  try {
    const rawTrends = await fetchGoogleTrendsVN();

    const relevantTrends = rawTrends.filter((trend) =>
      isVehicleRepairTrend({
        keyword: trend.keyword,
        title: trend.title,
        description: trend.description,
      })
    );

    const created = [];

    for (const trend of relevantTrends) {
      const exists = await prisma.trend.findFirst({
        where: {
          source: trend.source,
          keyword: trend.keyword,
        },
      });

      if (exists) continue;

      const item = await prisma.trend.create({
        data: {
          ...trend,
          score: Math.max(trend.score, 70),
        },
      });

      created.push(item);
    }

    return NextResponse.json({
      fetched: rawTrends.length,
      relevant: relevantTrends.length,
      created: created.length,
      ignored: rawTrends.length - relevantTrends.length,
      trends: created,
    });
  } catch (error) {
    console.error("[COLLECT_GOOGLE_TRENDS_ERROR]", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}