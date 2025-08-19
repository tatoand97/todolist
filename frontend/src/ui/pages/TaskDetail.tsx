import { Link, useParams } from "react-router-dom";
import { useGetTaskByIdQuery } from "../../services/tasks.api";

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: task, isLoading } = useGetTaskByIdQuery({ id });

  // badge por estado
  const badgeFor = (status?: string) => {
    switch (status) {
      case "FINALIZADA": return "bg-green-50 text-green-700 ring-green-200";
      case "EMPEZADA":   return "bg-blue-50 text-blue-700 ring-blue-200";
      default:           return "bg-gray-50 text-gray-700 ring-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl p-4 sm:p-6">
        <div className="mb-4">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-3 h-6 w-2/3 animate-pulse rounded bg-gray-200" />
          <div className="mb-2 h-4 w-1/2 animate-pulse rounded bg-gray-200" />
          <div className="mb-2 h-4 w-1/3 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="mx-auto max-w-3xl p-4 sm:p-6">
        <Link
          to="/tasks"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          ← Volver
        </Link>
        <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
          Tarea no encontrada.
        </div>
      </div>
    );
  }

  // Compatibilidad de campos (ES/EN) según lo que devuelva el backend
  const text = (task as any).text ?? (task as any).texto ?? "";
  const status = (task as any).status ?? (task as any).estado ?? "SIN_EMPEZAR";
  const categoryId = (task as any).categoryId ?? (task as any).idCategoria;
  const createdAt = new Date((task as any).createdAt);
  const dueDateRaw = (task as any).dueDate ?? (task as any).fechaTentativa;
  const dueDate = dueDateRaw ? new Date(dueDateRaw) : null;

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <Link
          to="/tasks"
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          ← Volver
        </Link>
        <div className="text-xs text-gray-500">ID: {String((task as any).id)}</div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-semibold text-gray-900">{text}</h2>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ring-1 ${badgeFor(status)}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
            {status}
          </span>
        </div>

        <dl className="mt-2 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Categoría</dt>
            <dd className="text-sm text-gray-800">#{String(categoryId ?? "—")}</dd>
          </div>

          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Creada</dt>
            <dd className="text-sm text-gray-800">{createdAt.toLocaleString()}</dd>
          </div>

          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Fecha tentativa</dt>
            <dd className="text-sm text-gray-800">
              {dueDate ? dueDate.toLocaleDateString() : <span className="text-gray-400">No definida</span>}
            </dd>
          </div>
        </dl>

        {/* Acciones rápidas */}
        <div className="mt-6 flex items-center gap-2">
          <Link
            to="/tasks"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Volver al listado
          </Link>
          <Link
            to={`/`} // aquí podrías llevar a una pantalla de edición si la tienes
            className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            Editar
          </Link>
        </div>
      </div>
    </div>
  );
}
