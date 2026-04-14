const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 👉 OpenRouter API key (নিজেরটা বসা)
const OPENROUTER_API_KEY = "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";

// 🔥 MAIN AI ROUTE (WhatsAuto use করবে)
app.all("/ai", async (req, res) => {

    // 🔍 message detect (body + query সব)
    const message =
        req.body?.message ||
        req.body?.msg ||
        req.body?.text ||
        req.body?.body ||
        req.query?.message ||
        req.query?.msg ||
        req.query?.text ||
        req.query?.body ||
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
                model: "openai/gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a smart Bangla AI assistant. Reply short, natural, and friendly."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ]
            })
        });

        const data = await aiRes.json();

        console.log("AI RESPONSE:", data);

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

// 🌐 test route
app.get("/", (req, res) => {
    res.send("GPT AI Server Running 🚀");
});

// 🔥 server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
