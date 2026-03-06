document.addEventListener('DOMContentLoaded', () => {
    // 현재 페이지가 recipes.html일 때만 레시피 목록 로직 실행
    if (window.location.pathname.endsWith('recipes.html')) {
        fetch('recipes.json')
            .then(response => response.json())
            .then(data => {
                displayRecipes(data);
                setupFilters(data);
            });
    }
});

function displayRecipes(recipes, filter = 'all') {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = ''; // 기존 목록 초기화

    let allRecipes = [];
    // 모든 카테고리의 레시피를 하나의 배열로 합침
    for (const category in recipes) {
        for (const subCategory in recipes[category]) {
            const items = recipes[category][subCategory];
            items.forEach(item => {
                // item이 문자열인 경우 객체로 변환 (개인 선호 메뉴 처리)
                const recipe = typeof item === 'string' ? { name: item, baby_food_tag: false } : item;
                recipe.category = category; // 나중에 필터링을 위해 카테고리 정보 추가
                allRecipes.push(recipe);
            });
        }
    }

    // 필터링
    const filteredRecipes = allRecipes.filter(recipe => {
        if (filter === 'all') return true;
        if (filter === 'baby_food') return recipe.baby_food_tag;
        return recipe.category === filter;
    });

    filteredRecipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            <h3>${recipe.name}</h3>
            ${recipe.baby_food_tag ? '<p>🍼 이유식 연계</p>' : ''}
        `;
        recipeList.appendChild(card);
    });
}

function setupFilters(recipes) {
    const filtersContainer = document.getElementById('recipe-filters');
    const categories = Object.keys(recipes);

    // '전체' 버튼
    const allButton = document.createElement('button');
    allButton.textContent = '전체';
    allButton.className = 'active'; // 기본값
    allButton.addEventListener('click', () => {
        setActiveButton(allButton);
        displayRecipes(recipes, 'all');
    });
    filtersContainer.appendChild(allButton);

    // '이유식 연계' 버튼
    const babyFoodButton = document.createElement('button');
    babyFoodButton.textContent = '🍼 이유식 연계';
    babyFoodButton.addEventListener('click', () => {
        setActiveButton(babyFoodButton);
        displayRecipes(recipes, 'baby_food');
    });
    filtersContainer.appendChild(babyFoodButton);

    // 나머지 카테고리 버튼
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category; // 예: meal_prep_pool
        button.addEventListener('click', () => {
            setActiveButton(button);
            displayRecipes(recipes, category);
        });
        filtersContainer.appendChild(button);
    });
}

function setActiveButton(clickedButton) {
    const buttons = document.querySelectorAll('#recipe-filters button');
    buttons.forEach(button => button.classList.remove('active'));
    clickedButton.classList.add('active');
}
