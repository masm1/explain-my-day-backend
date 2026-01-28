const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/explain-day", async (req, res) => {
  try {
    const userText = req.body.text;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "user", content: `Explain my day: ${userText}` }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://example.com",
          "X-Title": "ExplainMyDay"
        }
      }
    );

    res.json({
      result: response.data.choices[0].message.content
    });
  } catch (error) {
    res.status(500).json({ error: "AI request failed" });
  }
});

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
