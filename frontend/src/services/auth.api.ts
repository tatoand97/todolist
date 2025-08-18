import { api } from "./baseApi";

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation<any, { username: string; password: string; image?: File | null }>({
      query: (payload) => {
        const fd = new FormData();
        fd.append("nombreUsuario", payload.username);
        fd.append("contrasena", payload.password);
        if (payload.image) fd.append("imagenPerfil", payload.image);
        return { url: "/usuarios", method: "POST", body: fd };
      },
      invalidatesTags: ["User"]
    }),
    login: build.mutation<{ token: string; usuario?: any }, { username: string; password: string }>({
      query: (credentials) => ({
        url: "/usuarios/iniciar-sesion",
        method: "POST",
        body: credentials
      })
    })
  })
});

export const { useRegisterMutation, useLoginMutation } = authApi;
