const BASE_URL ="http://localhost:8000/api";

const jsonHeaders = { "Content-Type": "application/json" };

const authHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handle = async (response) => {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `HTTP ${response.status}`);
  }
  return response.status === 204 ? null : response.json();
};


export const getComments = (algorithmId) =>
  fetch(`${BASE_URL}/comments/?algorithm=${algorithmId}`, {
    headers: { ...authHeader() },
  }).then(handle);

export const addComment = ({ text, parentId, algorithmId }) =>
  fetch(`${BASE_URL}/comments/`, {
    method: "POST",
    headers: { ...jsonHeaders, ...authHeader() },
    body: JSON.stringify({ text, parent: parentId, algorithm: algorithmId }),
  }).then(handle);

export const likeComment = ({ commentId, likes }) =>
  fetch(`${BASE_URL}/comments/${commentId}/`, {
    method: "PATCH",
    headers: { ...jsonHeaders, ...authHeader() },
    body: JSON.stringify({ likes }),
  }).then(handle);

export const editComment = ({ commentId, newText }) =>
  fetch(`${BASE_URL}/comments/${commentId}/`, {
    method: "PATCH",
    headers: { ...jsonHeaders, ...authHeader() },
    body: JSON.stringify({ text: newText }),
  }).then(handle);

export const deleteComment = (commentId) =>
  fetch(`${BASE_URL}/comments/${commentId}/`, {
    method: "DELETE",
    headers: authHeader(),
  }).then(handle);
