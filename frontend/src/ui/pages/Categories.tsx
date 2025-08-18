import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useListCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../services/categories.api";

export default function Categories() {
  const { data: categories, isLoading, refetch } = useListCategoriesQuery();
  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await createCategory({ nombre: name.trim(), descripcion: description.trim() || undefined }).unwrap();
    setName("");
    setDescription("");
    refetch();
  }

  return (
    <>
      {/* Encabezado local */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Categorías</h1>
        <nav className="flex items-center gap-2">
          <Link
            to="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            Volver a Tareas
          </Link>
        </nav>
      </div>

      {/* Crear categoría */}
      <section className="mb-6">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Crear categoría</h3>
          <form onSubmit={onCreate} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">Nombre</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Trabajo, Hogar"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 outline-none transition
                           focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">Descripción</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción opcional"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 outline-none transition
                           focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                disabled={creating}
                className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition
                           hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Crear categoría
              </button>
            </div>
          </form>
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
              <div key={i} className="h-24 animate-pulse rounded-xl border border-gray-200 bg-white p-4">
                <div className="mb-2 h-5 w-1/2 rounded bg-gray-200" />
                <div className="h-3 w-2/3 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : (categories?.length ?? 0) === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
            Aún no hay categorías.
          </div>
        ) : (
          <ul className="grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {categories!.map((c) => (
              <li key={String(c.id)} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold text-gray-900">{c.nombre}</div>
                    {c.descripcion ? (
                      <div className="mt-1 text-sm text-gray-600">{c.descripcion}</div>
                    ) : (
                      <div className="mt-1 text-sm text-gray-400 italic">Sin descripción</div>
                    )}
                  </div>
                  <button
                    onClick={() => deleteCategory({ id: c.id }).unwrap()}
                    className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 active:bg-red-100"
                    title="Eliminar"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
