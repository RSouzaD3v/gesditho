import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { CreateTaskForm } from "./_components/CreateTaskForm";
import { DeleteTaskButton } from "./_components/DeleteTaskButton";
import { CompletedButton } from "./_components/CompletedButton";
import Link from "next/link";

export default async function TasksPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return <p>Usuário não encontrado.</p>;

  const today = new Date();
  const tasks = await db.task.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const grouped = {
    hoje: tasks.filter(
      (t) =>
        t.type === "hoje" &&
        format(t.createdAt, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
    ),
    pendentes: tasks.filter((t) => t.type === "pendente"),
    agendadas: tasks.filter((t) => t.type === "agendada"),
    rotineiras: tasks.filter((t) => t.type === "rotineira"),
  };

  const dueDate = (dateEstimated: Date | string, isCompleted: boolean) => {
    const estimatedDate = new Date(dateEstimated);
    const now = new Date();

    if (!isCompleted && now > estimatedDate) return "Atrasada";
    if (isCompleted && now <= estimatedDate) return "Adiantada";
    if (isCompleted && now > estimatedDate) return "Concluída";
    return "Em Andamento";
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Minhas Tarefas</h1>

      {Object.entries(grouped).map(([tipo, lista]) => (
        <div key={tipo}>
          <h2 className="text-xl font-semibold capitalize text-gray-800 mb-4">
            {tipo}
          </h2>
          {lista.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lista.map((tarefa) => (
                <div
                  key={tarefa.id}
                  className="rounded-xl border p-4 bg-white shadow hover:shadow-md transition"
                >
                  <h3 className="text-lg font-bold">{tarefa.title}</h3>
                  <p className="text-sm text-gray-600">
                    Criada em: {format(tarefa.createdAt, "dd/MM/yyyy")}
                  </p>
                  <p className="text-sm text-gray-600">
                    Prioridade: <span className="font-medium">{tarefa.priority}</span>
                  </p>

                  {tarefa.estimatedTime && (
                    <p className="text-sm text-gray-600">
                      Prazo: {format(new Date(tarefa.estimatedTime), "dd/MM/yyyy")} –{" "}
                      <span className="font-semibold text-indigo-600">
                        {dueDate(tarefa.estimatedTime, tarefa.isCompleted)}
                      </span>
                    </p>
                  )}

                  {tarefa.comment && (
                    <p className="text-sm italic mt-1 text-gray-500">
                      Comentário: {tarefa.comment}
                    </p>
                  )}

                  <p className={`mt-2 text-sm font-medium ${tarefa.isCompleted ? "text-green-600" : "text-red-500"}`}>
                    {tarefa.isCompleted ? "Concluída" : "Não concluída"}
                  </p>

                  <div className="flex gap-2 flex-wrap mt-4">
                    <DeleteTaskButton id={tarefa.id} />
                    {tarefa.isCompleted ? null : (
                      <div className="flex items-center gap-2">
                        <CompletedButton taskId={tarefa.id} />
                        <Link href={`/tasks/${tarefa.id}`} className="bg-blue-600 p-2 rounded-sm text-white hover:underline">
                          Editar
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Nenhuma tarefa.</p>
          )}
        </div>
      ))}

      <CreateTaskForm />
    </div>
  );
}
