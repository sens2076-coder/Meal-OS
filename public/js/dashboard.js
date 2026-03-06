document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("dashboard-grid");
  if(!container) return;
  const days = ["토", "일", "월", "화", "수", "목", "금"];
  container.innerHTML = days.map((day, i) => `
    <div class="card animate-fade-in" style="animation-delay:${i*0.1}s">
      <h3 class="mb-20">${day}요일 ${i==0?'<span class="badge-alarm">🔔 해동</span>':''}</h3>
      <div class="mb-20" style="background:var(--color-mint);padding:15px;border-radius:12px">
        <h4 style="color:var(--color-forest)">점심 <span class="badge-mint">🥩밀프랩</span></h4>
        <p>소고기 두부완자</p>
        <div class="caption">🌿시금치 🥕파프리카 ⚪감자</div>
      </div>
      <div style="background:var(--color-sky);padding:15px;border-radius:12px">
        <h4 style="color:var(--color-ocean)">저녁 ${day==="목"||day==="금"?'<span class="badge-sky">🐟생선</span>':''}</h4>
        <p>${day==="목"?'생선구이':(day==="화"?'소고기 라구⭐':'특식')}</p>
        <div class="caption">🌿청경채 🥕당근 ⚪애호박</div>
      </div>
    </div>
  `).join("");
});