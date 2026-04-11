app.post("/reply", (req, res) => {
    const message =
        req.body.message ||
        req.body.text ||
        req.body.msg ||
        "";

    let reply = "Bujhte pari nai 😅";

    if (message.toLowerCase().includes("hi")) {
        reply = "Hello! Kemon aso?";
    } 
    else if (message.toLowerCase().includes("price")) {
        reply = "Price 450 taka 💰";
    }

    res.json({
        reply: reply,
        message: reply
    });
});
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors()); // 👈 এটা must
app.use(express.json());
