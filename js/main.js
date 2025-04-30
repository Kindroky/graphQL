import { login, createLoginForm } from './login.js';
import { fetchUserData } from './api/fetchData.js';
import { fetchXPData } from './api/fetchData.js';
import { transformXPData } from './api/processData.js';
import { renderXP } from './api/renderData.js';
import { fetchSkillsData } from './api/fetchData.js';
import { transformSkillsData } from './api/processData.js';
import { renderSkills } from './api/renderData.js'; // or wherever you keep it
//import { renderXPBarChart } from './components/renderXPBarChart.js'; 

window.addEventListener("DOMContentLoaded", () => {
    localStorage.removeItem("jwt"); // delete any saved session
    createLoginForm();              // show login form
});

// if logged in, create profile page
export async function createProfilePage() {
    try {
        const userData = await fetchUserData();
        console.log("User data fetched successfully:", userData);

        // Clear the page
        document.body.innerHTML = "";

        // Welcome title
        const welcome = document.createElement("h1");
        welcome.innerText = `Welcome, ${userData.login}!`;
        document.body.appendChild(welcome);

        // 1. Create the dashboard grid container
        const dashboard = document.createElement("div");
        dashboard.id = "dashboard";
        document.body.appendChild(dashboard);

        // 2. Fetch and transform XP data
        const rawXP = await fetchXPData();
        const xpData = transformXPData(rawXP);

        // 4. Wrap graph in a card and append to dashboard
        const card = document.createElement("div");

        const xpGraph = renderXP(xpData); // returns a div with SVG
        const xpCard = document.createElement("div");
        xpCard.classList.add("dashboard-card");
        xpCard.appendChild(xpGraph);
        dashboard.appendChild(xpCard);        

        const rawSkills = await fetchSkillsData();
        console.log("🟢 Raw progresses:", rawSkills);
        const skills = transformSkillsData(rawSkills);

        const skillCard = document.createElement("div");
        skillCard.classList.add("dashboard-card");
        console.log(skills)
        const skillContent = renderSkills(skills);
        skillCard.appendChild(skillContent);
        dashboard.appendChild(skillCard);

    } catch (error) {
      console.error("Failed to fetch user data:", error.message);
      sessionStorage.removeItem("jwt");
      document.body.innerHTML = "";
      createLoginForm();
    }
  }
  