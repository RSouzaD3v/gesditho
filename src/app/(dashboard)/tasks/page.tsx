// app/(dashboard)/tasks/page.tsx
export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import { db } from "@/lib/db";
import { CreateTaskForm } from "./_components/CreateTaskForm";
import { CompletedButton } from "./_components/CompletedButton";
import { DeleteTaskButton } from "./_components/DeleteTaskButton";
import { Edit } from "lucide-react";
import Link from "next/link";

export default async function TasksPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });

  const startOfToday = new Date(new Date().setHours(0, 0, 0, 0));
  const endOfToday = new Date(new Date().setHours(23, 59, 59, 999));

  const taskToday = await db.task.findMany({
    where: {
      date: {
        gte: startOfToday,
        lt: endOfToday,
      },
      userId: user?.id,
    },
    orderBy: {
      id: "desc",
    },
  });

  const taskDue = await db.task.findMany({
    where: {
      date: {
        lt: startOfToday,
      },
      userId: user?.id,
    },
    orderBy: {
      id: "desc",
    },
  });

  taskDue.forEach(async (task) => {
    if (task.estimatedTime && new Date(task.estimatedTime).getTime() < startOfToday.getTime()) {
      await db.task.update({
        where: { id: task.id },
        data: { taskType: "Atrasada" },
      });
    }
  });

  if (!user) return <p>Usuário não encontrado.</p>;

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Minhas Tarefas</h1>

      {taskToday.length > 0 ? (
        <div>
          <h2 className="text-2xl font-semibold">Tarefas de Hoje</h2>
          <ul className="flex items-center gap-2 flex-wrap my-2">
            {taskToday.map((task) => (
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
                  <Link
                    href={`/tasks/edit/${task.id}`}
                    className="bg-blue-500 flex gap-1 items-center text-white p-2 rounded-sm hover:underline"
                  >
                    <Edit className="inline mr-1" /> Editar
                  </Link>
                  {task.isCompleted ? (
                    <span className="text-green-500">Tarefa Concluída</span>
                  ) : (
                    <CompletedButton taskId={task.id} />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Não há tarefas para hoje.</p>
      )}

      {taskDue.length > 0 ? (
        <div>
          <h2 className="text-2xl font-semibold">Tarefas Atrasadas</h2>
          <ul className="flex items-center gap-2 flex-wrap my-2">
            {taskDue.map((task) => (
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
                  <Link
                    href={`/tasks/edit/${task.id}`}
                    className="bg-blue-500 flex gap-1 items-center text-white p-2 rounded-sm hover:underline"
                  >
                    <Edit className="inline mr-1" /> Editar
                  </Link>
                  {task.isCompleted ? (
                    <span className="text-green-500">Tarefa Concluída</span>
                  ) : (
                    <CompletedButton taskId={task.id} />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Não há tarefas atrasadas.</p>
      )}

      <CreateTaskForm />
    </div>
  );
}
