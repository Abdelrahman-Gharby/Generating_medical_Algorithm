
const BASE_URL = "http://localhost:8000/api";

const login = async (email, password) => {
  const response = await fetch(`${BASE_URL}/accounts/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    let errorText = "Login failed";
    try {
      const data = await response.json();
      errorText =
        data.non_field_errors?.join(" ") ||
        data.detail ||
        Object.values(data).flat().join(" ") ||
        errorText;
    } catch {
      errorText = await response.text();
    }
    throw new Error(errorText);
  }

  return response.json();
};

const signup = async (payload) => {
  const response = await fetch(`${BASE_URL}/accounts/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
   // ----- improved error extraction -----
    let errorText = "Registration failed";
    try {
      const data = await response.json();

      // Recursively collect every string inside the JSON payload
      const collect = (v) => {
        if (!v) return [];
        if (typeof v === "string") return [v];
        if (Array.isArray(v)) return v.flatMap(collect);
        if (typeof v === "object") return Object.values(v).flatMap(collect);
        return [];
      };

      const messages = collect(data);
      if (messages.length) errorText = messages.join(" ");
    } catch {
      errorText = await response.text();
    }
    throw new Error(errorText);
  }

  return response.json();
};



const logout = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  const accessToken = localStorage.getItem("access_token");

  if (!refreshToken || !accessToken) {
    throw new Error("Missing tokens for logout");
  }

  const response = await fetch(`${BASE_URL}/accounts/logout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Logout failed: ${errorText}`);
  }

};

export { logout, login, signup };
