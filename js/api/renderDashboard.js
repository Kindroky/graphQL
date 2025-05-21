import { renderXP } from './renderData.js';
import { renderSkills } from './renderData.js';

export function renderDashboard(userData, xpData, skillsData) {
  const container = document.createElement("div");
  container.className = "dashboard-grid";

  // === LEFT: XP GRAPH ===
  const xpCard = document.createElement("div");
  xpCard.className = "xp-section";
  const xpTitle = document.createElement("h3");
  xpTitle.textContent = "Graphique de l'XP";
  xpCard.appendChild(xpTitle);

  const graph = renderXP(xpData);
  if (!(graph instanceof Node)) {
    const error = document.createElement("p");
    error.textContent = "Erreur : graph invalide.";
    xpCard.appendChild(error);
  } else {
    xpCard.appendChild(graph);
  }
  container.appendChild(xpCard);

  // === RIGHT: PROFILE + AUDIT ===
  const sidebar = document.createElement("div");
  sidebar.className = "sidebar";

  // Déconnexion
  const logoutBtn = document.createElement("button");
  logoutBtn.className = "logout-btn";
  logoutBtn.textContent = "Se déconnecter";
  sidebar.appendChild(logoutBtn);

  // Profil
  const profileCard = document.createElement("div");
  profileCard.className = "profile-card";
  profileCard.innerHTML = `<h2>${userData.login}</h2>`;
  sidebar.appendChild(profileCard);

  // Audit (safe fallback)
  const up = userData.totalUp ?? 0;
  const down = userData.totalDown ?? 1;
  const ratio = userData.auditRatio ?? 1;
  const doneWidth = down > 0 ? (up / down) * 100 : 100;

  const auditCard = document.createElement("div");
  auditCard.className = "audit-card";
  auditCard.innerHTML = `
    <h3>Information d'audit</h3>
    <p><strong>⬆ Done</strong> ${(up / 1_000_000).toFixed(2)} MB</p>
    <div class="bar-container">
        <div class="bar done" style="width: ${doneWidth}%"></div>
    </div>
    <p><strong>⬇ Received</strong> ${(down / 1_000_000).toFixed(2)} MB</p>
    <div class="bar-container">
        <div class="bar received" style="width: 100%"></div>
    </div>
    <p><strong>ℹ Audit ratio</strong> ${ratio.toFixed(2)}</p>
  `;
  sidebar.appendChild(auditCard);

  container.appendChild(sidebar);
  return container;
}
