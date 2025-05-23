/**
 * Fetches the user's profile data from the Zone01 GraphQL API.
 
 * - Reads the JWT token stored in localStorage after login.
 * - Sends a POST request to the GraphQL API with the token for authentication.
 * - The query asks for the user's ID and login.
 * - If the token is valid, the server returns the user's information.
 
 * -> It returns an object containing the user's id and login.
 */

const API_URL = "https://zone01normandie.org/api/graphql-engine/v1/graphql";

/**
 * Generic GraphQL request with token from sessionStorage.
 */
async function graphqlRequest(query) {
  const token = sessionStorage.getItem("jwt");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GraphQL request failed: ${error}`);
  }

  return await response.json();
}

/**
 * Fetch basic user information.
 */
export async function fetchUserData() {
  const query = `
    {
      user {
        login
        totalUp
        totalDown
        auditRatio
      }
    }
  `;

  const data = await graphqlRequest(query);
  return data.data.user[0];
}

/**
 * Fetch all XP transactions.
 */
export async function fetchXPData() {
  const query = `
    {
      transaction(where: { type: { _eq: "xp" } }) {
        amount
        createdAt
        path
      }
    }
  `;

  const data = await graphqlRequest(query);
  return data.data.transaction;
}

/**
 * Fetch validated skill progresses.
 */
export async function fetchSkillsData() {
  const query = `
    {
      user {
        progresses(where: { path: { _like: "%skill-%" }, isDone: { _eq: true } }) {
          path
          grade
          createdAt
        }
      }
    }
  `;

  const data = await graphqlRequest(query);
  const user = data.data?.user?.[0];

  if (!user) {
    throw new Error("Skill data is malformed or missing");
  }

  return user.progresses;
}
