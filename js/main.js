import { login, createLoginForm } from './login.js';
import { fetchUserData } from './api/fetchData.js';
import { fetchXPData } from './api/fetchData.js';
import { transformXPData } from './api/processData.js';
import { renderXP } from './api/renderData.js';
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

        // Create the profile page dynamically
        const welcome = document.createElement("h1");
        welcome.innerText = `Welcome, ${userData.login}!`;
        document.body.appendChild(welcome);

        // ADD OTHER SECTIONS LATER: XP, audits, skills, graphs...

    } catch (error) {
        console.error("Failed to fetch user data:", error.message);
        sessionStorage.removeItem("jwt");
        document.body.innerHTML = "";
        createLoginForm();
    }

    // 1. Fetch XP transactions
    const rawXP = await fetchXPData();
    console.log("raw data", rawXP )
    // 2. Transform data for the graph
    const xpData = transformXPData(rawXP);
    console.table(xpData);
    // 3. render data
    renderXP(xpData)

}
