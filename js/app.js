/* js/app.js */

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const inputSection = document.getElementById('input-section');
    const tarotTable = document.getElementById('tarot-table');
    const userQuery = document.getElementById('user-query');
    const responseContainer = document.getElementById('ai-response');
    const responseText = document.getElementById('response-text');
    const selectedCardsDiv = document.getElementById('selected-cards');

    // 메이저 아르카나 카드 정보 (이름과 이미지 매칭)
    const majorArcana = [
        { name: "바보 (The Fool)", img: "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg" },
        { name: "마법사 (The Magician)", img: "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg" },
        { name: "고위 여사제 (The High Priestess)", img: "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg" },
        { name: "여황제 (The Empress)", img: "https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg" },
        { name: "황제 (The Emperor)", img: "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg" },
        { name: "교황 (The Hierophant)", img: "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg" },
        { name: "연인 (The Lovers)", img: "https://upload.wikimedia.org/wikipedia/commons/3/3a/RWS_Tarot_06_Lovers.jpg" },
        { name: "전차 (The Chariot)", img: "https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg" },
        { name: "힘 (The Strength)", img: "https://upload.wikimedia.org/wikipedia/commons/f/f0/RWS_Tarot_08_Strength.jpg" },
        { name: "은둔자 (The Hermit)", img: "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg" },
        { name: "운명의 수레바퀴 (Wheel of Fortune)", img: "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg" },
        { name: "정의 (The Justice)", img: "https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg" },
        { name: "매달린 사람 (The Hanged Man)", img: "https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg" },
        { name: "죽음 (Death)", img: "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg" },
        { name: "절제 (Temperance)", img: "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg" },
        { name: "악마 (The Devil)", img: "https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg" },
        { name: "탑 (The Tower)", img: "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg" },
        { name: "별 (The Star)", img: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg" },
        { name: "달 (The Moon)", img: "https://upload.wikimedia.org/wikipedia/commons/f/f7/RWS_Tarot_18_Moon.jpg" },
        { name: "태양 (The Sun)", img: "https://upload.wikimedia.org/wikipedia/commons/1/19/RWS_Tarot_19_Sun.jpg" },
        { name: "심판 (Judgement)", img: "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg" },
        { name: "세계 (The World)", img: "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg" }
    ];

    startBtn.addEventListener('click', async () => {
        const query = userQuery.value.trim();
        if (!query) {
            alert("고민을 먼저 말씀해 주세요, 당신의 이야기를 듣고 싶어요. ✨");
            return;
        }

        inputSection.classList.add('hidden');
        tarotTable.classList.remove('hidden');
        tarotTable.classList.add('fade-in');

        const randomIndex = Math.floor(Math.random() * majorArcana.length);
        const drawnCard = majorArcana[randomIndex];

        // 카드 이미지와 이름 출력
        selectedCardsDiv.innerHTML = `
            <div class="card-item fade-in">
                <div class="card-frame">
                    <img src="${drawnCard.img}" alt="${drawnCard.name}" class="tarot-card-img">
                </div>
                <div class="card-name-label">${drawnCard.name}</div>
            </div>
        `;

        responseContainer.classList.remove('hidden');
        const loadingSpinner = document.querySelector('.loading-spinner');
        loadingSpinner.style.display = 'block';
        responseText.innerHTML = '';

        try {
            // 실제 배포 시 Firebase Function URL로 교체 (예: https://us-central1-your-project.cloudfunctions.net/getTarotReading)
            const apiUrl = "/api/getTarotReading"; // 또는 전체 URL

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userQuery: query, selectedCards: [drawnCard.name] })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            loadingSpinner.style.display = 'none';
            responseText.innerHTML = `<div class="result-message fade-in">${data.reading}</div>`;

        } catch (error) {
            console.error('Error:', error);
            // 에러 시 시뮬레이션 응답으로 대체 (테스트용)
            setTimeout(() => {
                loadingSpinner.style.display = 'none';
                responseText.innerHTML = `
                    <div class="result-message fade-in">
                        <h3>"별들이 속삭이고 있어요..."</h3>
                        <p>죄송해요, 루나의 통신이 별자리 너머로 잠시 멀어졌나 봐요.</p>
                        <p>하지만 당신이 뽑은 <strong>[${drawnCard.name}]</strong> 카드는 분명 당신에게 긍정적인 신호를 보내고 있답니다. 잠시 후 다시 루나를 찾아주세요. ✨</p>
                    </div>
                `;
            }, 2000);
        }
    });
});
