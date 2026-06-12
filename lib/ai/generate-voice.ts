import fs from "fs/promises";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { WaveFile } from "wavefile";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

function pcmToWavBuffer(pcmBase64: string) {
  const pcmBuffer = Buffer.from(pcmBase64, "base64");

  const samples = new Int16Array(
    pcmBuffer.buffer,
    pcmBuffer.byteOffset,
    pcmBuffer.byteLength / Int16Array.BYTES_PER_ELEMENT
  );

  const wav = new WaveFile();

  wav.fromScratch(
    1, // mono
    24000, // Gemini TTS sample rate
    "16",
    samples
  );

  return Buffer.from(wav.toBuffer());
}

export async function generateVoice(sceneId: string, text: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Đọc rõ ràng bằng tiếng Việt, giọng tự nhiên, có nhấn nhá: ${text}`,
          },
        ],
      },
    ],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: "Kore",
          },
        },
      },
    },
  });

  const part = response.candidates?.[0]?.content?.parts?.[0];
  const inlineData = part?.inlineData;

  if (!inlineData?.data) {
    throw new Error("Gemini did not return audio");
  }

  console.log("[TTS MIME]", inlineData.mimeType);

  const audioBuffer =
    inlineData.mimeType?.includes("wav")
      ? Buffer.from(inlineData.data, "base64")
      : pcmToWavBuffer(inlineData.data);

  const filePath = path.join(
    process.cwd(),
    "storage",
    "audio",
    `${sceneId}.wav`
  );

  await fs.writeFile(filePath, audioBuffer);

  return filePath;
}