import { api } from "./baseApi";
const urlAvatar:string  = "https://www.google.com/url?sa=i&url=https%3A%2F%2Femojiisland.com%2Fpages%2Ffree-download-emoji-icons-png&psig=AOvVaw3aUxRa7vB9EVDrgZ0b7xZw&ust=1755567419081000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCMjIq8ick48DFQAAAAAdAAAAABAE";
  
export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation<any, { username: string; password: string; image?: File | null; avatarUrl?: string}>({
      query: (payload) => {
        const fd = new FormData();
        fd.append("username", payload.username);
        fd.append("password", payload.password);
        if (payload.image) fd.append("imagenPerfil", payload.image);
        if (payload.avatarUrl) {fd.append("avatarUrl", payload.avatarUrl)} else {fd.append("avatarUrl", urlAvatar)};
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
