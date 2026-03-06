/* ===== public/js/app.js ===== */

document.addEventListener('DOMContentLoaded', () => {
    console.log('오늘의 이유식 App Ready!');
    // Simple router logic can be added here if needed
    const path = window.location.pathname.split("/").pop();
    if (path) {
        const activeLink = document.querySelector(`.nav-mobile a[href="${path}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
});
