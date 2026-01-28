const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/explain-day", async (req, res) => {
  try {
    const userText = req.body.text;

    if (!userText) {
      return res.status(400).json({
        result: "No input text provided"
      });
    }

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

    const aiText =
      response.data?.choices?.[0]?.message?.content;

    if (!aiText) {
      return res.status(500).json({
        result: "AI returned no text"
      });
    }

    res.json({
      result: aiText.trim()
    });

  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      result: "AI request failed on server"
    });
  }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

