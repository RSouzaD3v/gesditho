import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "../../lib/db";
import { format } from "date-fns";
import { CreateTaskForm } from "./_components/CreateTaskForm";
import { DeleteTaskButton } from "./_components/DeleteTaskButton";
import Link from "next/link";
import { CompletedButton } from "./_components/CompletedButton";

export default async function TasksPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) return null;

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return <p>Usuário não encontrado.</p>;

  const today = new Date();
  const tasks = await db.task.findMany({
    where: {},
    orderBy: { createdAt: "desc" },
  });

  const grouped = {
    pendentes: tasks.filter((t) => t.type === "pendente"),
    agendadas: tasks.filter((t) => t.type === "agendada"),
    rotineiras: tasks.filter((t) => t.type === "rotineira"),
    hoje: tasks.filter(
      (t) =>
        t.type === "hoje" &&
        format(t.createdAt, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
    ),
  };

  const dueDate = (dateEstimated: Date | string, isCompleted: boolean) => {
    const estimatedDate = new Date(dateEstimated);
    const now = new Date();

    if (!isCompleted && now > estimatedDate) {
      return 'Atrasada';
    } else if (isCompleted && now <= estimatedDate) {
      return 'Adiantado';
    } else if (isCompleted && now > estimatedDate) {
      return 'Concluída';
    }

    return 'Em Andamento';
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Minhas Tarefas</h1>

      {Object.entries(grouped).map(([tipo, lista]) => (
        <div key={tipo}>
          <h2 className="text-lg font-semibold capitalize">{tipo}</h2>
          <ul className="space-y-2 mt-2">
            {lista.length > 0 ? (
              lista.map((tarefa) => (
                <li key={tarefa.id} className="p-4 bg-white rounded shadow">
                  <p className="font-medium">{tarefa.title}</p>
                  <p className="font-medium">Prioridade: {tarefa.priority}</p>
                  <p className="text-sm text-gray-500">
                    Criada em {format(tarefa.createdAt, "dd/MM/yyyy")}
                  </p>
                  {tarefa.isCompleted ? (
                    <p className="text-green-600">Concluída</p>
                  ) : (
                    <p className="text-red-600">Não concluída</p>
                  )}
                  {tarefa.comment && (
                    <p className="text-sm mt-1 italic">Comentário: {tarefa.comment}</p>
                  )}

                  {tarefa.estimatedTime && (
                    <p className="text-sm mt-1">
                      Prazo: {format(new Date(tarefa.estimatedTime), "dd/MM/yyyy")} - {dueDate(tarefa.estimatedTime, tarefa.isCompleted)}
                    </p>
                  )}

                  <div className="flex items-center gap-2 flex-wrap">
                    <DeleteTaskButton id={tarefa.id} />
                    <Link href={`/tasks/${tarefa.id}`}>Editar</Link>
                    <CompletedButton taskId={tarefa.id} />
                  </div>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500">Nenhuma tarefa.</p>
            )}
          </ul>
        </div>
      ))}

      <hr />

      <h2 className="text-lg font-semibold">Criar Nova Tarefa</h2>

      <div className="bg-white p-6 rounded shadow">
        <CreateTaskForm />
      </div>
    </div>
  );
}
