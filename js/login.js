import { createProfilePage } from './main.js';

//create login form dynamically
function createLoginForm() {
    const wrapper = document.createElement("div");
    wrapper.id = "login-wrapper";
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.alignItems = "center";
    wrapper.style.justifyContent = "center";
    wrapper.style.height = "100vh";
    wrapper.style.backgroundColor = "#fbd4d9";
    wrapper.style.fontFamily = "Arial, sans-serif";

    const form = document.createElement("form");
    form.id = "login-form";
    form.style.display = "flex";
    form.style.flexDirection = "column";
    form.style.padding = "30px";
    form.style.border = "1px solid #ccc";
    form.style.borderRadius = "8px";
    form.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
    form.style.backgroundColor = "#4CAF50";
    form.style.minWidth = "300px";

    const title = document.createElement("h2");
    title.innerText = "Welcome!";
    title.style.textAlign = "center";
    title.style.marginBottom = "20px";
    title.style.color = "#333";

    const usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.id = "credentials";
    usernameInput.placeholder = "Username or Email";
    usernameInput.required = true;
    usernameInput.style.marginBottom = "15px";
    usernameInput.style.padding = "10px";
    usernameInput.style.border = "1px solid #ccc";
    usernameInput.style.borderRadius = "5px";

    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.id = "password";
    passwordInput.placeholder = "Password";
    passwordInput.required = true;
    passwordInput.style.marginBottom = "15px";
    passwordInput.style.padding = "10px";
    passwordInput.style.border = "1px solid #ccc";
    passwordInput.style.borderRadius = "5px";

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.innerText = "Login";
    submitButton.style.padding = "10px";
    submitButton.style.backgroundColor = "#fbd4d9";
    submitButton.style.color = "black";
    submitButton.style.border = "none";
    submitButton.style.borderRadius = "5px";
    submitButton.style.cursor = "pointer";

    submitButton.addEventListener("mouseover", () => {
        submitButton.style.backgroundColor = "#d8a9af";
    });
    submitButton.addEventListener("mouseout", () => {
        submitButton.style.backgroundColor = "#fbd4d9";
    });

    form.appendChild(title);
    form.appendChild(usernameInput);
    form.appendChild(passwordInput);
    form.appendChild(submitButton);

    wrapper.appendChild(form);
    document.body.appendChild(wrapper);

    form.addEventListener("submit", handleLoginSubmit);
}


//manage login logic and errors
async function handleLoginSubmit(event) {
    event.preventDefault();

    const username = document.getElementById("credentials").value;
    const password = document.getElementById("password").value;

    try {
        const token = await login(username, password);
        console.log("Logged in successfully. JWT:", token);
        await createProfilePage();

        // After login, we will switch to profile page later
        // Example: createProfilePage();

    } catch (error) {
        console.error("Error:", error.message);

        // Show error dynamically
        let errorMessage = document.getElementById("error-message");

        if (!errorMessage) {
            errorMessage = document.createElement("p");
            errorMessage.id = "error-message";
            errorMessage.style.color = "red";
            errorMessage.style.marginTop = "10px";

            const form = document.getElementById("login-form");
            form.appendChild(errorMessage);
        }

        errorMessage.innerText = "Login failed. Please check your credentials.";
    }
}


/**
 * Fetches the user's JWT token using his or her credentials.
 
 * - encodes the credentials given to fit basic auth
 * - Sends a POST request to the login Zone01 API with the credentials encoded.
 * - If the token is valid, the server returns the JSON Web Token (jwt) associated with this user (that we will use to access his or her personnal data).
 * - Stores the jwt token thanks to the built-in js function localStorage
 
 * -> Returns the token.
 */

export async function login(username, password) {
    // encode username:password
    const encodedCredentials = btoa(`${username}:${password}`);

    //send fetch request
    const response = await fetch("https://zone01normandie.org/api/auth/signin", {
        method: "POST",
        headers: {
            "Authorization": `Basic ${encodedCredentials}`
        }
    });

    if (!response.ok) {
        throw new Error("Login failed")
    }

    //get the token
    let token = await response.text();
    token = token.replace(/^"|"$/g, '');

    sessionStorage.setItem("jwt", token);
    //save it for this session

    return token;
  }

export {createLoginForm}