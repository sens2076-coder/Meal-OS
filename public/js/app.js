document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-pc a, .nav-mobile a").forEach(link => {
    if(link.getAttribute("href") === currentPath) link.classList.add("active");
  });
});