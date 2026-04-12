const admin = require("firebase-admin");

// 🔥 add this top e
const serviceAccount = require("./firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 🔥 replace your reply logic
app.post("/ai", async (req, res) => {

    const message = req.body.message;
    const apiKey = req.headers.apikey; // 👈 header থেকে নিচ্ছে

    // API key check
    const userSnap = await db.collection("users")
        .where("apiKey", "==", apiKey)
        .get();

    if (userSnap.empty) {
        return res.json({ reply: "Invalid API key ❌" });
    }

    const uid = userSnap.docs[0].id;

    // training check
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
});
