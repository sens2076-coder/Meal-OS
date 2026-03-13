const SYSTEM_PROMPT = `너는 영유아 맞춤 식단 전문가 AI야.
사용자가 마트 전단지 이미지나 재료 텍스트를 입력하면
우리 아이(영유아)를 위한 최적의 식단 정보만 JSON 형식으로 응답해야 해.
설명 없이 순수 JSON만 출력해.

응답 JSON 구조:
{
  "week_summary": "이번 주 아이 식단 한줄 요약",
  "meal_plan": [
    {
      "day": "월",
      "lunch": { "main": "메뉴명", "sides": ["반찬1","반찬2"], "thaw_alert": true/false },
      "dinner": { "main": "메뉴명", "sides": ["반찬1","반찬2"], "badges": ["선호메뉴","생선","이유식큐브"] }
    }
  ],
  "shopping_list": [
    { "category": "육류", "item": "소고기 안심", "qty": "150g", "usage": "소고기 뭇국", "sale": false, "baby_cube": true }
  ],
  "recipes": [
    {
      "name": "소고기 뭇국",
      "tags": ["소고기","냉동O"],
      "ingredients": ["소고기 50g", "무 30g", "채수 150ml"],
      "steps": ["1. ...", "2. ...", "3. ..."],
      "baby_cube_tip": "무와 소고기를 5mm 크기로 다져주세요",
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
    { "situation": "식재료 거부 시", "action": "작게 다져서 볶음밥으로 활용", "supplement": "치즈 1장" }
  ],
  "thaw_schedule": [
    { "day": "월", "thaw_day": "일", "time": "22:00", "item": "소고기 뭇국" }
  ]
}`;

async function generateMealPlan(inputText, imageBase64 = null) {
  let apiKey = Storage.getApiKey();
  if (!apiKey) throw new Error('API_KEY_MISSING');
  apiKey = apiKey.trim();

  const combinedPrompt = `${SYSTEM_PROMPT}\n\n분석할 내용:\n${inputText || "첨부된 전단지 이미지"}`;
  const contents = [{ parts: [{ text: combinedPrompt }] }];
  
  if (imageBase64) {
    const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
    contents[0].parts.push({ inline_data: { mime_type: "image/jpeg", data: cleanBase64 } });
  }

  // 1. 할당량이 확인된 최신 모델 목록 (2026년 기준)
  const preferredModels = [
    'gemini-3.1-flash-lite',
    'gemini-2.5-flash',
    'gemini-1.5-flash'
  ];

  let targetModel = preferredModels[0];

  // 자동 탐색 로직 강화
  try {
    const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (listResponse.ok) {
      const listData = await listResponse.json();
      const availableModels = listData.models || [];
      
      // 우선순위 목록에 있는 모델 중 실제 사용 가능한 모델 찾기
      const found = preferredModels.find(pref => 
        availableModels.some(m => m.name.endsWith(pref) && m.supportedGenerationMethods.includes('generateContent'))
      );
      
      if (found) {
        targetModel = found;
      } else {
        // 우선순위에 없더라도 generateContent가 가능한 아무 모델이나 선택
        const anyFlash = availableModels.find(m => 
          m.name.includes('flash') && m.supportedGenerationMethods.includes('generateContent')
        );
        if (anyFlash) targetModel = anyFlash.name.split('/').pop();
      }
      console.log(`Selected model: ${targetModel}`);
    }
  } catch (e) {
    console.warn('Model discovery failed, using default.');
  }

  // 2. 식단 생성 요청
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const msg = data.error?.message || 'API 호출 실패';
      if (msg.toLowerCase().includes('limit') || msg.toLowerCase().includes('quota')) {
        throw new Error(`[할당량 오류] ${targetModel} 모델의 한도가 부족합니다. (현재 한도: 0)\n다른 모델로 변경하거나 나중에 다시 시도해 주세요.`);
      }
      throw new Error(msg);
    }

    if (!data.candidates || !data.candidates[0]) throw new Error('AI 응답 생성 실패');
    
    let raw = data.candidates[0].content.parts[0].text;
    raw = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(raw);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}
