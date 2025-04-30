let jwt = null;

export function setJWT(token) {
  jwt = token;
}

export function getJWT() {
  return jwt;
}
