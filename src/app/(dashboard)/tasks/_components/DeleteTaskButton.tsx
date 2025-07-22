// app/(dashboard)/tasks/_components/DeleteTaskButton.tsx
'use client';

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
      className="text-red-600 hover:underline text-sm"
    >
      Deletar
    </button>
  );
}
