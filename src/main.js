import { createLoginForm } from './login.js';
import { fetchUserData, fetchXPData } from './api/fetchData.js';
import { transformXPData } from './processData.js';
import { renderDashboard } from './render/renderDashboard.js';

window.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {
  sessionStorage.removeItem("jwt");
  document.body.innerHTML = "";
  createLoginForm();
}

export async function createProfilePage() {
  try {
    const userData = await fetchUserData();
    const rawXP = await fetchXPData();
    const xpData = transformXPData(rawXP);

    document.body.innerHTML = "";
    const dashboard = renderDashboard(userData, xpData, rawXP); // 👈 Pass rawXP here
    document.body.appendChild(dashboard);
  } catch (error) {
    console.error("Erreur lors du chargement du profil:", error.message);
    sessionStorage.removeItem("jwt");
    initializeApp();
  }
}
