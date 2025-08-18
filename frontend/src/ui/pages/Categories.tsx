import { useListCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation } from "../../services/categories.api";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export default function Categories() {
  const { data: cats, isLoading, refetch } = useListCategoriesQuery();
  const [createCat] = useCreateCategoryMutation();
  const [delCat] = useDeleteCategoryMutation();
  const { register, handleSubmit, reset } = useForm<{ nombre: string; descripcion?: string }>();

  const onSubmit = async (data: any) => {
    await createCat(data).unwrap();
    reset();
    refetch();
  };

  return (
    <div style={{ padding: 16 }}>
      <nav style={{ marginBottom: 8 }}>
        <Link to="/">← Tareas</Link>
      </nav>
      <h2>Categorías</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input placeholder="Nombre" {...register("nombre")}/>
        <input placeholder="Descripción" {...register("descripcion")}/>
        <button>Crear</button>
      </form>
      {isLoading ? <p>Cargando...</p> : null}
      <ul style={{ display: "grid", gap: 8, padding: 0, listStyle: "none" }}>
        {cats?.map(c => (
          <li key={String(c.id)} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, display: "flex", justifyContent: "space-between" }}>
            <div>
              <strong>{c.nombre}</strong>
              {c.descripcion ? <div style={{ fontSize: 12, color: "#555" }}>{c.descripcion}</div> : null}
            </div>
            <button onClick={() => delCat({ id: c.id })}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
