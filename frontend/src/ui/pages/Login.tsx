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
    nav("/tasks");
  };

  return (
   <div className="grid min-h-screen grid-cols-1 sm:grid-cols-2 bg-gray-50">
  {/* Panel de imagen */}
  <div className="relative hidden sm:block">
    <img
      src={loginImg}
      alt="Login"
      className="absolute inset-0 h-full w-full object-cover"
    />
    {/* Overlay con líneas/acentos naranjas */}
    <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 via-transparent to-orange-500/20 pointer-events-none" />
  </div>

  {/* Panel del formulario */}
  <div className="flex items-center justify-center p-6 sm:p-10">
    <div className="w-full max-w-md">
      {/* Marca */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2">
          <div className="h-8 w-1 rounded bg-orange-500" />
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Go<span className="text-orange-600">Cloud</span> <span className="text-sm font-medium text-gray-500">2.0</span>
          </h1>
        </div>
        <p className="mt-2 text-sm text-gray-600">Bienvenido, inicia sesión para continuar</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Iniciar sesión</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          {/* Username */}
          <label className="text-sm font-medium text-gray-700" htmlFor="username">
            Username / Usuario
          </label>
          <input
            id="username"
            placeholder="Tu usuario"
            {...register("username")}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 outline-none transition
                       focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
          />

          {/* Password */}
          <label className="text-sm font-medium text-gray-700" htmlFor="password">
            Password / Contraseña
          </label>
          <input
            id="password"
            type="password"
            placeholder="Tu contraseña"
            {...register("password")}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 outline-none transition
                       focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
          />

          {/* Botón */}
          <button
            disabled={isLoading}
            className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-orange-600 px-4 py-2.5
                       text-sm font-semibold text-white shadow-sm transition
                       hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Entrar / Sign In
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            Error al iniciar sesión
          </div>
        )}

        {/* Link a registro */}
        <div className="mt-4 text-center text-sm">
          <Link
            to="/register"
            className="font-medium text-orange-600 hover:text-orange-700"
          >
            Crear cuenta
          </Link>
        </div>
      </div>

      {/* Línea decorativa inferior */}
      <div className="mt-8 h-1 w-28 rounded bg-gradient-to-r from-orange-500 to-orange-300" />
    </div>
  </div>
</div>


  );
}
