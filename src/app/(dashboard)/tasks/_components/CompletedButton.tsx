"use client";

export const CompletedButton = ({ taskId }: { taskId: number }) => {
    const handleComplete = async () => {
        try {
            const response = await fetch(`/api/tasks/completed/${taskId}`, {
                method: 'PUT',
            });

            if (!response.ok) {
                throw new Error('Erro ao completar a tarefa');
            }
        } catch (error) {
            console.error('Erro ao completar a tarefa:', error);
            alert('Não foi possível completar a tarefa. Tente novamente mais tarde.');
        }
    }

    return (
        <button
            onClick={handleComplete}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
            Concluir
        </button>
    );
}