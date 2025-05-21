import { createLoginForm } from './login.js';
import { fetchUserData, fetchXPData, fetchSkillsData } from './api/fetchData.js';
import { transformXPData, transformSkillsData } from './api/processData.js';
import { renderDashboard } from './api/renderDashboard.js';

window.addEventListener("DOMContentLoaded", () => {
  sessionStorage.removeItem("jwt");
  createLoginForm();
});

export async function createProfilePage() {
  try {
    const userData = await fetchUserData();
    const rawXP = await fetchXPData();
    const xpData = transformXPData(rawXP);
    const rawSkills = await fetchSkillsData();
    const skills = transformSkillsData(rawSkills);

    document.body.innerHTML = ""; // Clear login form
    const dashboard = renderDashboard(userData, xpData, skills);
    document.body.appendChild(dashboard);
  } catch (error) {
    console.error("Erreur chargement profil:", error.message);
    sessionStorage.removeItem("jwt");
    document.body.innerHTML = "";
    createLoginForm();
  }
}
