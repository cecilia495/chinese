export async function saveLearning(input: object) {
  const response = await fetch("/api/learning", {
    method: "POST",
    keepalive: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error("Learning record unavailable");
}
