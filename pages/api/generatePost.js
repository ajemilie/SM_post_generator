export const config = {
  api: {
    bodyParser: { sizeLimit: '4mb' }, // så du kan uploade billeder op til 4MB
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Kun POST er tilladt' });
  }

  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: 'Billede mangler' });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Du er en hjælpsom social media tekst-generator. Beskriv billedet, så det lyder som en god post til Facebook eller Instagram, gerne med emojis."
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Lav en kort, fængende social media tekst, der passer til billedet. Brug emojis." },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
        max_tokens: 70,
        temperature: 0.8
      })
    });

    const data = await openaiRes.json();

    const message = data.choices?.[0]?.message?.content || "Ingen tekst genereret.";

    res.status(200).json({ text: message });
  } catch (err) {
    res.status(500).json({ error: 'Fejl ved OpenAI API', details: err.message });
  }
}
