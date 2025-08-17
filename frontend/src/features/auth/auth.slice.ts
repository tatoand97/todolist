import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  token: string | null;
  user: any | null;
}

const initialState: AuthState = {
  token: (typeof localStorage !== "undefined" && localStorage.getItem("token")) || null,
  user: (typeof localStorage !== "undefined" && localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")!) : null
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ token: string; user?: any|null }>) => {
      state.token = action.payload.token;
      state.user  = action.payload.user ?? state.user;
      localStorage.setItem("token", state.token);
      if (state.user) localStorage.setItem("user", JSON.stringify(state.user));
    },
    setUser: (state, action: PayloadAction<any|null>) => {
      state.user = action.payload;
      if (state.user) localStorage.setItem("user", JSON.stringify(state.user));
      else localStorage.removeItem("user");
    },
    logout: (state) => {
      state.token = null;
      state.user  = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }
});

export const { setAuth, setUser, logout } = slice.actions;
export default slice.reducer;
