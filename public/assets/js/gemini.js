const SYSTEM_PROMPT = `너는 영유아 맞춤 식단 전문가 AI야.
사용자가 마트 전단지 이미지나 재료 텍스트를 입력하면
아래 JSON 형식으로만 응답해야 해. 설명 없이 순수 JSON만 출력해.

응답 JSON 구조:
{
  "week_summary": "이번 주 식단 한줄 요약",
  "meal_plan": [
    {
      "day": "월",
      "lunch": { "main": "메뉴명", "sides": ["반찬1","반찬2","반찬3"], "thaw_alert": true/false },
      "dinner": { "main": "메뉴명", "sides": ["반찬1","반찬2","반찬3"], "badges": ["선호메뉴","생선","이유식큐브"] }
    }
  ],
  "shopping_list": [
    { "category": "육류", "item": "소고기 국거리", "qty": "500g", "usage": "뭇국", "sale": false, "baby_cube": false }
  ],
  "recipes": [
    {
      "name": "소고기 뭇국",
      "tags": ["소고기","냉동O"],
      "ingredients_child": ["소고기 50g", "무 30g"],
      "ingredients_adult": ["소고기 175g×2", "무 100g"],
      "steps": ["1. ...", "2. ...", "3. ..."],
      "baby_cube_tip": "간 넣기 전 무+육수 30ml 분리",
      "storage": "냉동 2주"
    }
  ],
  "nutrition": {
    "protein":  { "achieved": 85, "target": 100, "status": "good" },
    "iron":     { "achieved": 72, "target": 100, "status": "warning" },
    "calcium":  { "achieved": 91, "target": 100, "status": "good" },
    "zinc":     { "achieved": 68, "target": 100, "status": "warning" },
    "vitaminA": { "achieved": 95, "target": 100, "status": "good" },
    "vitaminC": { "achieved": 88, "target": 100, "status": "good" },
    "omega3":   { "achieved": 77, "target": 100, "status": "caution" }
  },
  "smart_backup": [
    { "situation": "소고기 거부", "action": "국물이라도 먹이기", "supplement": "치즈 1장 + 두유 100ml" }
  ],
  "thaw_schedule": [
    { "day": "월", "thaw_day": "일", "time": "22:00", "item": "소고기 뭇국" }
  ]
}`;

async function generateMealPlan(inputText, imageBase64 = null) {
  const apiKey = Storage.getApiKey();
  if (!apiKey) throw new Error('API_KEY_MISSING');

  const combinedPrompt = `${SYSTEM_PROMPT}\n\n분석할 내용:\n${inputText || "첨부된 전단지 이미지"}`;
  
  const contents = [{
    parts: [{ text: combinedPrompt }]
  }];
  
  if (imageBase64) {
    const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
    contents[0].parts.push({
      inline_data: { mime_type: "image/jpeg", data: cleanBase64 }
    });
  }

  try {
    // v1beta 버전과 gemini-1.5-flash 모델의 조합이 가장 안정적입니다.
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const msg = data.error?.message || 'API 호출 실패';
      
      // 할당량(limit: 0) 오류 발생 시 상세 안내
      if (msg.toLowerCase().includes('limit') || msg.toLowerCase().includes('quota')) {
        throw new Error(`
          [할당량 오류] 현재 API 키의 사용 한도가 0입니다.
          해결 방법:
          1. aistudio.google.com 에 접속하여 로그아웃 후 다시 로그인해 보세요.
          2. 새로운 프로젝트를 생성하여 '새 API 키'를 발급받으세요.
          3. 혹은 텍스트로만(이미지 없이) 식단을 만들어 보세요.
        `);
      }
      throw new Error(msg);
    }

    if (!data.candidates || !data.candidates[0]) throw new Error('AI 응답이 생성되지 않았습니다.');
    
    let raw = data.candidates[0].content.parts[0].text;
    raw = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(raw);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}
