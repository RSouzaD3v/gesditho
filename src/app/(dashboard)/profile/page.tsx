import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "../../lib/db";
import { redirect } from "next/navigation";
import { UpdateProfileForm } from "./_components/UpdateProfileForm";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return <p>Usuário não encontrado.</p>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Meu Perfil</h1>

      <div className="space-y-2 mb-6">
        <p><strong>Nome:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <UpdateProfileForm userId={user.id} name={user.name || ""} />
    </div>
  );
}
