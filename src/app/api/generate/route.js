import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { brandName, industry, vibes, audience } = await req.json();

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a high-end brand identity designer. 
    Generate a brand identity for:
    Name: ${brandName}
    Industry: ${industry}
    Vibes: ${vibes.join(", ")}
    Audience: ${audience}

    Respond ONLY with valid JSON, no markdown backticks, no explanation:
    {
      "tagline": "...",
      "colorPalette": ["#hex1", "#hex2", "#hex3", "#hex4"],
      "fontPairing": { "heading": "Google Font Name", "body": "Google Font Name" },
      "logoLetter": "${brandName.charAt(0)}",
      "brandPersonality": "..."
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Gemini sometimes wraps JSON in markdown blocks even when told not to.
    // This helper cleans it up.
    const cleanJson = text.replace(/```json|```/g, "").trim();
    const brandData = JSON.parse(cleanJson);

    return new Response(JSON.stringify(brandData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Gemini API Error:", err);
    return new Response(JSON.stringify({ error: "Generation failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
