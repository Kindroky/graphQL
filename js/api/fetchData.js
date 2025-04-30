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
    const token = sessionStorage.getItem("jwt");

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
        throw new Error("Failed to fetch user data (id and login)");
    }    

    const user_data = await response.json();
    console.log(user_data);
    //return the data of the first user : me

    return user_data.data.user[0]; 
};

export async function fetchXPData() {
    const token = sessionStorage.getItem("jwt");
    const response = await fetch("https://zone01normandie.org/api/graphql-engine/v1/graphql", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `
              {
                transaction(where: { type: { _eq: "xp" } }) {
                  amount
                  createdAt
                  path
                }
              }
            `
        })
    });
    if (!response.ok) {
        throw new Error("Failed to fetch user data (XP)");
    }

    const user_xp = await response.json();
    console.log(user_xp);
    //return the data of the first user : me

    return user_xp.data.transaction; 
}

export async function fetchData() {
  const token = sessionStorage.getItem("jwt");
  const response = await fetch("https://zone01normandie.org/api/graphql-engine/v1/graphql", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
          query: `
            {
              transaction(where: { type: { _eq: "xp" } }) {
                amount
                createdAt
                path
              }
            }
          `
      })
  });
  if (!response.ok) {
      throw new Error("Failed to fetch user data (XP)");
  }

  const user_xp = await response.json();
  console.log(user_xp);
  //return the data of the first user : me

  return user_xp.data.transaction; 
}

export async function fetchSkillsData() {
  const token = sessionStorage.getItem("jwt");

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
            progresses(where: { path: { _like: "%skill-%" }, isDone: { _eq: true } }) {
              path
              grade
              createdAt
            }
          }
        }
      `
    })
  });

  if (!response.ok) throw new Error("Network error while fetching skills");

  const result = await response.json();

  if (!result.data || !result.data.user || !result.data.user[0]) {
    console.error("GraphQL result error:", result);
    throw new Error("Skill data is malformed or missing");
  }

  return result.data.user[0].progresses;
}

