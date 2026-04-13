const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 Firebase setup
const serviceAccount = require("./firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 🔥 👉 তোর API key
const DEFAULT_API_KEY = "sk-KQ936GT78";

// 🔥 MAIN API
app.post("/ai", async (req, res) => {

    console.log("FULL BODY:", JSON.stringify(req.body, null, 2));

    // 🔥 message detect (সব possible field)
    const message =
        req.body.message ||
        req.body.msg ||
        req.body.text ||
        req.body.body ||
        req.body.content ||
        "";

    console.log("MESSAGE:", message);

    if (!message) {
        return res.json({
            reply: "msg pai nai ❌"
        });
    }

    try {
        const apiKey = DEFAULT_API_KEY;

        // 🔍 user find
        const userSnap = await db.collection("users")
            .where("apiKey", "==", apiKey)
            .get();

        if (userSnap.empty) {
            return res.json({ reply: "Invalid API key ❌" });
        }

        const uid = userSnap.docs[0].id;

        console.log("USER UID:", uid);

        // 🧠 training match
        const snap = await db.collection("training")
            .where("uid", "==", uid)
            .where("trigger", "==", message.toLowerCase())
            .get();

        if (!snap.empty) {
            const replyText = snap.docs[0].data().response;

            console.log("REPLY:", replyText);

            return res.json({
                reply: replyText
            });
        }

        return res.json({
            reply: "AI bujhte pareni 😅"
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
    res.send("Server Running 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on port", PORT));
