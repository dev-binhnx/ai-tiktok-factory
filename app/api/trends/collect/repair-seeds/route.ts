import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRepairSeedTrends } from "@/lib/trends/repair-seeds";

export async function POST() {
  const trends = getRepairSeedTrends();

  const created = [];

  for (const trend of trends) {
    const exists = await prisma.trend.findFirst({
      where: {
        source: trend.source,
        keyword: trend.keyword,
      },
    });

    if (exists) continue;

    const item = await prisma.trend.create({
      data: trend,
    });

    created.push(item);
  }

  return NextResponse.json({
    fetched: trends.length,
    created: created.length,
    trends: created,
  });
}