import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { env } from "../config/env";
import type { RootState } from "../app/store";

export const baseQuery = fetchBaseQuery({
  baseUrl: env.API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  }
});

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["User","Category","Task"],
  endpoints: () => ({})
});
