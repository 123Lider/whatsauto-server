const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 MAIN ROUTE
app.all("/ai", async (req, res) => {

    console.log("BODY:", req.body);
    console.log("QUERY:", req.query);

    // 🔍 message detect (WhatsAuto সব case cover)
    const text =
        req.body?.message ||
        req.body?.msg ||
        req.body?.text ||
        req.body?.body ||
        req.query?.message ||
        req.query?.msg ||
        req.query?.text ||
        req.query?.body ||
        "";

    console.log("FINAL TEXT:", text);

    if (!text) {
        return res.json({
            reply: "msg pai nai ❌"
        });
    }

    try {

        // 🔥 EXACT same OpenRouter call (তোর HTML এর মতো)
        const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer sk-or-v1-XXXXXXXXXXXX", // 👈 নিজের key বসা
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-120b:free", // 👈 same model
                messages: [
                    {
                        role: "system",
                        content: "You are a smart Bangla AI assistant."
                    },
                    {
                        role: "user",
                        content: text
                    }
                ]
            })
        });

        const data = await aiRes.json();

        console.log("AI DATA:", data);

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

// test
app.get("/", (req, res) => {
    res.send("OpenRouter Server Running 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on", PORT));
