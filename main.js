const foodList = [
    "치킨", "피자", "짜장면", "짬뽕", "탕수육",
    "떡볶이", "김밥", "라면", "돈까스", "초밥",
    "파스타", "햄버거", "샌드위치", "보쌈", "족발"
];

const foodDisplay = document.getElementById("food-display");
const pickFoodButton = document.getElementById("pick-food");
const themeBtn = document.getElementById("theme-btn");

let spinningInterval;
let isSpinning = false;

// Theme Logic
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
themeBtn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

themeBtn.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    let newTheme = theme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});

const pickRandomFood = () => {
    const randomIndex = Math.floor(Math.random() * foodList.length);
    foodDisplay.textContent = foodList[randomIndex];
};

const startSpinning = () => {
    if (isSpinning) return;
    isSpinning = true;
    pickFoodButton.disabled = true;
    pickFoodButton.textContent = '고르는 중...';

    spinningInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * foodList.length);
        foodDisplay.textContent = foodList[randomIndex];
        foodDisplay.classList.add('spinning');
    }, 100);

    setTimeout(() => {
        clearInterval(spinningInterval);
        pickRandomFood();
        foodDisplay.classList.remove('spinning');
        isSpinning = false;
        pickFoodButton.disabled = false;
        pickFoodButton.textContent = '골라줘!';
    }, 3000);
};

pickFoodButton.addEventListener("click", startSpinning);
