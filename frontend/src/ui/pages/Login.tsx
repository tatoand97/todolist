import { useForm } from "react-hook-form";
import { useLoginMutation } from "../../services/auth.api";
import { useAppDispatch } from "../../app/store";
import { setAuth, setUser } from "../../features/auth/auth.slice";
import { Link, useNavigate } from "react-router-dom";
import loginImg from '../../assets/GoCloud.png'; // Assuming you have a login image

export default function Login() {
  const { register, handleSubmit } = useForm<{
    username: string;
    password: string;
  }>();
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
    <div className="grid grid-cols-1 sm:grid-cols-2">

      <div>
        <img src={loginImg} alt="Login" />
      </div>

      <div
      >
        <h2>Iniciar sesión</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "grid", gap: 8 }}
        >
           <h2>Go Cloud 2.0</h2>
           <label>Username/Usuario</label>
          <input placeholder="Usuario" {...register("username")} />
          <label>Password/Contraseña</label>
          <input
            placeholder="Contraseña"
            type="password"
            {...register("password")}
          />
          <button className="border-purple-200 text-purple-600 hover:border-transparent hover:bg-purple-600 hover:text-white active:bg-purple-700"disabled={isLoading}>Entrar/Sign In</button>
        </form>
        {error && (
          <small style={{ color: "red" }}>Error al iniciar sesión</small>
        )}
        <Link to="/register">Crear cuenta</Link>
      </div>
      </div>

  );
}
