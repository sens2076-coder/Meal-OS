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
            console.warn('API call failed, switching to Simulation Mode ✨');
            
            // 시뮬레이션 응답 생성 (3장 vs 10장 대응)
            setTimeout(() => {
                loadingSpinner.style.display = 'none';
                
                let simulatedResult = "";
                if (count === 3) {
                    simulatedResult = `
                        <div class="result-message fade-in">
                            <h3>"세 장의 카드가 당신의 흐름을 속삭이네요..."</h3>
                            <p>당신의 고민인 <strong>'${query}'</strong>에 대해 루나가 카드를 읽어보았어요.</p>
                            <p>첫 번째 카드는 <strong>과거</strong>를, 두 번째 카드는 <strong>현재</strong>를, 세 번째 카드는 당신의 <strong>미래</strong>를 비추고 있답니다.</p>
                            <p>이 흐름은 마치 맑은 개울물이 바다로 흘러가듯 자연스러워요. 루나가 드리는 오늘의 조언은, <strong>'작은 변화를 두려워하지 말고 흐름에 몸을 맡겨보는 것'</strong>이에요. ✨</p>
                        </div>
                    `;
                } else {
                    simulatedResult = `
                        <div class="result-message fade-in">
                            <h3>💎 "루나의 프리미엄 심층 분석이 도착했습니다"</h3>
                            <p>당신의 깊은 고민 <strong>'${query}'</strong>에 대해 켈틱 크로스 배열로 10장의 카드를 꼼꼼히 살펴보았어요.</p>
                            <p>지금 당신을 가로막고 있는 장애물은 사실 당신을 더 강하게 만들기 위한 디딤돌일 뿐이네요. 당신의 잠재의식 속에는 이미 정답이 들어있답니다.</p>
                            <p><strong>최종 결과:</strong> 당신의 정성이 별들에게 닿아, 머지않아 밝은 태양이 뜨는 것과 같은 기쁜 소식이 찾아올 거예요. 루나가 당신의 앞길을 온 마음 다해 축복할게요. 🔮✨</p>
                            <br><small>(* 현재 시뮬레이션 모드입니다. 실제 AI 연결 시 더 정교한 개별 카드 해석이 제공됩니다.)</small>
                        </div>
                    `;
                }
                responseText.innerHTML = simulatedResult;
            }, 3000);
        }
    }
});
