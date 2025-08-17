import type { RootState } from "../../app/store";

export const selectIsAuthenticated = (s: RootState) => Boolean(s.auth.token);
export const selectCurrentUser    = (s: RootState) => s.auth.user;
