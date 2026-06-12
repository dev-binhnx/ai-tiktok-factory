import { gemini } from "@/lib/gemini";

export async function generateStoryboard(input: {
  title: string;
  hook: string;
  content: string;
  cta: string;
}) {
  const prompt = `
Bạn là đạo diễn video TikTok Shop.

Kịch bản:
Title: ${input.title}
Hook: ${input.hook}
Content: ${input.content}
CTA: ${input.cta}

Hãy chia thành 4-6 cảnh cho video dọc 9:16, dài 25-35 giây.

Trả về JSON array thuần:
[
  {
    "order": 1,
    "voiceText": "...",
    "visualText": "...",
    "captionText": "...",
    "durationSec": 5
  }
]

Yêu cầu:
- visualText mô tả cảnh quay/sản phẩm rõ ràng
- captionText ngắn, phù hợp subtitle TikTok
- voiceText là lời đọc
- Không markdown
`;

  const result = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = result.text ?? "";

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned) as {
    order: number;
    voiceText: string;
    visualText: string;
    captionText: string;
    durationSec: number;
  }[];
}