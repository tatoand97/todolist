import { useParams, Link } from "react-router-dom";
import { useGetTaskByIdQuery } from "../../services/tasks.api";

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: task, isLoading } = useGetTaskByIdQuery({ id });

  if (isLoading) return <p>Cargando...</p>;
  if (!task) return <p>No encontrada</p>;

  return (
    <div style={{ padding: 16 }}>
      <Link to="/">← Volver</Link>
      <h2>{task.text}</h2>
      <p>Estado: {task.status}</p>
      <p>Categoría: {String(task.categoryId)}</p>
      <p>Creada: {new Date(task.createdAt).toLocaleString()}</p>
      {task.dueDate ? <p>Fecha tentativa: {new Date(task.dueDate).toLocaleDateString()}</p> : null}
    </div>
  );
}
