import { prisma } from "@/lib/prisma";
import { TrendForm } from "./trend-form";
import { CollectGoogleTrendsButton } from "./collect-google-trends-button";
import { CollectRepairSeedsButton } from "./collect-repair-seeds-button";
import { GenerateMissingScriptsButton } from "./generate-missing-scripts-button";
import { GenerateStoryboardsButton } from "./generate-storyboards-button";
import { GenerateVoicesButton } from "./generate-voices-button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const trends = await prisma.trend.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      scripts: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold">AI TikTok Factory</h1>
                <p className="mt-1 text-slate-400">
                Danh sách trend và kịch bản AI đã tạo
                </p>
            </div>

            <CollectGoogleTrendsButton />
            <CollectRepairSeedsButton />
            <GenerateMissingScriptsButton />
            <GenerateStoryboardsButton />
            <GenerateVoicesButton />
        </header>
        <TrendForm />
        {trends.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-slate-400">Chưa có trend nào.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {trends.map((trend) => (
              <div
                key={trend.id}
                className="rounded-xl border border-slate-800 bg-slate-900 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-slate-400">
                      {trend.source} · Score: {trend.score}
                    </div>

                    <h2 className="text-xl font-semibold mt-1">
                      {trend.title}
                    </h2>

                    <p className="text-sm text-emerald-400 mt-1">
                      #{trend.keyword}
                    </p>

                    {trend.description && (
                      <p className="text-slate-300 mt-3">
                        {trend.description}
                      </p>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 whitespace-nowrap">
                    {trend.createdAt.toLocaleString("vi-VN")}
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {trend.scripts.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      Chưa có kịch bản.
                    </p>
                  ) : (
                    trend.scripts.map((script) => (
                      <div
                        key={script.id}
                        className="rounded-lg border border-slate-700 bg-slate-950 p-4"
                      >
                        <h3 className="font-semibold text-lg">
                          {script.title}
                        </h3>

                        <div className="mt-3 space-y-2 text-sm">
                          <p>
                            <span className="text-orange-400 font-medium">
                              Hook:
                            </span>{" "}
                            {script.hook}
                          </p>

                          <p>
                            <span className="text-blue-400 font-medium">
                              Nội dung:
                            </span>{" "}
                            {script.content}
                          </p>

                          <p>
                            <span className="text-pink-400 font-medium">
                              CTA:
                            </span>{" "}
                            {script.cta}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}