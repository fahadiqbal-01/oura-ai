// check-api.js
const testApi = async () => {
  const apiKey = "AIzaSyCWKlGDSowkYv7HaMcw7dL3d_95sojd30c";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Say 'The API is working!'" }] }],
      }),
    });

    const data = await response.json();
    console.log("--- RESPONSE FROM GOOGLE ---");
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("--- CONNECTION ERROR ---");
    console.error(err.message);
  }
};

testApi();
