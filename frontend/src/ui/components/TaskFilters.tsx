import { useEffect, useState } from "react";
import { useListCategoriesQuery } from "../../services/categories.api";
import type { TaskStatus } from "../../services/tasks.api";

type Filters = { categoryId?: any; status?: TaskStatus | "" };

export default function TaskFilters({ onChange }: { onChange: (f: Filters) => void }) {
  const { data: cats } = useListCategoriesQuery();
  const [categoryId, setCategoryId] = useState<string>("");
  const [status, setStatus] = useState<TaskStatus | "">("");

  // Notificar cambios hacia el padre
  useEffect(() => {
    onChange({ categoryId: categoryId || undefined, status });
  }, [categoryId, status, onChange]);

  const clear = () => {
    setCategoryId("");
    setStatus("");
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      {/* Categoría */}
      <div>
        <label htmlFor="filter-category" className="mb-1 block text-sm font-medium text-gray-700">
          Categoría
        </label>
        <select
          id="filter-category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-56 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition
                     focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
        >
          <option value="">Todas las categorías</option>
          {cats?.map((c: any) => (
            <option key={String(c.id)} value={String(c.id)}>
              {c.name ?? c.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Estado */}
      <div>
        <label htmlFor="filter-status" className="mb-1 block text-sm font-medium text-gray-700">
          Estado
        </label>
        <select
          id="filter-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus | "")}
          className="w-56 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition
                     focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
        >
          <option value="">Todos los estados</option>
          <option value="SIN_EMPEZAR">Sin empezar</option>
          <option value="EMPEZADA">Empezada</option>
          <option value="FINALIZADA">Finalizada</option>
        </select>
      </div>

      {/* Botón limpiar */}
      <div className="ml-auto">
        <button
          type="button"
          onClick={clear}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition
                     hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
          title="Limpiar filtros"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}
