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
  if (!apiKey) {
    throw new Error('API_KEY_MISSING');
  }

  const combinedPrompt = `${SYSTEM_PROMPT}\n\n위 지침에 따라 다음 내용을 분석하여 JSON으로만 응답해줘:\n${inputText || "첨부된 전단지 분석"}`;
  const parts = [{ text: combinedPrompt }];
  
  if (imageBase64) {
    const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
    parts.push({ inline_data: { mime_type: "image/jpeg", data: cleanBase64 } });
  }

  // 시도할 모델 목록 (안정성 높은 순서)
  const models = [
    'gemini-1.5-flash', 
    'gemini-1.5-flash-8b', 
    'gemini-1.5-pro',
    'gemini-2.0-flash-exp',
    'gemini-2.0-flash'
  ];
  
  let lastError = null;

  for (const modelId of models) {
    try {
      console.log(`Trying model: ${modelId}...`);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: { 
              temperature: 0.7, 
              maxOutputTokens: 8192
            }
          })
        }
      );

      const errData = await response.json();

      if (!response.ok) {
        const errMsg = errData.error?.message || 'API 호출 실패';
        console.warn(`Model ${modelId} failed: ${errMsg}`);
        
        // 모델을 찾을 수 없거나(not found) 할당량 문제(quota/limit)가 있으면 다음 모델 시도
        if (errMsg.toLowerCase().includes('not found') || 
            errMsg.toLowerCase().includes('quota') || 
            errMsg.toLowerCase().includes('limit')) {
          lastError = new Error(errMsg);
          continue;
        }
        
        throw new Error(errMsg);
      }

      const data = errData; // 위에서 이미 json()을 호출함
      if (!data.candidates || !data.candidates[0]) {
        throw new Error('응답 데이터를 생성하지 못했습니다.');
      }

      let raw = data.candidates[0].content.parts[0].text;
      raw = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      
      return JSON.parse(raw);
    } catch (error) {
      console.error(`Error with ${modelId}:`, error);
      lastError = error;
      // 모델 없음이나 할당량 오류가 아니면 즉시 중단
      if (!error.message.toLowerCase().includes('not found') && 
          !error.message.toLowerCase().includes('quota') && 
          !error.message.toLowerCase().includes('limit')) {
        break;
      }
    }
  }

  // 모든 모델이 실패한 경우
  throw new Error(`식단 생성 실패: ${lastError?.message || '지원되는 모델을 찾을 수 없습니다.'}\n\n도움말: API 키가 Google AI Studio에서 정상적으로 활성화되었는지, 혹은 무료 할당량이 남아있는지 확인해 주세요.`);
}
