/* ===== public/js/dashboard.js ===== */

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('dashboard.html')) {
        renderDashboard();
    }
});

function renderDashboard() {
    const dashboardGrid = document.getElementById('dashboard-grid');
    const storage = getStorage();
    const schedule = storage.week_schedule;

    if (!schedule) {
        dashboardGrid.innerHTML = '<p>아직 생성된 식단이 없습니다. 식단 생성 페이지로 이동하여 식단을 만들어주세요.</p>';
        return;
    }

    const today = new Date().toLocaleString('ko-KR', { weekday: 'short' }); // e.g., "월"

    dashboardGrid.innerHTML = schedule.map(dayData => {
        const isToday = dayData.day === today;
        return `
            <div class="card day-card ${isToday ? 'today' : ''}">
                <h3>${dayData.day}</h3>
                <div class="meal lunch">
                    <span class="meal-title">점심</span>
                    <p>${dayData.lunch.main}</p>
                    <ul>${dayData.lunch.sides.map(s => `<li>${s}</li>`).join('')}</ul>
                </div>
                <div class="meal dinner">
                    <span class="meal-title">저녁</span>
                    <p>${dayData.dinner.main}</p>
                    <ul>${dayData.dinner.sides.map(s => `<li>${s}</li>`).join('')}</ul>
                </div>
            </div>
        `;
    }).join('');
}
