document.addEventListener("DOMContentLoaded", () => {
  const svg = document.getElementById("nutrition-radar");
  if(!svg) return;
  svg.innerHTML = `
    <polygon points="100,10 180,50 160,140 40,140 20,50" fill="var(--color-sage)" opacity="0.5"/>
    <text x="80" y="20" font-size="10">단백질</text>
    <text x="170" y="50" font-size="10">칼슘</text>
    <text x="150" y="150" font-size="10">철분</text>
    <text x="30" y="150" font-size="10">아연</text>
    <text x="10" y="50" font-size="10">비타민A</text>
  `;
});