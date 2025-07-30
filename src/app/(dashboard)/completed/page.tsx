export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import { db } from "@/lib/db";
import { DeleteTaskButton } from "../tasks/_components/DeleteTaskButton";

export default async function TasksPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });

  const taskCompleted = await db.task.findMany({
    where: {
        isCompleted: true,
    },
    orderBy: {
      id: "desc",
    },
  });


  taskCompleted.forEach(async (task) => {
    if (task.taskType && task.taskType !== "Concluída") {
      await db.task.update({
        where: { id: task.id },
        data: { taskType: "Concluída" },
      });
    }
  });

  if (!user) return <p>Usuário não encontrado.</p>;

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Minhas Tarefas</h1>

      {taskCompleted.length > 0 ? (
        <div>
          <h2 className="text-2xl font-semibold">Tarefas de Concluídas</h2>
          <ul className="flex items-center gap-2 flex-wrap my-2">
            {taskCompleted.map((task) => (
              <li
                key={task.id}
                className="list-none mb-2 p-2 rounded-xl bg-gray-200 w-full max-w-96"
              >
                <strong>{task.title}</strong> - {new Date(task.date).toLocaleDateString()}
                <p>{task.taskType}</p>
                <br />
                <span className="text-sm text-gray-500">
                  Estimativa:{" "}
                  {task.estimatedTime
                    ? new Date(task.estimatedTime).toLocaleDateString()
                    : "N/A"}
                </span>
                <br />
                <span className="text-sm text-gray-500">
                  Data Início:{" "}
                  {task.date ? new Date(task.date).toLocaleDateString() : "N/A"}
                </span>

                <div className="flex items-center gap-2 mt-5">
                  <DeleteTaskButton id={task.id} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Não há tarefas para hoje.</p>
      )}
    </div>
  );
}