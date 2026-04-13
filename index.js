const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 Firebase Admin Setup
const serviceAccount = require("./firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 🔥 👉 এখানে তোর AI app এর API key বসা
const DEFAULT_API_KEY = "sk-KQ936GT78"; // ⚠️ নিজেরটা বসা

// 🔥 MAIN API (WhatsAuto use করবে)
app.post("/ai", async (req, res) => {

    try {
       const message =
    req.body.message ||
    req.body.text ||
    req.body.msg ||
    "";

console.log("Incoming:", req.body);

if (!message) {
    return res.json({
        reply: "Message pai nai ❌"
    });
}

        // 🔥 API key (fixed)
        const apiKey = sk-KQ936GT78;

        // 🔍 user find
        const userSnap = await db.collection("users")
            .where("apiKey", "==", apiKey)
            .get();

        if (userSnap.empty) {
            return res.json({ reply: "Invalid API key ❌" });
        }

        const uid = userSnap.docs[0].id;

        console.log("User UID:", uid);

        // 🧠 training check
        const snap = await db.collection("training")
            .where("uid", "==", uid)
            .where("trigger", "==", message.toLowerCase())
            .get();

        if (!snap.empty) {
            const replyText = snap.docs[0].data().response;

            console.log("Matched reply:", replyText);

            return res.json({
                reply: replyText
            });
        }

        // 🤖 fallback reply
        return res.json({
            reply: "AI bujhte pareni 😅"
        });

    } catch (error) {
        console.log("Error:", error);
        return res.json({
            reply: "Server error ❌"
        });
    }
});

// 🌐 Test route
app.get("/", (req, res) => {
    res.send("AI Server Running 🚀");
});

// 🔥 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
