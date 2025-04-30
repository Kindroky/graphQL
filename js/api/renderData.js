// render XP in a bar chart

export function renderXP(data) {
    const svgWidth = 800;
    const svgHeight = 400;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", svgHeight);
    const maxXP = Math.max(...data.map(d => d.xp));
    const barWidth = svgWidth / data.length;
    data.forEach((d, i) => {
        const barHeight = (d.xp / maxXP) * (svgHeight - 50); // leave space for labels
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", i * barWidth);
        rect.setAttribute("y", svgHeight - barHeight);
        rect.setAttribute("width", barWidth * 0.8);
        rect.setAttribute("height", barHeight);
        rect.setAttribute("fill", "#69b3a2");
        svg.appendChild(rect);
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.textContent = d.project;
        label.setAttribute("x", i * barWidth + barWidth * 0.4);
        label.setAttribute("y", svgHeight - barHeight - 5);
        label.setAttribute("font-size", "10");
        label.setAttribute("text-anchor", "middle");
        svg.appendChild(label);    
    });
    const container = document.createElement("div");
    container.id = "xp-graph";
    container.appendChild(svg);
    document.body.appendChild(container);
}
