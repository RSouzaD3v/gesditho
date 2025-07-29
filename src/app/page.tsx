// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-700 to-blue-500 text-white px-6">
      <h1 className="text-4xl sm:text-5xl font-bold mb-4">Gestditho</h1>
      <p className="text-center text-lg sm:text-xl max-w-xl mb-8">
        Plataforma interna de gestão de tarefas, produtividade e equipes.
      </p>
      <Link
        href="/api/auth/signin"
        className="bg-white text-blue-700 px-6 py-3 rounded-md font-semibold shadow hover:bg-gray-100 transition"
      >
        Entrar
      </Link>
    </main>
  );
}
