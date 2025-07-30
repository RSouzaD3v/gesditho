// app/api/agent-document/route.ts
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "You're an expert in project planning, management, and documentation. You don't explain anything, you just generate content. You generate clean text without any styling.",
      },
    });

    return NextResponse.json({ result: response.text });
  } catch (error) {
    console.error("Erro ao gerar conteúdo com IA:", error);
    return NextResponse.json({ error: "Erro ao gerar conteúdo" }, { status: 500 });
  }
}
