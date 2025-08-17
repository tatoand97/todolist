import { Link } from "react-router-dom";
import Avatar from "../components/Avatar";
import { useAppDispatch } from "../../app/store";
import { logout } from "../../features/auth/auth.slice";
import { useListUserTasksQuery, useDeleteTaskMutation, useUpdateTaskMutation } from "../../services/tasks.api";
import TaskForm from "../components/TaskForm";
import TaskFilters from "../components/TaskFilters";
import { useMemo, useState } from "react";

export default function Tasks() {
  const dispatch = useAppDispatch();
  const { data: tasks, isLoading, refetch } = useListUserTasksQuery();
  const [delTask] = useDeleteTaskMutation();
  const [updTask] = useUpdateTaskMutation();
  const [filters, setFilters] = useState<{ categoryId?: any; status?: any }>({});

  const filtered = useMemo(() => {
    return (tasks ?? []).filter(t => {
      const okCat = filters.categoryId ? String(t.categoryId) === String(filters.categoryId) : true;
      const okStatus = filters.status ? t.status === filters.status : true;
      return okCat && okStatus;
    });
  }, [tasks, filters]);

  return (
    <div style={{ padding: 16 }}>
      <header style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Avatar size={32}/>
          <strong>Mis tareas</strong>
        </div>
        <nav style={{ display: "flex", gap: 8 }}>
          <Link to="/categories">Categorías</Link>
          <button onClick={() => dispatch(logout())}>Salir</button>
        </nav>
      </header>

      <section style={{ marginTop: 16 }}>
        <TaskFilters onChange={setFilters}/>
      </section>

      <section style={{ marginTop: 16 }}>
        <h3>Crear tarea</h3>
        <TaskForm onSaved={() => refetch()}/>
      </section>

      <section style={{ marginTop: 16 }}>
        <h3>Listado</h3>
        {isLoading ? <p>Cargando...</p> : null}
        <ul style={{ display: "grid", gap: 8, padding: 0, listStyle: "none" }}>
          {filtered.map(t => (
            <li key={String(t.id)} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <Link to={`/tasks/${t.id}`}><strong>{t.text}</strong></Link>
                  <div style={{ fontSize: 12, color: "#555" }}>
                    Estado: {t.status} | Categoría: {String(t.categoryId)} | Creada: {new Date(t.createdAt).toLocaleString()}
                    {t.dueDate ? <> | Vence: {new Date(t.dueDate).toLocaleDateString()}</> : null}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <select
                    value={t.status}
                    onChange={async (e) => {
                      await updTask({ id: t.id, status: e.target.value as any }).unwrap();
                    }}>
                    <option value="SIN_EMPEZAR">Sin empezar</option>
                    <option value="EMPEZADA">Empezada</option>
                    <option value="FINALIZADA">Finalizada</option>
                  </select>
                  <button onClick={() => delTask({ id: t.id })}>Eliminar</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
