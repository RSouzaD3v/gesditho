"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function formatDateTimeLocal(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function EditTaskForm({ params }: { params: Promise<{id: string}>}) {
  const [title, setTitle] = useState("carregando...");
  const [type, setType] = useState("hoje");
  const [date, setDate] = useState(() => {
    const now = new Date();
    const formatted = formatDateTimeLocal(now);
    return formatted;
  });
  const [priority, setPriority] = useState("1");
  const [estimatedTime, setEstimatedTime] = useState(() => {
    const now = new Date();
    const formatted = formatDateTimeLocal(now);
    return formatted;});
  const [idParams, setIdParams] = useState("0");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

    useEffect(() => {
        const fetchConsultation = async () => {
            const { id } = await params;
            setIdParams(id);

            try {
              const response = await fetch(`/api/tasks/get-by-id/${id}`, {
                method: 'GET'
              });

              const data = await response.json();

              setType(data.task.type)
              setTitle(data.task.title)
              setDate(formatDateTimeLocal(new Date(data.task.date)));
              setEstimatedTime(formatDateTimeLocal(new Date(data.task.estimatedTime)));
            } catch (e) {
              console.log(e);
            }
        }

        fetchConsultation();
    }, [params]);

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch(`/api/tasks/update/${idParams}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, type, date, priority, estimatedTime }),
      });

      router.push(`/tasks`);
    } catch (error) {
      console.error("Erro ao atualizar a tarefa:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-bold text-4xl">Editar a tarefa:</h1>
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
        {loading ? "Atualizando..." : "Atualizar Tarefa"}
      </button>
    </form>
  );
}