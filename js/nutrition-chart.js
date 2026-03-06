/* ===== public/js/nutrition-chart.js ===== */

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('nutrition.html')) {
        renderNutritionChart();
    }
});

function renderNutritionChart() {
    const chartContainer = document.getElementById('radar-chart');
    const data = [ // Dummy data, replace with actual data from storage
        { axis: "단백질", value: 0.8 },
        { axis: "칼슘", value: 0.6 },
        { axis: "철분", value: 0.9 },
        { axis: "아연", value: 0.7 },
        { axis: "비타민A", value: 0.85 },
        { axis: "비타민C", value: 0.5 },
        { axis: "오메가3", value: 0.75 },
    ];

    const width = 300, height = 300;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const radius = Math.min(width, height) / 2;
    const angleSlice = Math.PI * 2 / data.length;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', width + margin.left + margin.right);
    svg.setAttribute('height', height + margin.top + margin.bottom);
    
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute('transform', `translate(${width / 2 + margin.left}, ${height / 2 + margin.top})`);

    // Draw grid
    for (let i = 1; i < 5; i++) {
        const levelFactor = radius * (i / 4);
        const gridPoints = data.map((d, i) => {
            return `${levelFactor * Math.cos(angleSlice * i - Math.PI/2)}, ${levelFactor * Math.sin(angleSlice * i - Math.PI/2)}`;
        }).join(' ');
        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute('points', gridPoints);
        polygon.setAttribute('fill', 'none');
        polygon.setAttribute('stroke', '#ccc');
        polygon.setAttribute('stroke-dasharray', '2,2');
        g.appendChild(polygon);
    }

    // Draw data area
    const dataPoints = data.map((d, i) => {
        return `${radius * d.value * Math.cos(angleSlice * i - Math.PI/2)}, ${radius * d.value * Math.sin(angleSlice * i - Math.PI/2)}`;
    }).join(' ');
    const dataPolygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    dataPolygon.setAttribute('points', dataPoints);
    dataPolygon.setAttribute('fill', 'rgba(64, 145, 108, 0.5)');
    dataPolygon.setAttribute('stroke', 'var(--color-sage)');
    dataPolygon.setAttribute('stroke-width', '2');
    g.appendChild(dataPolygon);

    // Draw labels
     data.forEach((d, i) => {
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute('x', radius * 1.1 * Math.cos(angleSlice * i - Math.PI/2));
        label.setAttribute('y', radius * 1.1 * Math.sin(angleSlice * i - Math.PI/2));
        label.textContent = d.axis;
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('dy', '0.35em');
        g.appendChild(label);
    });


    svg.appendChild(g);
    chartContainer.appendChild(svg);
}
