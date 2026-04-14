const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 👉 OpenRouter API key বসা
const OPENROUTER_API_KEY = "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"; // 👈 নিজেরটা বসা

app.all("/ai", async (req, res) => {

    // 🔍 message detect (body + query)
    const message =
        req.body?.message ||
        req.body?.msg ||
        req.body?.text ||
        req.query?.message ||
        req.query?.msg ||
        req.query?.text ||
        "";

    console.log("MESSAGE:", message);

    if (!message) {
        return res.json({
            reply: "Message pai nai ❌"
        });
    }

    try {
        const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-120:free",
                messages: [
                    {
                        role: "system",
                        content: "You are a smart Bangla AI assistant. Reply short and natural."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ]
            })
        });

        const data = await aiRes.json();

        const reply =
            data?.choices?.[0]?.message?.content ||
            "AI reply dite pareni ❌";

        return res.json({
            reply: reply
        });

    } catch (err) {
        console.log("ERROR:", err);
        return res.json({
            reply: "Server error ❌"
        });
    }
});

// 🌐 test
app.get("/", (req, res) => {
    res.send("GPT Server Running 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on port", PORT));
