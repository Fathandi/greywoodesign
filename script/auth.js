const host =
  location.hostname === "127.0.0.1" ? "localhost" : location.hostname;
const API_BASE_URL = `https://api.${host}/api`;


async function validateAuthToken(token) {
  try {
    const res = await fetch(`${API_BASE_URL}/verify-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const result = await res.json();
    return result.success;
  } catch (err) {
    return false;
  }
}


async function validateUserFromLocalStorage() {
  const userStr = localStorage.getItem("user");
  const token = localStorage.getItem("authToken");

  if (!userStr || !token) return;

  try {
    const { username, email } = JSON.parse(userStr);

    const userRes = await fetch(`${API_BASE_URL}/verify-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, email }),
    });

    const userData = await userRes.json();
    const tokenValid = await validateAuthToken(token);

    if (!userData.success || !tokenValid) {
      console.warn("🔐 Session invalid. Logging out...");
      logout();
    } else {
      console.log("✅ Auth success. Session valid.");
    }

  } catch (err) {
    console.error("Validation failed:", err.message);
    logout();
  }
}
