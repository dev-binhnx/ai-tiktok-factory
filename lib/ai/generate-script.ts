import { gemini } from "@/lib/gemini";

export async function generateTikTokScript(input: {
  keyword: string;
  title: string;
  description?: string | null;
}) {
  const prompt = `
Bạn là chuyên gia TikTok Shop tại Việt Nam.

Ngành hàng:
- Phụ tùng xe máy
- Đồ nghề sửa xe
- Dụng cụ gara

Trend:
- Keyword: ${input.keyword}
- Tiêu đề: ${input.title}
- Mô tả: ${input.description ?? ""}

Hãy viết kịch bản TikTok 25-35 giây.

Trả về JSON thuần:
{
  "title": "...",
  "hook": "...",
  "content": "...",
  "cta": "..."
}

Yêu cầu:
- Hook 3 giây đầu thật mạnh
- Giọng văn bán hàng tự nhiên
- Không nói quá sự thật
- Có CTA mua hàng
- Phù hợp TikTok Shop Việt Nam
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
    title: string;
    hook: string;
    content: string;
    cta: string;
  };
}