import { createLoginForm } from './login.js';
import { fetchUserData, fetchXPData } from './api/fetchData.js';
import { transformXPData } from './processData.js';
import { renderDashboard } from './render/renderDashboard.js';

window.addEventListener("DOMContentLoaded", () => {
  sessionStorage.removeItem("jwt");
  createLoginForm();
});

export async function createProfilePage() {
  try {
    const userData = await fetchUserData();
    const rawXP = await fetchXPData();
    const xpData = transformXPData(rawXP);

    document.body.innerHTML = ""; // Clear login form
    const dashboard = renderDashboard(userData, xpData);
    document.body.appendChild(dashboard);
  } catch (error) {
    console.error("Erreur chargement profil:", error.message);
    sessionStorage.removeItem("jwt");
    document.body.innerHTML = "";
    createLoginForm();
  }
}
