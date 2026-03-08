/* backend/gemini_service.js */
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

// Gemini API 설정 (실제 배포 시 환경 변수에서 가져와야 함)
const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY"); 

/**
 * SSOT 마크다운 데이터를 읽어오는 함수
 */
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

/**
 * 타로 해석 결과를 생성하는 메인 로직
 */
async function generateTarotReading(userQuery, selectedCards) {
    const { tarotDb, aiPersona } = getSSOTData();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // 프롬프트 조립 (SSOT 결합)
    const prompt = `
        ${aiPersona}

        다음은 타로 카드 데이터베이스 정보입니다:
        ${tarotDb}

        ---
        사용자의 고민: "${userQuery}"
        사용자가 뽑은 카드: [${selectedCards.join(", ")}]

        루나의 페르소나를 유지하면서, 위 카드들의 상징과 의미를 바탕으로 따뜻하고 정성스러운 타로 해석을 작성해 주세요.
        응답은 반드시 한국어로 작성해 주세요.
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
