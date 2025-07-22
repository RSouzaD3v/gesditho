'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  name: string;
}

export function UpdateProfileForm({ userId, name }: Props) {
  const [newName, setNewName] = useState(name);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/profile/update", {
      method: "POST",
      body: JSON.stringify({ userId, name: newName }),
      headers: { "Content-Type": "application/json" },
    });

    setLoading(false);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="text-sm text-gray-700">Alterar Nome</span>
        <input
          type="text"
          className="mt-1 block w-full border rounded px-3 py-2"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      </label>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
