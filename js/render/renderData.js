// render XP in a bar chart
export function renderXP(data) {
  const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  const recent = sorted.slice(-8);

  const svgWidth = 800;         // Réduit pour éviter le scroll
  const svgHeight = 240;
  const margin = 30;
  const usableWidth = svgWidth - margin * 2;
  const barWidth = usableWidth / recent.length;
  const maxXP = Math.max(...recent.map(d => d.xp));

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.style.width = "100%";
  svg.style.height = "240px";
  svg.style.display = "block";
  svg.style.overflow = "hidden";
  svg.style.maxWidth = "100%";

  const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
  xAxis.setAttribute("x1", 0);
  xAxis.setAttribute("x2", svgWidth);
  xAxis.setAttribute("y1", svgHeight - 40);
  xAxis.setAttribute("y2", svgHeight - 40);
  xAxis.setAttribute("stroke", "#000");
  svg.appendChild(xAxis);

  recent.forEach((d, i) => {
    const barHeight = (d.xp / maxXP) * (svgHeight - 60);
    const lightness = 80 - (i * 6);
    const color = `hsl(145, 60%, ${lightness}%)`;

    const barX = margin + i * barWidth;
    const labelX = barX + barWidth * 0.35;

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", barX);
    rect.setAttribute("y", svgHeight - barHeight - 40);
    rect.setAttribute("width", barWidth * 0.7);
    rect.setAttribute("height", barHeight);
    rect.setAttribute("fill", color);
    svg.appendChild(rect);

    const projectLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    projectLabel.textContent = d.project;
    projectLabel.setAttribute("x", labelX);
    projectLabel.setAttribute("y", svgHeight - barHeight - 45);
    projectLabel.setAttribute("font-size", "10");
    projectLabel.setAttribute("text-anchor", "middle");
    svg.appendChild(projectLabel);

    const dateLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    dateLabel.textContent = d.date;
    dateLabel.setAttribute("x", labelX);
    dateLabel.setAttribute("y", svgHeight - 25);
    dateLabel.setAttribute("font-size", "9");
    dateLabel.setAttribute("text-anchor", "middle");
    svg.appendChild(dateLabel);

    const xpLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    xpLabel.textContent = `${d.xp}`;
    xpLabel.setAttribute("x", labelX);
    xpLabel.setAttribute("y", svgHeight - barHeight - 60);
    xpLabel.setAttribute("font-size", "9");
    xpLabel.setAttribute("text-anchor", "middle");
    svg.appendChild(xpLabel);
  });

  return svg;
}

function computeCumulativeXP(data) {
  const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  const result = [];
  let total = 0;
  for (const d of sorted) {
    total += d.xp;
    result.push({ date: d.date, totalXP: total });
  }
  return result;
}

export function renderXPLine(data, options = {}) {
  const strokeColor = options.strokeColor || "green";

  const points = computeCumulativeXP(data);

  const svgWidth = 800;              
  const svgHeight = 240;
  const margin = 30;
  const usableWidth = svgWidth - margin * 2;
  const usableHeight = svgHeight - margin * 2;
  const maxXP = points.at(-1).totalXP;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
  svg.style.width = "100%";
  svg.style.height = "240px";
  svg.style.display = "block";
  svg.style.overflow = "hidden";
  svg.style.maxWidth = "100%";

  // === Path of the XP curve
  const pathData = points.map((point, i) => {
    const x = margin + (i / (points.length - 1)) * usableWidth;
    const y = svgHeight - margin - (point.totalXP / maxXP) * usableHeight;
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathData);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", strokeColor);
  path.setAttribute("stroke-width", "2");
  svg.appendChild(path);

  // === X-axis labels (dates)
  const tickCount = 5;
  for (let i = 0; i <= tickCount; i++) {
    const index = Math.floor(i * (points.length - 1) / tickCount);
    const point = points[index];
    const x = margin + (index / (points.length - 1)) * usableWidth;

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", x);
    label.setAttribute("y", svgHeight - 8);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "10");
    label.textContent = point.date;
    svg.appendChild(label);
  }

  return svg;
}
