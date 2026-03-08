/* functions/api/getTarotReading.js */

export async function onRequest(context) {
    // 1. POST 요청만 허용
    if (context.request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const { userQuery, selectedCards, mode } = await context.request.json();
        const apiKey = context.env.GEMINI_API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({ 
                error: "API Key is missing. Please set GEMINI_API_KEY in Cloudflare dashboard." 
            }), { status: 500, headers: { "Content-Type": "application/json" } });
        }

        // 2. SSOT 데이터 주입 (마크다운 기반)
        const tarotDb = `
            # 🃏 메이저 아르카나 (Major Arcana)
            0: 바보 (The Fool) - 시작, 순수, 모험
            1: 마법사 (The Magician) - 능력, 창의성
            2: 고위 여사제 (The High Priestess) - 직관, 지혜
            3: 여황제 (The Empress) - 풍요, 성장
            4: 황제 (The Emperor) - 책임감, 안정
            5: 교황 (The Hierophant) - 조언, 신뢰
            6: 연인 (The Lovers) - 선택, 조화
            7: 전차 (The Chariot) - 전진, 승리
            8: 힘 (The Strength) - 인내, 통제
            9: 은둔자 (The Hermit) - 성찰, 탐구
            10: 운명의 수레바퀴 - 변화, 기회
            11: 정의 (The Justice) - 균형, 공정
            12: 매달린 사람 - 인내, 전환
            13: 죽음 (The Death) - 끝과 시작
            14: 절제 (The Temperance) - 조화, 소통
            15: 악마 (The Devil) - 유혹, 집착
            16: 탑 (The Tower) - 갑작스런 변화
            17: 별 (The Star) - 희망, 치유
            18: 달 (The Moon) - 불안, 직관
            19: 태양 (The Sun) - 성공, 활력
            20: 심판 (The Judgement) - 부활, 결정
            21: 세계 (The World) - 완성, 통합
        `;

        const aiPersona = "당신은 다정하고 친근한 타로 점성술사 '루나'입니다. 동네 단골 카페 사장님처럼 따뜻하게 조언해주세요. 전문 용어 대신 일상적인 비유를 사용하세요. 응답은 '공감 인사 -> 카드 해석 -> 구체적인 조언 -> 응원 멘트' 순서로 작성합니다.";

        // 3. Gemini API 호출
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
        
        const prompt = `
            페르소나: ${aiPersona}
            타로 데이터: ${tarotDb}
            ---
            사용자 고민: "${userQuery}"
            뽑은 카드: [${selectedCards.join(", ")}]
            모드: ${mode === 'premium' ? '심층 10장 해석' : '3장 흐름 해석'}
            
            위 정보를 바탕으로 따뜻하고 정성스러운 타로 해석을 한국어로 작성해 주세요.
        `;

        const geminiResponse = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await geminiResponse.json();
        const reading = data.candidates[0].content.parts[0].text;

        return new Response(JSON.stringify({ reading }), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
