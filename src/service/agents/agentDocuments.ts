// src/service/agents/agentDocuments.ts
export async function AgentDocument(prompt: string): Promise<string> {
  const res = await fetch("/api/agents/document", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    throw new Error("Erro ao obter resposta da IA");
  }

  const data = await res.json();
  return data.result;
}