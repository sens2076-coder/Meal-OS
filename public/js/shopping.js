/* ===== public/js/shopping.js ===== */

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('shopping.html')) {
        renderShoppingList();
    }
});

function renderShoppingList() {
    const shoppingListContainer = document.getElementById('shopping-list');
    const storage = getStorage();
    const schedule = storage.week_schedule;

    if (!schedule) {
        shoppingListContainer.innerHTML = '<p>아직 생성된 식단이 없습니다.</p>';
        return;
    }

    // This is a simplified version. A real implementation would aggregate ingredients from the schedule.
    const dummyList = {
        '소고기': [{ name: '다짐육', amount: '300g', price: 15000, isSale: true }],
        '채소': [{ name: '시금치', amount: '1단', price: 2000, isSale: false }],
        '단백질': [{ name: '두부', amount: '1모', price: 1500, isSale: false }],
    };

    let totalCost = 0;
    shoppingListContainer.innerHTML = Object.keys(dummyList).map(category => {
        const items = dummyList[category].map(item => {
            totalCost += item.price;
            return `
                <li class="${item.isSale ? 'sale-item' : ''}">
                    <input type="checkbox" id="${item.name}">
                    <label for="${item.name}">${item.name} (${item.amount})</label>
                    <span>${item.price.toLocaleString()}원</span>
                </li>
            `;
        }).join('');
        return `
            <div class="category-section">
                <h3>${category}</h3>
                <ul>${items}</ul>
            </div>
        `;
    }).join('');

    document.getElementById('total-cost').textContent = `${totalCost.toLocaleString()}원`;
}
