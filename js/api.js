/**
 * Fetches the user's profile data from the Zone01 GraphQL API.
 
 * - Reads the JWT token stored in localStorage after login.
 * - Sends a POST request to the GraphQL API with the token for authentication.
 * - The query asks for the user's ID and login.
 * - If the token is valid, the server returns the user's information.
 
 * -> It returns an object containing the user's id and login.
 */

export async function fetchUserData() {
    //get the token that we stored after login
    const token = localStorage.getItem("jwt");

    //fetch user data thanks to the jwt token
    const response = await fetch("https://zone01normandie.org/api/graphql-engine/v1/graphql", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `
              {
                user {
                  id
                  login
                }
              }
            `
        })
    })

    if (!response.ok) {
        throw new Error("Failed to fetch user data");
    }

    const user_data = await response.json();

    //return the data of the first user : me
    return user_data.data.user[0];
};
