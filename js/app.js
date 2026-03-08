/* js/app.js */

document.addEventListener('DOMContentLoaded', () => {
    const inputSection = document.getElementById('input-section');
    const tarotTable = document.getElementById('tarot-table');
    const userQuery = document.getElementById('user-query');
    const responseContainer = document.getElementById('ai-response');
    const responseText = document.getElementById('response-text');
    const selectedCardsDiv = document.getElementById('selected-cards');
    
    const mode3Btn = document.getElementById('mode-3-cards');
    const mode10Btn = document.getElementById('mode-10-cards');

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

    const handleModeSelection = (count) => {
        const query = userQuery.value.trim();
        if (!query) {
            alert("고민을 먼저 말씀해 주세요, 당신의 이야기를 듣고 싶어요. ✨");
            return;
        }

        if (count === 10) {
            // 프리미엄 결제 유도 로직 (MVP에서는 안내창으로 대체)
            if (!confirm("💎 심층 10장 뽑기는 프리미엄 서비스입니다.\n루나의 정교한 분석을 위해 복채(결제)가 필요해요. 계속할까요?")) {
                return;
            }
        }

        inputSection.classList.add('hidden');
        tarotTable.classList.remove('hidden');
        tarotTable.classList.add('fade-in');

        startReading(query, count);
    };

    mode3Btn.addEventListener('click', () => handleModeSelection(3));
    mode10Btn.addEventListener('click', () => handleModeSelection(10));

    async function startReading(query, count) {
        // 무작위 중복 없는 카드 뽑기
        const shuffled = [...majorArcana].sort(() => 0.5 - Math.random());
        const selectedCards = shuffled.slice(0, count);

        selectedCardsDiv.innerHTML = '';
        selectedCardsDiv.className = count === 10 ? 'cards-display grid-10' : 'cards-display flex-3';

        selectedCards.forEach((card, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card-item fade-in';
            cardEl.style.animationDelay = `${index * 0.2}s`;
            cardEl.innerHTML = `
                <div class="card-frame mini">
                    <img src="${card.img}" alt="${card.name}" class="tarot-card-img">
                </div>
                <div class="card-name-label mini">${card.name}</div>
            `;
            selectedCardsDiv.appendChild(cardEl);
        });

        responseContainer.classList.remove('hidden');
        const loadingSpinner = document.querySelector('.loading-spinner');
        loadingSpinner.style.display = 'block';
        responseText.innerHTML = '';

        try {
            // 실제 배포 시 Firebase Function URL 사용
            const apiUrl = "/api/getTarotReading";
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    userQuery: query, 
                    selectedCards: selectedCards.map(c => c.name),
                    mode: count === 10 ? 'premium' : 'free'
                })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            loadingSpinner.style.display = 'none';
            responseText.innerHTML = `<div class="result-message fade-in">${data.reading}</div>`;

        } catch (error) {
            console.error('Error:', error);
            setTimeout(() => {
                loadingSpinner.style.display = 'none';
                responseText.innerHTML = `
                    <div class="result-message fade-in">
                        <h3>"별들이 당신의 미래를 준비하고 있어요..."</h3>
                        <p>루나가 당신을 위해 <strong>${count}장의 카드</strong>를 정성껏 뽑았습니다.</p>
                        <p>현재 AI 엔진 연결이 지연되고 있지만, 당신이 뽑은 카드들의 에너지는 이미 당신의 주변을 감싸고 있어요. 잠시 후 다시 루나를 찾아주시면 더 깊은 해석을 드릴게요. ✨</p>
                    </div>
                `;
            }, 3000);
        }
    }
});
