// 스크롤 등장 애니메이션

const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;

        if (elementTop < windowHeight - 100) {
            el.classList.add("active");
        }
    });
});

// 헤더 배경 변화

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        document.querySelector("header").style.background = "#0f1115";
    } else {
        document.querySelector("header").style.background = "transparent";
    }
});
