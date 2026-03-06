/* ===== public/js/gemini.js ===== */

const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

async function generateMealPlan(flyerText, leftovers, specialRequests) {
    const apiKey = getApiKey();
    if (!apiKey) {
        alert('Gemini API 키가 설정되지 않았습니다. 설정 페이지로 이동합니다.');
        window.location.href = 'settings.html';
        return;
    }

    const prompt = `
        너는 영유아 맞춤 식단 전문가야.
        다음 정보를 바탕으로 7일치 이유식 식단을 JSON 형식으로 생성해줘.

        [전단지 내용]
        ${flyerText}

        [남은 재료]
        ${leftovers}

        [특이사항]
        ${specialRequests}

        [출력 형식]
        반드시 순수 JSON 객체만 출력해. 설명이나 추가 텍스트 없이, 전체 응답이 JSON이어야 해.
        { 
            "week_schedule": [
                { 
                    "day": "월", 
                    "lunch": { "main": "메뉴", "sides": ["반찬1", "반찬2"] },
                    "dinner": { "main": "메뉴", "sides": ["반찬1", "반찬2"] }
                }
            ]
        }
    `;

    try {
        const response = await fetch(`${API_ENDPOINT}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                "contents": [{ "parts": [{ "text": prompt }] }]
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return JSON.parse(data.candidates[0].content.parts[0].text);

    } catch (error) {
        console.error("Gemini API 호출 오류:", error);
        alert("식단 생성에 실패했습니다. 잠시 후 다시 시도해주세요.");
        return null; // or return sample data
    }
}
