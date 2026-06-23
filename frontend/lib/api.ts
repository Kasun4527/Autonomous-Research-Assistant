export async function research(topic: string) {
  const response = await fetch("http://localhost:8000/research", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
  });

  if (!response.ok) {
    throw new Error("Research failed");
  }

  return response.json();
}