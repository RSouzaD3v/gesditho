"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export const CompletedButton = ({ taskId }: { taskId: number }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/tasks/completed/${taskId}`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Erro ao completar a tarefa");
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Erro ao completar a tarefa:", error);
      alert("Não foi possível completar a tarefa. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleComplete}
      disabled={isLoading || isPending}
      className={`px-4 py-2 cursor-pointer rounded font-medium text-white transition ${
        isLoading || isPending
          ? "bg-green-400 cursor-not-allowed"
          : "bg-green-600 hover:bg-green-700"
      }`}
    >
      {isLoading || isPending ? "Concluindo..." : "Concluir"}
    </button>
  );
};
