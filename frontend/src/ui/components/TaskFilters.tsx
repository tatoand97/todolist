import { useState } from "react";
import { useListCategoriesQuery } from "../../services/categories.api";
import type { TaskStatus } from "../../services/tasks.api";

export default function TaskFilters({ onChange }: { onChange: (f: { categoryId?: any; status?: TaskStatus | "" }) => void }) {
  const { data: cats } = useListCategoriesQuery();
  const [categoryId, setCategoryId] = useState<any>("");
  const [status, setStatus] = useState<TaskStatus | "">("");

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <select value={categoryId} onChange={e => { const v = e.target.value || undefined; setCategoryId(v); onChange({ categoryId: v, status }); }}>
        <option value="">Todas las categorías</option>
        {cats?.map(c => <option key={String(c.id)} value={String(c.id)}>{c.nombre}</option>)}
      </select>
      <select value={status} onChange={e => { const v = e.target.value as TaskStatus | ""; setStatus(v); onChange({ categoryId, status: v }); }}>
        <option value="">Todos los estados</option>
        <option value="SIN_EMPEZAR">Sin empezar</option>
        <option value="EMPEZADA">Empezada</option>
        <option value="FINALIZADA">Finalizada</option>
      </select>
    </div>
  );
}
