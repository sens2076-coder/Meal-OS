/* backend/index.js */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { generateTarotReading } = require("./gemini_service");

admin.initializeApp();

// HTTP 요청을 처리하는 Firebase Function
exports.getTarotReading = functions.https.onRequest(async (req, res) => {
    // CORS 설정
    res.set("Access-Control-Allow-Origin", "*");
    if (req.method === "OPTIONS") {
        res.set("Access-Control-Allow-Methods", "POST");
        res.set("Access-Control-Allow-Headers", "Content-Type");
        res.set("Access-Control-Max-Age", "3600");
        res.status(204).send("");
        return;
    }

    if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
    }

    const { userQuery, selectedCards } = req.body;

    if (!userQuery || !selectedCards) {
        res.status(400).send("Bad Request: 고민과 카드를 제공해 주세요.");
        return;
    }

    try {
        const reading = await generateTarotReading(userQuery, selectedCards);
        res.status(200).json({ reading });
    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).send("Internal Server Error");
    }
});
