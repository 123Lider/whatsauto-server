const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 OpenRouter API KEY (নিজেরটা বসা)
const API_KEY = "sk-or-v1-XXXXXXXXXXXX";

// 🔥 MAIN AI ROUTE
app.all("/ai", async (req, res) => {

    console.log("==== NEW REQUEST ====");
    console.log("BODY:", req.body);
    console.log("QUERY:", req.query);

    // 🔥 message detect (সব case handle)
    let text = "";

    if (req.body) {
        text =
            req.body.message ||
            req.body.msg ||
            req.body.text ||
            req.body.body ||
            "";
    }

    if (!text && req.query) {
        text =
            req.query.message ||
            req.query.msg ||
            req.query.text ||
            req.query.body ||
            "";
    }

    text = text.toString().trim();

    console.log("FINAL TEXT:", text);

    // ❌ যদি message না আসে
    if (!text) {
        return res.json({
            reply: "msg pai nai ❌"
        });
    }

    try {
        // 🔥 OpenRouter call (same system)
        const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo", // 🔥 stable model
                messages: [
                    {
                        role: "system",
                        content: "You are a smart Bangla AI assistant. Reply short and natural."
                    },
                    {
                        role: "user",
                        content: text
                    }
                ]
            })
        });

        const data = await aiRes.json();

        console.log("AI RESPONSE:", JSON.stringify(data, null, 2));

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

// 🔥 TEST ROUTE
app.get("/", (req, res) => {
    res.send("Server Running 🚀");
});

// 🔥 START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
