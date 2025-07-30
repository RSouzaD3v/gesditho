// app/(dashboard)/tasks/_components/DeleteTaskButton.tsx
'use client';
import { Trash2 } from "lucide-react";

import { useRouter } from "next/navigation";

export function DeleteTaskButton({ id }: { id: string | number }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirm = window.confirm("Tem certeza que deseja excluir esta tarefa?");
    if (!confirm) return;

    await fetch(`/api/tasks/delete/${id}`, {
      method: "DELETE",
    });

    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 hover:bg-red-700 flex items-center gap-1 p-2 text-sm text-white rounded cursor-pointer transition"
    >
      <Trash2 className="inline mr-1" /> <span className="md:block hidden">Deletar</span>
    </button>
  );
}
