const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 OpenRouter API KEY
const OPENROUTER_API_KEY = "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"; // 🔁 নিজেরটা বসা

// 🔥 MAIN API (WhatsAuto hit করবে)
app.all("/ai", async (req, res) => {

    console.log("FULL BODY:", req.body);
    console.log("FULL QUERY:", req.query);

    // 🔥 message detect (সব দিক থেকে)
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

    console.log("FINAL MESSAGE:", message);

    if (!message) {
        return res.json({
            reply: "msg pai nai ❌"
        });
    }

    try {

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-120b:free", // 🔥 same as your HTML
                messages: [
                    {
                        role: "system",
                        content: "You are a smart Bangla AI assistant."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ]
            })
        });

        const data = await response.json();

        console.log("AI RAW:", data);

        const reply =
            data?.choices?.[0]?.message?.content ||
            "AI reply paini ❌";

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

// test route
app.get("/", (req, res) => {
    res.send("OpenRouter AI Server Running 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
