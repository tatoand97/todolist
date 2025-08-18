import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateTaskMutation, useUpdateTaskMutation } from "../../services/tasks.api";
import { useListCategoriesQuery } from "../../services/categories.api";

const schema = z.object({
  text: z.string().min(1, "Texto requerido"),
  dueDate: z.string().optional().or(z.literal("")),
  categoryId: z.string().min(1, "Categoría requerida")
});
type FormData = z.infer<typeof schema>;

export default function TaskForm({ defaultValues, onSaved }: { defaultValues?: Partial<FormData & { id?: any }>, onSaved?: () => void }) {
  const { data: cats } = useListCategoriesQuery();
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { text: "", dueDate: "", categoryId: "", ...defaultValues }
  });

  const onSubmit = async (data: FormData) => {
    const payload = {
      text: data.text,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      categoryId: data.categoryId
    };
    if ((defaultValues as any)?.id) {
      await updateTask({ id: (defaultValues as any).id, ...payload }).unwrap();
    } else {
      await createTask(payload).unwrap();
    }
    onSaved?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: 8, maxWidth: 480 }}>
      <label>Texto<input {...register("text")} /></label>
      {errors.text && <small style={{ color: "red" }}>{errors.text.message}</small>}

      <label>Fecha tentativa
        <input type="date" {...register("dueDate")} />
      </label>

      <label>Categoría
        <select {...register("categoryId")}>
          <option value="">Seleccione...</option>
          {cats?.map(c => <option key={String(c.id)} value={String(c.id)}>{c.nombre}</option>)}
        </select>
      </label>
      {errors.categoryId && <small style={{ color: "red" }}>{errors.categoryId.message}</small>}

      <button type="submit">{(defaultValues as any)?.id ? "Actualizar" : "Crear"} tarea</button>
    </form>
  );
}
