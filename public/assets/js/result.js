document.addEventListener('DOMContentLoaded', async () => {
  const loadingOverlay = document.getElementById('loadingOverlay');
  const resultContainer = document.getElementById('resultContainer');
  const loadingMsg = document.getElementById('loadingMsg');
  
  const messages = [
    "전단지를 분석하고 있어요...",
    "아이 맞춤 식단을 구성하고 있어요...",
    "영양 밸런스를 계산하고 있어요...",
    "장보기 리스트를 정리하고 있어요...",
    "레시피를 준비하고 있어요..."
  ];
  
  let msgIdx = 0;
  const msgInterval = setInterval(() => {
    msgIdx = (msgIdx + 1) % messages.length;
    loadingMsg.textContent = messages[msgIdx];
    loadingMsg.classList.add('animate-fadeInUp');
    setTimeout(() => loadingMsg.classList.remove('animate-fadeInUp'), 500);
  }, 1500);

  const inputData = Storage.getInputData();
  if (!inputData) {
    window.location.href = 'index.html';
    return;
  }

  try {
    const result = await generateMealPlan(inputData.text, inputData.imageBase64);
    clearInterval(msgInterval);
    loadingOverlay.style.display = 'none';
    renderResult(result);
  } catch (error) {
    clearInterval(msgInterval);
    loadingOverlay.innerHTML = `
      <div class="card" style="text-align: center;">
        <h3>오류가 발생했습니다</h3>
        <p>${error.message === 'API_KEY_MISSING' ? 'API 키를 설정해주세요.' : '결과를 가져오는 중 오류가 발생했습니다.'}</p>
        <button class="btn-primary" onclick="window.location.href='index.html'" style="margin-top: 20px;">돌아가기</button>
      </div>
    `;
  }
});

function renderResult(data) {
  document.getElementById('weekSummary').textContent = data.week_summary;
  renderMealPlan(data.meal_plan);
  renderShoppingList(data.shopping_list);
  renderRecipes(data.recipes);
  renderNutrition(data.nutrition);
  renderSmartBackup(data.smart_backup);
  renderThawSchedule(data.thaw_schedule);
  
  initTabs();
}

function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.style.display = 'none');
      
      tab.classList.add('active');
      document.getElementById(tab.dataset.target).style.display = 'block';
    });
  });
}

function renderMealPlan(plans) {
  const grid = document.getElementById('mealPlanGrid');
  grid.innerHTML = plans.map(day => `
    <div class="card meal-card">
      <div class="meal-day-header">${day.day}요일</div>
      <div class="meal-slot lunch">
        <span class="slot-label">점심</span>
        <div class="main-menu">${day.lunch.main}</div>
        <div class="sides">${day.lunch.sides.join(', ')}</div>
        ${day.lunch.thaw_alert ? '<span class="badge badge-amber">🔔 해동알람</span>' : ''}
      </div>
      <div class="meal-slot dinner">
        <span class="slot-label">저녁</span>
        <div class="main-menu">${day.dinner.main}</div>
        <div class="sides">${day.dinner.sides.join(', ')}</div>
        <div class="badges">
          ${day.dinner.badges.map(b => `<span class="badge badge-lavender">${b}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

function renderShoppingList(list) {
  const container = document.getElementById('shoppingListContainer');
  const groups = {};
  list.forEach(item => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  });

  container.innerHTML = Object.entries(groups).map(([cat, items]) => `
    <div class="shopping-group">
      <h4>${cat}</h4>
      ${items.map(i => `
        <div class="shopping-item ${i.sale ? 'sale' : ''}">
          <input type="checkbox">
          <span class="item-name">${i.item}</span>
          <span class="item-qty">${i.qty}</span>
          <span class="item-usage">${i.usage}</span>
          ${i.baby_cube ? '<span class="badge badge-lavender">🍼 큐브용</span>' : ''}
        </div>
      `).join('')}
    </div>
  `).join('');
}

function renderRecipes(recipes) {
  const container = document.getElementById('recipeContainer');
  container.innerHTML = recipes.map(r => `
    <div class="card recipe-card">
      <h3>${r.name}</h3>
      <div class="tags">${r.tags.map(t => `<span class="badge badge-sage">${t}</span>`).join('')}</div>
      <div class="recipe-grid">
        <div>
          <h5>아이 분량</h5>
          <ul>${r.ingredients_child.map(i => `<li>${i}</li>`).join('')}</ul>
        </div>
        <div>
          <h5>어른 분량</h5>
          <ul>${r.ingredients_adult.map(i => `<li>${i}</li>`).join('')}</ul>
        </div>
      </div>
      <div class="steps">
        <h5>조리 단계</h5>
        <ol>${r.steps.map(s => `<li>${s}</li>`).join('')}</ol>
      </div>
      <div class="cube-tip">
        <strong>🍼 큐브 팁:</strong> ${r.baby_cube_tip}
      </div>
    </div>
  `).join('');
}

function renderNutrition(nut) {
  const radar = document.getElementById('nutritionRadar');
  const points = [
    { label: '단백질', val: nut.protein.achieved },
    { label: '칼슘', val: nut.calcium.achieved },
    { label: '철분', val: nut.iron.achieved },
    { label: '아연', val: nut.zinc.achieved },
    { label: 'Vit A', val: nut.vitaminA.achieved },
    { label: 'Vit C', val: nut.vitaminC.achieved },
    { label: '오메가3', val: nut.omega3.achieved }
  ];

  const size = 300;
  const center = size / 2;
  const radius = 100;
  const angleStep = (Math.PI * 2) / points.length;

  let polyPoints = points.map((p, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = (p.val / 100) * radius;
    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
  }).join(' ');

  let bgPoints = points.map((p, i) => {
    const angle = i * angleStep - Math.PI / 2;
    return `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`;
  }).join(' ');

  radar.innerHTML = `
    <svg viewBox="0 0 ${size} ${size}" class="radar-svg">
      <polygon points="${bgPoints}" fill="none" stroke="#ccc" stroke-dasharray="4" />
      <polygon points="${polyPoints}" fill="rgba(64, 145, 108, 0.3)" stroke="var(--brand-sage)" stroke-width="2" />
      ${points.map((p, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = center + (radius + 20) * Math.cos(angle);
        const y = center + (radius + 20) * Math.sin(angle);
        return `<text x="${x}" y="${y}" text-anchor="middle" font-size="12" fill="var(--brand-dark)">${p.label}</text>`;
      }).join('')}
    </svg>
  `;
}

function renderSmartBackup(backups) {
  const container = document.getElementById('smartBackupContainer');
  container.innerHTML = backups.map(b => `
    <div class="card backup-card">
      <h5>💡 ${b.situation}</h5>
      <p><strong>대처:</strong> ${b.action}</p>
      <p><strong>보충:</strong> ${b.supplement}</p>
    </div>
  `).join('');
}

function renderThawSchedule(schedule) {
  const container = document.getElementById('thawScheduleContainer');
  container.innerHTML = schedule.map(s => `
    <div class="thaw-item">
      <span class="thaw-day">${s.thaw_day}요일 ${s.time}</span>
      <span class="thaw-target">➡️ ${s.day}요일용 ${s.item} 해동</span>
    </div>
  `).join('');
}
