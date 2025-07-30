"use client";

import { useRouter } from "next/navigation"; // ✅ CORRETO no App Router
import { useState } from "react";

export const CreateDocument = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCreateDocument = async () => {
        // Implement the logic to create a new document
        setLoading(true);
        try {
            const response = await fetch("/api/document/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to create document");
            }

            const data = await response.json();
            console.log("Document created successfully:", data);
            setLoading(false);
            router.push(`/documents/${data.id}`); // Redirect to the new document page
        } catch (error) {
            console.error("Error creating document:", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <button
        disabled={loading}
        onClick={handleCreateDocument}
        className="fixed bottom-4 right-3 z-50 px-4 py-2 bg-blue-600 text-white font-bold rounded-sm hover:bg-blue-700"
        >
            <span>{loading ? "Criando..." : "Criar Documento"}</span>
        </button>
    );
}