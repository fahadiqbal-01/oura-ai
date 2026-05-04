import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { brandName, industry, vibes, audience } = body;

    if (!brandName || !industry || !audience || !Array.isArray(vibes)) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 },
      );
    }

    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured.");
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Oura AI",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [
            {
              role: "user",
              content: `You are a world-class brand strategist and designer. 
            Generate a comprehensive brand identity for a project with the following vision: "${brandName}". 
            Industry: ${industry}. Vibes: ${vibes.join(", ")}. Target Audience: ${audience}.

            Respond ONLY with a valid JSON object:
            {
              "brandName": "A sophisticated suggested name for the brand",
              "tagline": "...",
              "colorPalette": ["#hex1", "#hex2", "#hex3", "#hex4"],
              "fontPairing": { "heading": "Playfair Display", "body": "Inter" },
              "logoLetter": "Extract the best single letter for a monogram",
              "brandPersonality": "...",
              "logoConcept": "Detailed description of a professional logo mark or icon...",
              "sophisticatedPrompt": "A comprehensive, professional Midjourney prompt that captures the brand's visual essence, texture, lighting, and core aesthetic."
            }`,
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message || `OpenRouter Error ${response.status}`,
      );
    }

    const data = await response.json();
    const resultText = data.choices?.[0]?.message?.content;

    if (!resultText) {
      throw new Error("No response content received from AI.");
    }

    const startIdx = resultText.indexOf("{");
    const endIdx = resultText.lastIndexOf("}");

    if (startIdx === -1 || endIdx === -1) {
      throw new Error("The AI failed to return a valid JSON object.");
    }

    const brandData = JSON.parse(resultText.substring(startIdx, endIdx + 1));

    return NextResponse.json(brandData);
  } catch (err) {
    console.error("API Route Error:", err);
    return NextResponse.json(
      { error: "Generation failed", details: err.message },
      { status: 500 },
    );
  }
}
