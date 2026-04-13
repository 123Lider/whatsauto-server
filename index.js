const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
app.use(cors());
app.use(express.json());

// Firebase
const serviceAccount = require("./firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 🔥 MAIN API
app.post("/ai", async (req, res) => {

    const message = req.body.message;
    const apiKey = req.query.apiKey;

    console.log("API KEY:", apiKey); // 🔥 debug

    if (!apiKey) {
        return res.json({ reply: "API key missing ❌" });
    }

    try {
        const userSnap = await db.collection("users")
            .where("apiKey", "==", apiKey)
            .get();

        if (userSnap.empty) {
            return res.json({ reply: "Invalid API key ❌" });
        }

        const uid = userSnap.docs[0].id;

        const snap = await db.collection("training")
            .where("uid", "==", uid)
            .where("trigger", "==", message.toLowerCase())
            .get();

        if (!snap.empty) {
            return res.json({
                reply: snap.docs[0].data().response
            });
        }

        return res.json({
            reply: "AI bujhte pareni 😅"
        });

    } catch (e) {
        console.log(e);
        return res.json({
            reply: "Server error ❌"
        });
    }
});

app.get("/", (req, res) => {
    res.send("Server Running 🚀");
});

app.listen(3000, () => console.log("Running..."));
