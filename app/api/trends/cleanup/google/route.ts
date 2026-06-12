import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isVehicleRepairTrend } from "@/lib/trends/relevance";

export async function POST() {
  const trends = await prisma.trend.findMany({
    where: {
      source: "google_trends",
    },
  });

  const unrelated = trends.filter(
    (trend) =>
      !isVehicleRepairTrend({
        keyword: trend.keyword,
        title: trend.title,
        description: trend.description,
      })
  );

  const deleted = await prisma.trend.deleteMany({
    where: {
      id: {
        in: unrelated.map((trend) => trend.id),
      },
    },
  });

  return NextResponse.json({
    checked: trends.length,
    deleted: deleted.count,
  });
}