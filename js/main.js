import { login, createLoginForm } from './login.js';
import { fetchUserData } from './api.js';

// When the page loads
window.addEventListener("DOMContentLoaded", () => {
    // Check if user already has a JWT
    const token = localStorage.getItem("jwt");

    if (token) {
        console.log("User already logged in, fetching profile...");
        createProfilePage();
    } else {
        console.log("No token found, showing login form...");
        createLoginForm();
    }
});

// if logged in, create profile page
async function createProfilePage() {
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
        // If token is invalid, clear localStorage and show login again
        localStorage.removeItem("jwt");
        document.body.innerHTML = "";
        createLoginForm();
    }
}
