"use client";

import { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import { AgentDocument } from "@/service/agents/agentDocuments";

export default function EditTaskForm({ params }: { params: Promise<{ id: string }> }) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [openPrompt, setOpenPrompt] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [idParams, setIdParams] = useState("");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchConsultation = async () => {
      const { id } = await params;
      setIdParams(id);

      try {
        const response = await fetch(`/api/document/${id}`);
        if (!response.ok) throw new Error("Failed to fetch document");
        const data = await response.json();
        setContent(data.content || "");
        setTitle(data.title || "");
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchConsultation();
  }, [params]);

  // Atalho Ctrl + K para IA
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpenPrompt((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  // Debounced save
  useEffect(() => {
    if (!idParams) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      saveDocument();
    }, 800);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [title, content, idParams]);

  const saveDocument = async () => {
    try {
      const response = await fetch(`/api/document/update/${idParams}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) throw new Error("Failed to update document");

      console.log("✔ Documento salvo");
    } catch (error) {
      console.error("Erro ao salvar documento:", error);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const margin = 40;
    const maxLineWidth = 500;

    const lines = doc.splitTextToSize(content, maxLineWidth);
    doc.setFontSize(18);
    doc.text(title || "Documento", margin, 60);
    doc.setFontSize(12);
    doc.text(lines, margin, 100);
    doc.save(`${title || "documento"}.pdf`);
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const value = await AgentDocument(prompt);
      setContent(value as string);
      setPrompt("");
      setOpenPrompt(false);
    } catch (error) {
      console.error("Erro ao gerar conteúdo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-4 space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="py-5 text-4xl font-bold rounded w-full focus:outline-none"
        placeholder="Título do documento"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="py-5 rounded w-full min-h-[500px] focus:outline-none"
        placeholder="Conteúdo do documento"
      />

      {(content.length > 0 && title.length > 0) && (
        <button
          onClick={exportToPDF}
          className="mt-4 px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
        >
          Exportar para PDF
        </button>
      )}

      {openPrompt && (
        <div className="fixed z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm w-full h-screen top-0 left-0">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Gerar conteúdo com IA</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="border p-3 rounded w-full focus:outline-none text-lg"
                placeholder="Digite seu prompt..."
              />
              <div className="flex gap-2">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Gerando..." : "Gerar"}
                </button>
                <button
                  onClick={() => setOpenPrompt(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded font-bold hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
