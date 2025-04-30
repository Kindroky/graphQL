import { createProfilePage } from './main.js';
import { setJWT } from './session.js';


//create login form 

function createLoginForm() {
    const form = document.createElement("form");
    form.id = "login-form";

    const usernameInput = document.createElement("input") ;
    usernameInput.type = "text";
    usernameInput.id = "credentials";
    usernameInput.placeholder = "Username or Email";
    usernameInput.required = true;

    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.id = "password";
    passwordInput.placeholder = "Password";
    passwordInput.required = true;

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.innerText = "Login";

    form.appendChild(usernameInput);
    form.appendChild(passwordInput);
    form.appendChild(submitButton);

    document.body.appendChild(form);

    // Add the event listener to handle login
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

    setJWT(token);

    return token;
  }

export {createLoginForm}