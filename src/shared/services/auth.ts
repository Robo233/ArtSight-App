export const isAuthenticatedOrGuest = async (
) => {
  const authToken = localStorage.getItem("authToken");
  const isGuest = localStorage.getItem("isGuest");

  let isAuthenticated = false;

  if (authToken || isGuest === "true") {
    isAuthenticated = true;
  } else {
    isAuthenticated = false;  }
  return isAuthenticated;
};

export const isAuthenticated = () => {
  return localStorage.getItem("authToken") != null;
};
