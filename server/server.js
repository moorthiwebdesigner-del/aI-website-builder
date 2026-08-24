const express = require("express");
const cors = require("cors");
require("dotenv").config();

const Groq = require("groq-sdk");

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.get("/", (req, res) => {
  res.send("AI Website Builder API is running!");
});

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required",
      });
    }

    const instruction = `
Create professional website content based on this request:

${prompt}

Return ONLY valid JSON.

Do not use markdown.
Do not use code fences.

Use exactly this structure:

{
  "title": "",
  "tagline": "",
  "hero": {
    "heading": "",
    "description": "",
    "button": ""
  },
  "about": {
    "title": "",
    "description": ""
  },
  "services": [
    {
      "title": "",
      "description": ""
    },
    {
      "title": "",
      "description": ""
    },
    {
      "title": "",
      "description": ""
    }
  ],
  "cta": {
    "heading": "",
    "description": "",
    "button": ""
  },
  "seo": {
    "title": "",
    "description": ""
  }
}
`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: instruction,
        },
      ],
      model: "openai/gpt-oss-20b",
      temperature: 0.7,
    });

    const text = completion.choices[0].message.content;

    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const website = JSON.parse(cleanText);

    res.json(website);

  } catch (error) {
    console.error("AI Error:", error);

    res.status(500).json({
      error: "AI generation failed",
      message: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});