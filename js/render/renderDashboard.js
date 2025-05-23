import { renderXP } from './renderData.js';
import { renderXPLine } from './renderData.js';

export function renderDashboard(userData, xpData, skillsData) {
  const container = document.createElement("div");
  container.className = "dashboard-grid";
  container.style.display = "flex"; // main fix: row layout
  container.style.gap = "30px";

  // === LEFT COLUMN: GRAPHS (stacked vertically) ===
  const leftColumn = document.createElement("div");
  leftColumn.style.display = "flex";
  leftColumn.style.flexDirection = "column";
  leftColumn.style.gap = "10px";
  leftColumn.style.flex = "1";

  // --- Card 1: Line Graph (XP progression)
  const lineCard = document.createElement("div");
  lineCard.className = "xp-section";
  lineCard.style.backgroundColor = "#e0f9e0";
  lineCard.style.borderRadius = "12px";
  lineCard.style.padding = "15px";
  lineCard.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";

  const lineTitle = document.createElement("h4");
  lineTitle.textContent = "XP Progression with Time";
  lineCard.appendChild(lineTitle);
  const xpLineChart = renderXPLine(xpData, { strokeColor: "#ff66b2" });
  lineCard.appendChild(xpLineChart);
  leftColumn.appendChild(lineCard);

  // --- Card 2: Bar Graph (XP per project)
  const xpCard = document.createElement("div");
  xpCard.className = "xp-section";
  xpCard.style.backgroundColor = "#fcd9e0";
  xpCard.style.borderRadius = "12px";
  xpCard.style.padding = "15px";
  xpCard.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";

  const xpTitle = document.createElement("h4");
  xpTitle.textContent = "XP bar graph per project";
  xpCard.appendChild(xpTitle);

  const graph = renderXP(xpData);
  if (!(graph instanceof Node)) {
    const error = document.createElement("p");
    error.textContent = "Error: Invalid graph";
    xpCard.appendChild(error);
  } else {
    xpCard.appendChild(graph);
  }

  leftColumn.appendChild(xpCard);
  container.appendChild(leftColumn);

  // === RIGHT COLUMN: SIDEBAR ===
  const sidebar = document.createElement("div");
  sidebar.className = "sidebar";
  sidebar.style.flex = "0 0 300px"; // fixed width

  // Logout
  const logoutBtn = document.createElement("button");
  logoutBtn.className = "logout-btn";
  logoutBtn.textContent = "Log out";
  sidebar.appendChild(logoutBtn);

  // Profile
  const profileCard = document.createElement("div");
  profileCard.className = "profile-card";
  profileCard.innerHTML = `<h2>Hi ${userData.login}!</h2>`;

  const xpInKB = Math.floor(userData.totalUp / 1024);
  const totalXP = document.createElement("p");
  totalXP.textContent = `You have ${xpInKB} KB of XP! Well done!`;
  totalXP.style.marginTop = "4px";
  totalXP.style.fontSize = "1rem";
  profileCard.appendChild(totalXP);
  sidebar.appendChild(profileCard);

  // Audit
  const up = userData.totalUp ?? 0;
  const down = userData.totalDown ?? 1;
  const ratio = userData.auditRatio ?? 1;
  const doneWidth = down > 0 ? (up / down) * 100 : 100;

  const auditCard = document.createElement("div");
  auditCard.className = "audit-card";
  auditCard.innerHTML = `
    <h3>Audit Info</h3>
    <p><strong>⬆ Done</strong> ${(up / 1_000_000).toFixed(2)} MB</p>
    <div class="bar-container">
        <div class="bar done" style="width: ${doneWidth}%"></div>
    </div>
    <p><strong>⬇ Received</strong> ${(down / 1_000_000).toFixed(2)} MB</p>
    <div class="bar-container">
        <div class="bar received" style="width: 100%"></div>
    </div>
    <p><strong>Audit ratio</strong> ${ratio.toFixed(2)}</p>
  `;
  sidebar.appendChild(auditCard);

  container.appendChild(sidebar);
  return container;
}
