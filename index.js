const express = require("express");
const cors = require("cors");

const app = express();

// middleware
app.use(cors({
    origin: "*"
}));
app.use(express.json());

// test route
app.get("/", (req, res) => {
    res.send("Server running 🚀");
});

// main reply route
app.post("/reply", (req, res) => {
    console.log("Incoming Data:", req.body);

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
    else if (message.toLowerCase().includes("order")) {
        reply = "Order korte WhatsApp korun 📞";
    }

    res.json({
        reply: reply,
        message: reply
    });
});

// port fix (Render compatible)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
