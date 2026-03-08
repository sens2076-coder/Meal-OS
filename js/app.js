/* js/app.js */

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const inputSection = document.getElementById('input-section');
    const tarotTable = document.getElementById('tarot-table');
    const userQuery = document.getElementById('user-query');
    const responseContainer = document.getElementById('ai-response');
    const responseText = document.getElementById('response-text');
    const selectedCardsDiv = document.getElementById('selected-cards');

    // 메이저 아르카나 카드 목록 (0~21)
    const majorArcana = [
        "바보 (The Fool)", "마법사 (The Magician)", "고위 여사제 (The High Priestess)",
        "여황제 (The Empress)", "황제 (The Emperor)", "교황 (The Hierophant)",
        "연인 (The Lovers)", "전차 (The Chariot)", "힘 (The Strength)",
        "은둔자 (The Hermit)", "운명의 수레바퀴 (Wheel of Fortune)", "정의 (The Justice)",
        "매달린 사람 (The Hanged Man)", "죽음 (Death)", "절제 (Temperance)",
        "악마 (The Devil)", "탑 (The Tower)", "별 (The Star)",
        "달 (The Moon)", "태양 (The Sun)", "심판 (Judgement)", "세계 (The World)"
    ];

    startBtn.addEventListener('click', async () => {
        const query = userQuery.value.trim();
        if (!query) {
            alert("고민을 먼저 말씀해 주세요, 당신의 이야기를 듣고 싶어요. ✨");
            return;
        }

        // UI 전환 애니메이션
        inputSection.classList.add('hidden');
        tarotTable.classList.remove('hidden');
        tarotTable.classList.add('fade-in');

        // 카드 1장 랜덤 뽑기
        const randomIndex = Math.floor(Math.random() * majorArcana.length);
        const drawnCard = majorArcana[randomIndex];

        selectedCardsDiv.innerHTML = `
            <div class="drawn-card fade-in">
                <div class="card-name">${drawnCard}</div>
                <p>당신이 뽑은 운명의 카드입니다.</p>
            </div>
        `;

        responseContainer.classList.remove('hidden');
        responseText.innerHTML = '';

        // 실제 백엔드 API 호출 (로컬 테스트 시 http://127.0.0.1:5001/... 등으로 변경)
        // MVP 배포를 위해 임시로 시뮬레이션 응답 또는 Fetch 뼈대를 둡니다.
        try {
            // 배포된 Firebase Functions URL로 교체해야 합니다.
            // const apiUrl = "YOUR_FIREBASE_FUNCTION_URL";
            
            // MVP용 임시 시뮬레이션 (API 연동 전 화면 확인용)
            setTimeout(() => {
                document.querySelector('.loading-spinner').style.display = 'none';
                responseText.innerHTML = `
                    <div class="result-message fade-in">
                        <h3>"별들이 당신의 이야기를 속삭이고 있어요..."</h3>
                        <p>당신의 고민 <strong>'${query}'</strong>에 대해, <strong>[${drawnCard}]</strong> 카드가 나왔네요.</p>
                        <p>이 카드는 새로운 시작과 가능성을 의미해요. 루나가 드리는 조언은, 오늘 따뜻한 차 한 잔과 함께 가벼운 산책을 해보는 거예요. ✨</p>
                        <br><small>(* 현재 MVP 버전입니다. 실제 AI 연결은 Firebase 세팅 후 작동합니다.)</small>
                    </div>
                `;
            }, 2500);

            /* 실제 API 호출 코드 (주석 처리)
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userQuery: query, selectedCards: [drawnCard] })
            });
            const data = await response.json();
            responseText.innerHTML = `<div class="result-message fade-in">${data.reading}</div>`;
            */

        } catch (error) {
            responseText.innerHTML = "<p>죄송해요, 별들의 연결이 잠시 끊어졌어요. 다시 시도해주세요. 🔮</p>";
        }
    });
});
