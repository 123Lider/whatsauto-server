const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
app.use(cors());
app.use(express.json());

// Firebase Admin (service account লাগবে)
const serviceAccount = require("./firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 🔥 MAIN AI ROUTE
app.post("/ai", async (req, res) => {

    const { message, apiKey } = req.body;

    if (!apiKey) {
        return res.json({ reply: "API key missing ❌" });
    }

    // 🔍 1. verify API key
    const userSnap = await db.collection("users")
        .where("apiKey", "==", apiKey)
        .get();

    if (userSnap.empty) {
        return res.json({ reply: "Invalid API key ❌" });
    }

    const user = userSnap.docs[0].data();
    const uid = userSnap.docs[0].id;

    // 🧠 2. check training data
    const trainSnap = await db.collection("training")
        .where("uid", "==", uid)
        .where("trigger", "==", message.toLowerCase())
        .get();

    if (!trainSnap.empty) {
        const reply = trainSnap.docs[0].data().response;
        return res.json({ reply });
    }

    // 🤖 3. default AI fallback
    return res.json({
        reply: "AI: " + message
    });
});

// 🌐 test route
app.get("/", (req, res) => {
    res.send("WhatsAuto AI Server Running 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on " + PORT));
