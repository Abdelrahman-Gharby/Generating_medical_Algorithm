export async function fetchAlgorithm(diseaseName) {
  const response = await fetch("http://localhost:8000/api/generation/generate/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ disease_name: diseaseName })
  });

  if (!response.ok) {
    throw new Error("Failed to fetch algorithm");
  }

  return await response.json();
}