/* backend/gemini_service.js */
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

// 환경변수에서 API 키를 가져옵니다. (MVP용 임시 방어 코드 추가)
const apiKey = process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY";
const genAI = new GoogleGenerativeAI(apiKey); 

function getSSOTData() {
    try {
        const tarotDb = fs.readFileSync(path.join(__dirname, "../data/tarot_db.md"), "utf8");
        const aiPersona = fs.readFileSync(path.join(__dirname, "../data/ai_persona.md"), "utf8");
        return { tarotDb, aiPersona };
    } catch (error) {
        console.error("데이터 파일을 읽는 중 오류가 발생했습니다:", error);
        return { tarotDb: "", aiPersona: "" };
    }
}

async function generateTarotReading(userQuery, selectedCards) {
    if (apiKey === "YOUR_GEMINI_API_KEY") {
        return "✨ (MVP 모드) 현재 AI API 키가 설정되지 않았습니다. 백엔드에서 마크다운 파싱은 정상적으로 이루어지고 있습니다. 뽑으신 카드는 [" + selectedCards.join(", ") + "] 입니다.";
    }

    const { tarotDb, aiPersona } = getSSOTData();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
        ${aiPersona}

        다음은 타로 카드 데이터베이스 정보입니다:
        ${tarotDb}

        ---
        사용자의 고민: "${userQuery}"
        사용자가 뽑은 카드: [${selectedCards.join(", ")}]

        루나의 페르소나를 유지하면서, 위 카드들의 상징과 의미를 바탕으로 따뜻하고 정성스러운 타로 해석을 작성해 주세요.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini API 호출 중 오류가 발생했습니다:", error);
        return "죄송해요, 별들이 잠시 구름에 가려졌나 봐요. 잠시 후에 다시 시도해 주시겠어요? ✨";
    }
}

module.exports = { generateTarotReading };
