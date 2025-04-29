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
    const token = await response.text();

    //store it in local storage
    localStorage.setItem("jwt", token);

    return token;
  }

