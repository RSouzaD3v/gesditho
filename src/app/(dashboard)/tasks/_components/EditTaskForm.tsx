'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export function EditTaskForm({ id }: { id: string | number }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("hoje");
  const [date, setDate] = useState(() => {
    const now = new Date();
    // Formata para 'YYYY-MM-DDTHH:mm' para o input datetime-local
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formatted = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    return formatted;
  });
  const [priority, setPriority] = useState("1");
  const [estimatedTime, setEstimatedTime] = useState(() => {
    const now = new Date();
    // Formata para 'YYYY-MM-DDTHH:mm' para o input datetime-local
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formatted = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    return formatted;});
  const [owner, setOwner] = useState("Equipe");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await fetch(`/api/tasks/update/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, type, date, owner, priority, estimatedTime }),
    });

    setLoading(false);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="border px-3 py-2 rounded w-full"
        type="text"
        placeholder="Título da tarefa"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <select
        className="border px-3 py-2 rounded w-full"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="hoje">Criada Hoje</option>
        <option value="agendada">Agendada</option>
        <option value="rotineira">Rotineira</option>
        <option value="pendente">Pendente</option>
      </select>

      <select
        className="border px-3 py-2 rounded w-full"
        value={owner}
        onChange={(e) => setOwner(e.target.value)}
      >
        <option value="Rafael">Rafael</option>
        <option value="Thomas">Thomas</option>
        <option value="Equipe">Equipe</option>
        <option value="Terceiros">Terceiros</option>
      </select>

      <div>
        <h2>Prioridade: </h2>
        <select
          className="border px-3 py-2 rounded w-full"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>

      <div>
        <h2>Data: </h2>
        <input
          className="border px-3 py-2 rounded w-full"
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div>
        <h2>Data de entrega: </h2>
        <input
          className="border px-3 py-2 rounded w-full"
          type="datetime-local"
          value={estimatedTime}
          onChange={(e) => setEstimatedTime(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Criando..." : "Criar Tarefa"}
      </button>
    </form>
  );
}