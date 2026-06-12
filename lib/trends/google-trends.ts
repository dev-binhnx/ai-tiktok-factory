import { XMLParser } from "fast-xml-parser";

type GoogleTrendItem = {
  title: string;
  "ht:approx_traffic"?: string;
  pubDate?: string;
  link?: string;
};

export async function fetchGoogleTrendsVN() {
  const url = "https://trends.google.com/trending/rss?geo=VN";

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Google Trends: ${res.status}`);
  }

  const xml = await res.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
  });

  const data = parser.parse(xml);

  const rawItems = data?.rss?.channel?.item ?? [];
  const items = Array.isArray(rawItems) ? rawItems : [rawItems];

  return items
    .filter((item: GoogleTrendItem) => item.title)
    .map((item: GoogleTrendItem) => ({
      source: "google_trends",
      keyword: item.title,
      title: item.title,
      description: `Google Trends VN · ${item["ht:approx_traffic"] ?? ""}`,
      score: 50,
    }));
}