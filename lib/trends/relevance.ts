const VEHICLE_REPAIR_KEYWORDS = [
  "xe máy",
  "xe ga",
  "tay ga",
  "xe số",
  "xe côn",
  "côn tay",
  "sửa xe",
  "thợ sửa xe",
  "gara",
  "garage",
  "phụ tùng",
  "đồ nghề",
  "dụng cụ sửa xe",

  "honda",
  "yamaha",
  "suzuki",
  "sym",
  "piaggio",
  "vespa",

  "vision",
  "air blade",
  "lead",
  "sh",
  "vario",
  "click",
  "wave",
  "dream",
  "future",
  "exciter",
  "winner",
  "sirius",
  "jupiter",
  "raider",
  "satria",

  "nồi xe",
  "bố nồi",
  "chuông nồi",
  "dây curoa",
  "bugi",
  "kim phun",
  "bạc đạn",
  "vòng bi",
  "phanh",
  "thắng",
  "heo dầu",
  "pô xe",
  "lọc gió",
  "nhớt",
  "lốp xe",
  "vỏ xe",
  "xích",
  "nhông",
  "sên",
  "dĩa",

  "cảo",
  "tuýp",
  "cờ lê",
  "mỏ lết",
  "kìm",
  "kích",
  "súng bắn ốc",
  "máy ra vào lốp",
  "máy nén khí",
];

export function isVehicleRepairTrend(input: {
  keyword: string;
  title?: string;
  description?: string | null;
}) {
  const text = [
    input.keyword,
    input.title ?? "",
    input.description ?? "",
  ]
    .join(" ")
    .toLowerCase();

  return VEHICLE_REPAIR_KEYWORDS.some((keyword) =>
    text.includes(keyword.toLowerCase())
  );
}