import { api } from "./baseApi";

export interface Category { id: number|string; name: string; description?: string }

export const categoriesApi = api.injectEndpoints({
  endpoints: (build) => ({
    listCategories: build.query<Category[], void>({
      query: () => ({ url: "/categorias", method: "GET" }),
      providesTags: (result) =>
        result ? [...result.map(c => ({ type: "Category" as const, id: c.id })), { type: "Category", id: "LIST" }] :
                 [{ type: "Category", id: "LIST" }]
    }),
    createCategory: build.mutation<Category, { name: string; description?: string }>({
      query: (data) => ({ url: "/categorias", method: "POST", body: data }),
      invalidatesTags: [{ type: "Category", id: "LIST" }]
    }),
    deleteCategory: build.mutation<{ deleted: boolean }, { id: any }>({
      query: ({ id }) => ({ url: `/categorias/${id}`, method: "DELETE" }),
      invalidatesTags: (_res, _err, arg) => [{ type: "Category", id: arg.id }, { type: "Category", id: "LIST" }]
    })
  })
});

export const { useListCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation } = categoriesApi;
