import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Initialize with the API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req) {
  try {
    const body = await req.json();
    const { brandName, industry, vibes, audience } = body;

    if (!brandName) {
      return new Response(JSON.stringify({ error: "Brand name is required" }), {
        status: 400,
      });
    }

    // 2. STABLE ENDPOINT FIX: Use apiVersion: "v1"
    // This helps bypass some of the 'v1beta' fetch errors you were seeing
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      apiVersion: "v1",
    });

    const prompt = `You are a premium brand designer. 
    Generate a brand identity for:
    Name: ${brandName}
    Industry: ${industry}
    Vibes: ${vibes?.join(", ") || "Minimalist"}
    Audience: ${audience}

    Respond ONLY with a raw JSON object. 
    Ensure "fontPairing" uses actual Google Font names (e.g., "Playfair Display", "Inter").
    {
      "tagline": "...",
      "colorPalette": ["#hex1", "#hex2", "#hex3", "#hex4"],
      "fontPairing": { "heading": "Google Font Name", "body": "Google Font Name" },
      "logoLetter": "${brandName.charAt(0).toUpperCase()}",
      "brandPersonality": "..."
    }`;

    // 3. GENERATION
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. ROBUST JSON CLEANER[cite: 1]
    const startIdx = text.indexOf("{");
    const endIdx = text.lastIndexOf("}");

    if (startIdx === -1 || endIdx === -1) {
      throw new Error("AI did not return valid JSON structure");
    }

    const jsonString = text.substring(startIdx, endIdx + 1);
    const brandData = JSON.parse(jsonString);

    return new Response(JSON.stringify(brandData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("CRITICAL API ERROR:", err.message);

    // This details return helps you see the exact error in your browser network tab[cite: 1]
    return new Response(
      JSON.stringify({ error: "Generation failed", details: err.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
