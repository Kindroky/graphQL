// === Utility: cumulative XP over time
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

// === Render bar chart of recent XP transactions
export function renderXP(data) {
  const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  const recent = sorted.slice(-8);

  const svgWidth = 600;
  const svgHeight = 400;
  const margin = 30;
  const topPadding = 40; // espace au-dessus des barres pour les labels
  const usableWidth = svgWidth - margin * 2;
  const barWidth = usableWidth / recent.length;
  const maxXP = Math.max(...recent.map(d => d.xp));
  const maxBarHeight = svgHeight - 40 - topPadding; // espace bas pour axe + espace haut

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
  Object.assign(svg.style, {
    width: "100%",
    height: `${svgHeight}px`,
    display: "block",
    overflow: "hidden",
    maxWidth: "100%"
  });

  // X axis
  const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
  xAxis.setAttribute("x1", 0);
  xAxis.setAttribute("x2", svgWidth);
  xAxis.setAttribute("y1", svgHeight - 40);
  xAxis.setAttribute("y2", svgHeight - 40);
  xAxis.setAttribute("stroke", "#000");
  svg.appendChild(xAxis);

  recent.forEach((d, i) => {
    const barHeight = (d.xp / maxXP) * maxBarHeight;
    const color = `hsl(145, 60%, ${80 - i * 6}%)`;
    const barX = margin + i * barWidth;
    const barTop = svgHeight - 40 - barHeight;
    const barCenterX = barX + barWidth * 0.35;

    // Bar
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", barX);
    rect.setAttribute("y", barTop);
    rect.setAttribute("width", barWidth * 0.7);
    rect.setAttribute("height", barHeight);
    rect.setAttribute("fill", color);
    svg.appendChild(rect);

    // Project title
    const projLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    projLabel.textContent = d.project;
    projLabel.setAttribute("x", barCenterX);
    projLabel.setAttribute("y", barTop - 8); // 8px au-dessus de la barre
    projLabel.setAttribute("font-size", "11");
    projLabel.setAttribute("text-anchor", "middle");
    svg.appendChild(projLabel);

    // XP value
    const xpLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    xpLabel.textContent = `${d.xp}`;
    xpLabel.setAttribute("x", barCenterX);
    xpLabel.setAttribute("y", barTop - 22); // 22px au-dessus de la barre
    xpLabel.setAttribute("font-size", "10");
    xpLabel.setAttribute("text-anchor", "middle");
    svg.appendChild(xpLabel);

    // Date under the bar
    const dateLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    dateLabel.textContent = d.date;
    dateLabel.setAttribute("x", barCenterX);
    dateLabel.setAttribute("y", svgHeight - 20);
    dateLabel.setAttribute("font-size", "9");
    dateLabel.setAttribute("text-anchor", "middle");
    svg.appendChild(dateLabel);
  });

  return svg;
}


// === Render XP line chart over time
export function renderXPLine(data, options = {}) {
  const strokeColor = options.strokeColor || "green";
  const points = computeCumulativeXP(data);

  const svgWidth = 600;
  const svgHeight = 400;
  const margin = 30;
  const usableWidth = svgWidth - margin * 2;
  const usableHeight = svgHeight - margin * 2;
  const maxXP = points.at(-1)?.totalXP || 1;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
  Object.assign(svg.style, {
    width: "100%",
    height: `${svgHeight}px`,
    display: "block",
    overflow: "hidden",
    maxWidth: "100%"
  });

  // Line path
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

  // X-axis tick labels (dates)
  const tickCount = 5;
  for (let i = 0; i <= tickCount; i++) {
    const index = Math.floor(i * (points.length - 1) / tickCount);
    const point = points[index];
    if (!point) continue;

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
