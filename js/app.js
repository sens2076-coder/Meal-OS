/* public/js/app.js */

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const inputSection = document.getElementById('input-section');
    const tarotTable = document.getElementById('tarot-table');
    const userQuery = document.getElementById('user-query');
    const responseContainer = document.getElementById('ai-response');
    const responseText = document.getElementById('response-text');

    startBtn.addEventListener('click', () => {
        const query = userQuery.value.trim();
        if (!query) {
            alert("고민을 먼저 말씀해 주세요, 당신의 이야기를 듣고 싶어요. ✨");
            return;
        }

        // UI 전환 애니메이션
        inputSection.classList.add('hidden');
        tarotTable.classList.remove('hidden');
        tarotTable.classList.add('fade-in');

        // 임시: 카드 뽑기 시뮬레이션
        simulateTarotReading(query);
    });

    function simulateTarotReading(query) {
        // 여기에 나중에 백엔드 API 호출 로직이 들어갑니다.
        responseContainer.classList.remove('hidden');
        
        // 시뮬레이션 응답
        setTimeout(() => {
            responseText.innerHTML = `
                <div class="result-message">
                    <h3>"별들이 당신의 이야기를 속삭이고 있어요..."</h3>
                    <p>당신의 고민인 <strong>'${query}'</strong>에 대해 루나가 카드를 읽고 있습니다.</p>
                    <p>곧 신비로운 해석이 도착할 거예요. 잠시만 기다려 주세요. 🔮</p>
                </div>
            `;
        }, 2000);
    }
});
