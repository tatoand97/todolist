import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAppDispatch } from "../../app/store";
import { logout } from "../../features/auth/auth.slice";
import {
  useListUserTasksQuery,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "../../services/tasks.api";
import TaskForm from "../components/TaskForm";
import TaskFilters from "../components/TaskFilters";
import Avatar from "../components/Avatar";

export default function Tasks() {
  const dispatch = useAppDispatch();
  const { data: tasks, isLoading, refetch } = useListUserTasksQuery();
  const [delTask] = useDeleteTaskMutation();
  const [updTask] = useUpdateTaskMutation();
  const [filters, setFilters] = useState<{ categoryId?: any; status?: any }>({});

  const filtered = useMemo(() => {
    return (tasks ?? []).filter((t: any) => {
      const okCat = filters.categoryId
        ? String(t.idCategoria) === String(filters.categoryId)
        : true;
      const okStatus = filters.status ? t.status === filters.status : true;
      return okCat && okStatus;
    });
  }, [tasks, filters]);

  const badgeFor = (status: string) => {
    switch (status) {
      case "FINALIZADA": return "bg-green-50 text-green-700 ring-green-200";
      case "EMPEZADA":   return "bg-blue-50 text-blue-700 ring-blue-200";
      default:           return "bg-gray-50 text-gray-700 ring-gray-200";
    }
  };

  return (
    <>
      {/* Encabezado local de sección */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar size="sm" status="online" />
          <h1 className="text-xl font-semibold text-gray-900">Mis tareas</h1>
        </div>
        <nav className="flex items-center gap-2">
          <Link
            to="/categories"
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            Categorías
          </Link>
          <button
            onClick={() => dispatch(logout())}
            className="rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            Salir
          </button>
        </nav>
      </div>

      {/* Filtros */}
      <section className="mb-6">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-3 text-sm font-medium text-gray-800">Filtros</div>
          <TaskFilters onChange={setFilters} />
        </div>
      </section>

      {/* Crear tarea */}
      <section className="mb-6">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Crear tarea</h3>
          <TaskForm onSaved={() => refetch()} />
        </div>
      </section>

      {/* Listado */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Listado</h3>
        </div>

        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl border border-gray-200 bg-white p-4">
                <div className="mb-3 h-5 w-2/3 rounded bg-gray-200" />
                <div className="mb-1 h-3 w-1/3 rounded bg-gray-200" />
                <div className="h-3 w-1/2 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
            No hay tareas que coincidan con los filtros.
          </div>
        ) : (
          <ul className="grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t: any) => (
              <li key={String(t.id)} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link to={`/tasks/${t.id}`} className="text-base font-semibold text-gray-900 hover:underline">
                      {t.texto}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ring-1 ${badgeFor(t.status)}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                        {t.status}
                      </span>
                      <span className="rounded bg-gray-50 px-2 py-0.5 text-gray-700 ring-1 ring-inset ring-gray-200">
                        Cat: {String(t.idCategoria)}
                      </span>
                      <span className="text-gray-500">
                        Creada: {new Date(t.createdAt).toLocaleString()}
                      </span>
                      {t.dueDate ? (
                        <span className="text-gray-500">
                          | Vence: {new Date(t.dueDate).toLocaleDateString()}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <select
                      className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                      value={t.status}
                      onChange={async (e) => {
                        await updTask({ id: t.id, status: e.target.value as any }).unwrap();
                      }}
                    >
                      <option value="SIN_EMPEZAR">Sin empezar</option>
                      <option value="EMPEZADA">Empezada</option>
                      <option value="FINALIZADA">Finalizada</option>
                    </select>

                    <button
                      onClick={() => delTask({ id: t.id })}
                      className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 active:bg-red-100"
                      title="Eliminar"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
