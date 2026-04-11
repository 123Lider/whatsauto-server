const express = require("express");
const app = express();

app.use(express.json());

app.post("/reply", (req, res) => {
    const message = req.body.message;

    let reply = "Bujhte pari nai 😅";

    if (message.toLowerCase().includes("hi")) {
        reply = "Hello! Kemon aso?";
    } 
    else if (message.toLowerCase().includes("price")) {
        reply = "Price 450 taka 💰";
    }

    res.json({ reply });
});

app.get("/", (req, res) => {
    res.send("Server running 🚀");
});

app.listen(3000, () => {
    console.log("Running...");
});
