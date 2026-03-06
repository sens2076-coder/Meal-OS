async function generateMealPlan(ocrText, inventory, notes) {
  const apiKey = Storage.getApiKey();
  if(!apiKey) { alert("API 키가 없습니다. 설정에서 등록해주세요."); return null; }
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
  const prompt = `시스템 역할: 영유아 맞춤 식단 전문가
입력: 전단지 OCR: ${ocrText} / 재고: ${inventory} / 특이사항: ${notes}
출력: JSON 형식으로 7일 식단 (SSOT 스키마 준수)`;
  try {
    const res = await fetch(endpoint, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({contents:[{parts:[{text:prompt}]}]})
    });
    if(!res.ok) throw new Error("API Fail");
    const data = await res.json();
    let text = data.candidates[0].content.parts[0].text;
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(text);
  } catch(e) { console.error(e); return null; }
}