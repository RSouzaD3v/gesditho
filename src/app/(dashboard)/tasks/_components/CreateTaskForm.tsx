"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export function CreateTaskForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("hoje");
  const [priority, setPriority] = useState("1");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formatNow = () => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  };

  const [date, setDate] = useState(formatNow());
  const [estimatedTime, setEstimatedTime] = useState(formatNow());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/tasks/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        type,
        date,
        priority,
        estimatedTime,
      }),
    });

    setLoading(false);
    setIsOpen(false);
    router.refresh();
  };

  return (
    <section>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fadeIn">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative space-y-4"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
              aria-label="Fechar"
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold text-center mb-2">
              Criar Nova Tarefa
            </h2>

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
              <option value="hoje">Hoje</option>
              <option value="agendada">Agendada</option>
              <option value="rotineira">Rotineira</option>
            </select>

            <div>
              <label className="block text-sm font-medium mb-1">Prioridade:</label>
              <select
                className="border px-3 py-2 rounded w-full"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Data:</label>
              <input
                className="border px-3 py-2 rounded w-full"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Data de entrega:</label>
              <input
                className="border px-3 py-2 rounded w-full"
                type="datetime-local"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
              disabled={loading}
            >
              {loading ? "Criando..." : "Criar Tarefa"}
            </button>
          </form>
        </div>
      )}

      {/* Botão flutuante */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 bg-blue-600 hover:bg-blue-700 text-white text-xl w-14 h-14 rounded-full shadow-md flex items-center justify-center z-40"
        title="Criar Nova Tarefa"
      >
        +
      </button>
    </section>
  );
}
