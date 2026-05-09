import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, mimeType } = await request.json();

    if (!imageBase64 || !mimeType) {
      return NextResponse.json({ error: "画像データが不正です" }, { status: 400 });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${imageBase64}` },
            },
            {
              type: "text",
              text: "この画像に何が写っているか、日本語で詳しく説明してください。",
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    const description = response.choices[0]?.message?.content ?? "説明を取得できませんでした";
    return NextResponse.json({ description });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json({ error: "画像の解析に失敗しました" }, { status: 500 });
  }
}
