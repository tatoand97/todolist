import { api } from "./baseApi";

export type TaskStatus = "SIN_EMPEZAR"|"EMPEZADA"|"FINALIZADA";
export interface Task {
  id: number|string;
  text: string;
  createdAt: string;
  dueDate?: string|null;
  status: TaskStatus;
  categoryId: number|string;
  userId: number|string;
}

export const tasksApi = api.injectEndpoints({
  endpoints: (build) => ({
    listUserTasks: build.query<Task[], void>({
      query: () => ({ url: "/tareas/usuario", method: "GET" }),
      providesTags: (result) =>
        result ? [...result.map(t => ({ type: "Task" as const, id: t.id })), { type: "Task", id: "LIST" }] :
                 [{ type: "Task", id: "LIST" }]
    }),
    getTaskById: build.query<Task, { id: any }>({
      query: ({ id }) => ({ url: `/tareas/${id}`, method: "GET" }),
      providesTags: (_task, _e, arg) => [{ type: "Task", id: arg.id }]
    }),
    createTask: build.mutation<Task, { text: string; dueDate?: string|null; categoryId: any }>({
      query: (data) => ({ url: "/tareas", method: "POST", body: data }),
      invalidatesTags: [{ type: "Task", id: "LIST" }]
    }),
    updateTask: build.mutation<Task, { id: any; text?: string; dueDate?: string|null; status?: TaskStatus }>({
      query: ({ id, ...data }) => ({ url: `/tareas/${id}`, method: "PUT", body: data }),
      invalidatesTags: (_r, _e, arg) => [{ type: "Task", id: arg.id }, { type: "Task", id: "LIST" }]
    }),
    deleteTask: build.mutation<{ deleted: boolean }, { id: any }>({
      query: ({ id }) => ({ url: `/tareas/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, arg) => [{ type: "Task", id: arg.id }, { type: "Task", id: "LIST" }]
    })
  })
});

export const { useListUserTasksQuery, useGetTaskByIdQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = tasksApi;
