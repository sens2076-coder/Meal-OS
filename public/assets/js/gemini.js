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

  const combinedPrompt = `${SYSTEM_PROMPT}\n\n분석 대상:\n${inputText || "첨부된 이미지 분석"}`;
  const contents = [{
    parts: [{ text: combinedPrompt }]
  }];
  
  if (imageBase64) {
    const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
    contents[0].parts.push({
      inline_data: { mime_type: "image/jpeg", data: cleanBase64 }
    });
  }

  // 가장 안정적인 모델 목록
  const models = ['gemini-1.5-flash', 'gemini-1.5-pro'];
  let lastError = null;

  for (const modelId of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${modelId}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const msg = data.error?.message || 'API Error';
        if (msg.includes('quota') || msg.includes('limit') || msg.includes('not found')) {
          lastError = new Error(msg);
          continue; // 다음 모델로 시도
        }
        throw new Error(msg);
      }

      if (!data.candidates || !data.candidates[0]) throw new Error('응답 데이터 없음');
      
      let raw = data.candidates[0].content.parts[0].text;
      raw = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(raw);
    } catch (e) {
      lastError = e;
      if (!e.message.includes('quota') && !e.message.includes('limit')) break;
    }
  }

  // 할당량 오류(limit: 0)에 대한 특수 처리
  if (lastError?.message.includes('limit') || lastError?.message.includes('quota')) {
    throw new Error(`
      API 할당량 초과 (한도 0). 
      조치 방법: 
      1. Google AI Studio(aistudio.google.com)에서 새로운 API 키를 발급받으세요.
      2. 'Pay-as-you-go'가 아닌 무료 티어가 정상 활성화되었는지 확인하세요.
      3. 이미지를 제외하고 텍스트로만 시도해 보세요.
    `);
  }

  throw lastError;
}
