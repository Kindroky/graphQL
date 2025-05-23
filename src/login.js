import { createProfilePage } from './main.js';

//Create the login form dynamically
export function createLoginForm() {
  // Clear the body in case we're coming from another view
  document.body.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.id = "login-wrapper";
  Object.assign(wrapper.style, {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#fbd4d9",
    fontFamily: "Arial, sans-serif"
  });

  const form = document.createElement("form");
  form.id = "login-form";
  Object.assign(form.style, {
    display: "flex",
    flexDirection: "column",
    padding: "30px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#4CAF50",
    minWidth: "300px"
  });

  const title = document.createElement("h2");
  title.innerText = "Welcome to graphZ01! In just a moment you will be able to see your data! Enter your credentials please.";
  Object.assign(title.style, {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333"
  });

  const usernameInput = document.createElement("input");
  Object.assign(usernameInput, {
    type: "text",
    id: "credentials",
    placeholder: "Username or Email",
    required: true
  });
  styleInput(usernameInput);

  const passwordInput = document.createElement("input");
  Object.assign(passwordInput, {
    type: "password",
    id: "password",
    placeholder: "Password",
    required: true
  });
  styleInput(passwordInput);

  const submitButton = document.createElement("button");
  Object.assign(submitButton, {
    type: "submit",
    innerText: "Login"
  });
  Object.assign(submitButton.style, {
    padding: "10px",
    backgroundColor: "#fbd4d9",
    color: "black",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  });
  submitButton.addEventListener("mouseover", () => {
    submitButton.style.backgroundColor = "#d8a9af";
  });
  submitButton.addEventListener("mouseout", () => {
    submitButton.style.backgroundColor = "#fbd4d9";
  });

  form.append(title, usernameInput, passwordInput, submitButton);
  wrapper.appendChild(form);
  document.body.appendChild(wrapper);

  form.addEventListener("submit", handleLoginSubmit);
}

function styleInput(input) {
  Object.assign(input.style, {
    marginBottom: "15px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px"
  });
}

async function handleLoginSubmit(event) {
  event.preventDefault();

  const username = document.getElementById("credentials").value;
  const password = document.getElementById("password").value;

  try {
    const token = await login(username, password);
    console.log("Logged in successfully. JWT:", token);
    document.body.innerHTML = ""; // Clear before showing dashboard
    await createProfilePage();
  } catch (error) {
    console.error("Login error:", error.message);
    showLoginError("Login failed. Please check your credentials.");
  }
}

function showLoginError(message) {
  let errorMessage = document.getElementById("error-message");
  if (!errorMessage) {
    errorMessage = document.createElement("p");
    errorMessage.id = "error-message";
    errorMessage.style.color = "red";
    errorMessage.style.marginTop = "10px";
    document.getElementById("login-form").appendChild(errorMessage);
  }
  errorMessage.innerText = message;
}

export async function login(username, password) {
  const encoded = btoa(`${username}:${password}`);

  const response = await fetch("https://zone01normandie.org/api/auth/signin", {
    method: "POST",
    headers: { "Authorization": `Basic ${encoded}` }
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  let token = await response.text();
  token = token.replace(/^"|"$/g, '');
  sessionStorage.setItem("jwt", token);

  return token;
}
