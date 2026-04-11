app.post("/reply", (req, res) => {
    console.log("Incoming Data:", JSON.stringify(req.body, null, 2));

    // সব possible জায়গা থেকে message বের করা
    let message = "";

    if (typeof req.body === "string") {
        message = req.body;
    } else {
        message =
            req.body.message ||
            req.body.text ||
            req.body.msg ||
            req.body.query ||
            req.body.body ||
            req.body.content ||
            (req.body.data && req.body.data.message) ||
            "";
    }

    message = message.toLowerCase();

    let reply = "Bujhte pari nai 😅";

    if (message.includes("hi")) {
        reply = "Hello! Kemon aso?";
    } 
    else if (message.includes("price")) {
        reply = "Price 450 taka 💰";
    } 
    else if (message.includes("order")) {
        reply = "Order korte WhatsApp korun 📞";
    }

    res.json({
        reply: reply,
        message: reply
    });
});
