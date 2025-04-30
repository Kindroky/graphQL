// render XP in a bar chart
export function renderXP(data) {
    const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    const recent = sorted.slice(-8);
  
    const svgWidth = 800;
    const svgHeight = 400;
    const barWidth = svgWidth / recent.length;
    const maxXP = Math.max(...recent.map(d => d.xp));
  
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", svgHeight);
  
    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xAxis.setAttribute("x1", 0);
    xAxis.setAttribute("x2", svgWidth);
    xAxis.setAttribute("y1", svgHeight - 40);
    xAxis.setAttribute("y2", svgHeight - 40);
    xAxis.setAttribute("stroke", "#000");
    svg.appendChild(xAxis);
  
    recent.forEach((d, i) => {
      const barHeight = (d.xp / maxXP) * (svgHeight - 60);
      const lightness = 80 - (i * 6); // from 40% to ~80%
      const color = `hsl(145, 60%, ${lightness}%)`;
      
  
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", i * barWidth);
      rect.setAttribute("y", svgHeight - barHeight - 40);
      rect.setAttribute("width", barWidth * 0.7);
      rect.setAttribute("height", barHeight);
      rect.setAttribute("fill", color);
      svg.appendChild(rect);
  
      const projectLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
      projectLabel.textContent = d.project;
      projectLabel.setAttribute("x", i * barWidth + barWidth * 0.35);
      projectLabel.setAttribute("y", svgHeight - barHeight - 45);
      projectLabel.setAttribute("font-size", "10");
      projectLabel.setAttribute("text-anchor", "middle");
      svg.appendChild(projectLabel);
  
      const dateLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
      dateLabel.textContent = d.date;
      dateLabel.setAttribute("x", i * barWidth + barWidth * 0.35);
      dateLabel.setAttribute("y", svgHeight - 25);
      dateLabel.setAttribute("font-size", "9");
      dateLabel.setAttribute("text-anchor", "middle");
      svg.appendChild(dateLabel);
  
      const xpLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
      xpLabel.textContent = `${d.xp}`;
      xpLabel.setAttribute("x", i * barWidth + barWidth * 0.35);
      xpLabel.setAttribute("y", svgHeight - barHeight - 60);
      xpLabel.setAttribute("font-size", "9");
      xpLabel.setAttribute("text-anchor", "middle");
      svg.appendChild(xpLabel);
    });
  
    const container = document.createElement("div");
    container.id = "xp-graph";
    container.style.overflowX = "auto";
    container.style.display = "flex";
    container.style.justifyContent = "left";
    container.style.width = "fit-content";
    container.style.margin = "30px auto";
    container.style.border = "1px solid #ccc";
    container.style.marginTop = "30px";
    container.style.padding = "10px";
    container.appendChild(svg);
  
    return container;
  }
  
// render level in orizontal progress bars
export function renderSkills(skills) {
    const container = document.createElement("div");
    container.classList.add("skills-container");

    for (const skill of skills) {
        const skillRow = document.createElement("div");
        skillRow.classList.add("skill-row");

        const label = document.createElement("span");
        label.classList.add("skill-label");
        label.innerText = skill.name;

        const barContainer = document.createElement("div");
        barContainer.classList.add("skill-bar-container");

        const bar = document.createElement("div");
        bar.classList.add("skill-bar");
        const percent = Math.min((skill.level / 20) * 100, 100);
        bar.style.width = `${percent}%`;
        bar.style.backgroundColor = `hsl(${(percent * 1.2 + 180) % 360}, 70%, 65%)`;

        barContainer.appendChild(bar);
        skillRow.appendChild(label);
        skillRow.appendChild(barContainer);
        container.appendChild(skillRow);
    }

    return container;
}
  