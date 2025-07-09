
const BASE_URL = "http://localhost:8000/api";

const DASH_ENDPOINT = `${BASE_URL}/dashboard/`;
const DETAIL_ENDPOINT = (id) => `${BASE_URL}/dashboard/${id}/`;
const REFRESH_ENDPOINT = `${BASE_URL}/accounts/token/refresh/`;

const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) return null;

  const res = await fetch(REFRESH_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return null;
  }

  const data = await res.json();           // { access: "new‑jwt", ... }
  localStorage.setItem("access_token", data.access);
  return data.access;
};

const fetchWithToken = async () => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token");

  return fetch(DASH_ENDPOINT, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAlgorithms = async () => {
  let res = await fetchWithToken();

  // Try one silent refresh on 401
  if (res.status === 401) {
    const ok = await refreshAccessToken();
    if (!ok) throw new Error("Session expired. Please log in again.");
    res = await fetchWithToken();
  }

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `Dashboard request failed (${res.status})`);
  }

  return res.json();
};



export const deleteAlgorithm = async (id) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token");

  let res = await fetch(DETAIL_ENDPOINT(id), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  // silent refresh if needed
  if (res.status === 401) {
    const ok = await refreshAccessToken();
    if (!ok) throw new Error("Session expired");
    res = await fetch(DETAIL_ENDPOINT(id), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
  }

  if (res.status !== 204) {
    const txt = await res.text();
    throw new Error(txt || `Delete failed (${res.status})`);
  }
};
