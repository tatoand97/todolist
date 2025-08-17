import { useForm } from "react-hook-form";
import { useLoginMutation } from "../../services/auth.api";
import { useAppDispatch } from "../../app/store";
import { setAuth, setUser } from "../../features/auth/auth.slice";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { register, handleSubmit } = useForm<{ username: string; password: string }>();
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  const onSubmit = async (data: { username: string; password: string }) => {
    const resp = await login(data).unwrap();
    dispatch(setAuth({ token: resp.token, user: resp.usuario ?? null }));
    if (resp.usuario) dispatch(setUser(resp.usuario));
    nav("/");
  };

  return (
    <div style={{ display: "grid", gap: 8, maxWidth: 360, margin: "40px auto" }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: 8 }}>
        <input placeholder="Usuario" {...register("username")} />
        <input placeholder="Contraseña" type="password" {...register("password")} />
        <button disabled={isLoading}>Entrar</button>
      </form>
      {error && <small style={{ color: "red" }}>Error al iniciar sesión</small>}
      <Link to="/register">Crear cuenta</Link>
    </div>
  );
}
