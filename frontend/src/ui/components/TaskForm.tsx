import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateTaskMutation, useUpdateTaskMutation } from "../../services/tasks.api";
import { useListCategoriesQuery } from "../../services/categories.api";

const schema = z.object({
  text: z.string().min(1, "Texto requerido"),
  dueDate: z.string().optional().or(z.literal("")),
  categoryId: z.string().min(1, "Categoría requerida"),
});
type FormData = z.infer<typeof schema>;

export default function TaskForm({
  defaultValues,
  onSaved,
}: {
  defaultValues?: Partial<FormData & { id?: any }>;
  onSaved?: () => void;
}) {
  const { data: cats } = useListCategoriesQuery();
  const [createTask, { isLoading: creating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: updating }] = useUpdateTaskMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { text: "", dueDate: "", categoryId: "", ...defaultValues },
  });

  const isEditing = Boolean((defaultValues as any)?.id);
  const isBusy = isSubmitting || creating || updating;

  const onSubmit = async (data: FormData) => {
    const payload = {
      texto: data.text,
      fechaTentativaFin: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      idCategoria: data.categoryId,
    };
    if (isEditing) {
      await updateTask({ id: (defaultValues as any).id, ...payload }).unwrap();
    } else {
      await createTask(payload).unwrap();
    }
    onSaved?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid max-w-xl gap-4">
      {/* Texto */}
      <div>
        <label htmlFor="text" className="mb-1 block text-sm font-medium text-gray-700">
          Texto de la tarea
        </label>
        <input
          id="text"
          placeholder="Ej. Preparar informe, llamar al cliente…"
          {...register("text")}
          aria-invalid={!!errors.text}
          aria-describedby={errors.text ? "text-error" : undefined}
          className={[
            "w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 outline-none transition",
            errors.text
              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200",
          ].join(" ")}
        />
        {errors.text && (
          <p id="text-error" className="mt-1 text-xs text-red-600">
            {errors.text.message}
          </p>
        )}
      </div>

      {/* Fecha tentativa */}
      <div>
        <label htmlFor="dueDate" className="mb-1 block text-sm font-medium text-gray-700">
          Fecha tentativa
        </label>
        <input
          id="dueDate"
          type="date"
          {...register("dueDate")}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition
                     focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
        />
      </div>

      {/* Categoría */}
      <div>
        <label htmlFor="categoryId" className="mb-1 block text-sm font-medium text-gray-700">
          Categoría
        </label>
        <select
          id="categoryId"
          {...register("categoryId")}
          aria-invalid={!!errors.categoryId}
          aria-describedby={errors.categoryId ? "cat-error" : undefined}
          className={[
            "w-full rounded-lg border bg-white px-3 py-2 text-gray-900 outline-none transition",
            errors.categoryId
              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200",
          ].join(" ")}
        >
          <option value="">Seleccione…</option>
          {cats?.map((c: any) => (
            <option key={String(c.id)} value={String(c.id)}>
              {c.name ?? c.nombre}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p id="cat-error" className="mt-1 text-xs text-red-600">
            {errors.categoryId.message}
          </p>
        )}
      </div>

      {/* Acción */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isBusy}
          className="inline-flex w-full items-center justify-center rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition
                     hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isEditing ? "Actualizar" : "Crear"} tarea
        </button>
      </div>
    </form>
  );
}
