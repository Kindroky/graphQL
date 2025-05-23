import { renderXP } from './renderData.js';
import { renderXPLine } from './renderData.js';

export function renderDashboard(userData, xpData, rawXP) {
  const container = document.createElement("div");
  container.className = "dashboard-grid";
  Object.assign(container.style, {
    display: "flex",
    gap: "30px"
  });

  const leftColumn = document.createElement("div");
  Object.assign(leftColumn.style, {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flex: "1"
  });

  const lineCard = createCard("#e0f9e0", "XP Progression Over Time");
  const xpLineChart = renderXPLine(xpData, { strokeColor: "#ff66b2" });
  lineCard.appendChild(xpLineChart);
  leftColumn.appendChild(lineCard);

  const xpCard = createCard("#fcd9e0", "XP by Project");
  const graph = renderXP(xpData);
  xpCard.appendChild(graph);
  leftColumn.appendChild(xpCard);

  container.appendChild(leftColumn);

  const sidebar = document.createElement("div");
  sidebar.className = "sidebar";
  Object.assign(sidebar.style, {
    flex: "0 0 300px",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  });

  const logoutBtn = document.createElement("button");
  logoutBtn.className = "logout-btn";
  logoutBtn.textContent = "Log out";
  Object.assign(logoutBtn.style, {
    padding: "10px",
    backgroundColor: "#88cc88",
    color: "black",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.2s ease"
  });
  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("jwt");
    location.reload();
  });
  logoutBtn.addEventListener("mouseover", () => {
    logoutBtn.style.backgroundColor = "#ffc0cb";
  });
  logoutBtn.addEventListener("mouseout", () => {
    logoutBtn.style.backgroundColor = "#88cc88";
  });
  sidebar.appendChild(logoutBtn);

  // ✅ Display raw XP (not in KB)
  const totalXP = rawXP.reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const profileCard = createCard("#fcd9e0", `Hi ${userData.login} 👋`);
  const totalXPText = document.createElement("p");
  totalXPText.textContent = `You’ve earned ${totalXP.toLocaleString()} XP! 🎉`;
  totalXPText.style.marginTop = "5px";
  totalXPText.style.fontSize = "1rem";
  profileCard.appendChild(totalXPText);
  sidebar.appendChild(profileCard);

  const up = userData.totalUp ?? 0;
  const down = userData.totalDown ?? 1;
  const ratio = userData.auditRatio ?? 1;
  const doneWidth = down > 0 ? (up / down) * 100 : 100;

  const auditCard = document.createElement("div");
  auditCard.className = "audit-card";
  Object.assign(auditCard.style, {
    backgroundColor: "#e0f9e0",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
  });

  auditCard.innerHTML = `
    <h3>Audit Info</h3>
    <p><strong>⬆ Done:</strong> ${(up / 1_000_000).toFixed(2)} MB</p>
    <div class="bar-container">
      <div class="bar done" style="width: ${doneWidth}%"></div>
    </div>
    <p><strong>⬇ Received:</strong> ${(down / 1_000_000).toFixed(2)} MB</p>
    <div class="bar-container">
      <div class="bar received" style="width: 100%"></div>
    </div>
    <p><strong>Ratio:</strong> ${ratio.toFixed(2)}</p>
  `;
  sidebar.appendChild(auditCard);

  container.appendChild(sidebar);
  return container;
}

function createCard(bgColor, titleText) {
  const card = document.createElement("div");
  Object.assign(card.style, {
    backgroundColor: bgColor,
    borderRadius: "12px",
    padding: "15px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
  });

  const title = document.createElement("h4");
  title.textContent = titleText;
  title.style.marginBottom = "10px";
  card.appendChild(title);

  return card;
}
