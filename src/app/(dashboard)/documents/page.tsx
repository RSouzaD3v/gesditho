export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { CreateDocument } from "./_components/CreateDocument";

export default async function DocumentsPage() {
  const documents = await db.documentation.findMany();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">📄 Documentos</h1>
        <ul className="space-y-6">
          {documents.length > 0 && documents.map((doc) => (
            <li
              key={doc.id}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">{doc.title}</h2>
              <p className="text-gray-700">{doc.content.length > 23 ? doc.content.slice(0, 20) + "..." : doc.content}</p>
            </li>
          ))}

          {documents.length === 0 && (
            <li className="p-6">
              <p className="text-gray-700">Nenhum documento encontrado.</p>
            </li>
          )}
        </ul>

        <CreateDocument />
      </div>
    </div>
  );
}
