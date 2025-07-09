const BASE_URL = "http://localhost:8000/api";

export const convertImage = async (file) => {
  const body = new FormData();
  body.append("image", file);

  const res = await fetch(`${BASE_URL}/generation/convert-image/`, {
    method: "POST",
    body,
  });

  if (!res.ok) {
    let msg = `Server error (${res.status})`;
    try {
      const data = await res.json();
      msg = data.detail || data.error || msg;
    } catch {
      msg = (await res.text()) || msg;
    }
    throw new Error(msg);
  }

  return res.json();
};