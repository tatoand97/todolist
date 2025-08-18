import { useForm } from "react-hook-form";
import { useRegisterMutation } from "../../services/auth.api";
import { Link, useNavigate } from "react-router-dom";
import registerImg from '../../assets/GoCloudRegister.png'; // Assuming you have a login image


type FormValues = {
  username: string;
  password: string;
  image?: FileList;
  avatarUrl?: string; // opcional, de momento no lo envío al backend
};

export default function Register() {
  const { register, handleSubmit } = useForm<FormValues>();
  const [registerUser, { isLoading, error }] = useRegisterMutation();
  const nav = useNavigate();

  const onSubmit = async (data: FormValues) => {
    const payload = {
      username: data.username,
      password: data.password,
      image: data.image?.[0] ?? null,
      // avatarUrl: data.avatarUrl, // si más adelante lo soporta tu backend, lo agregas aquí
    };
    await registerUser(payload).unwrap();
    nav("/login");
  };

  return (
    <div className="grid min-h-screen grid-cols-1 sm:grid-cols-2 bg-gray-50">
      {/* Panel decorativo (opcional, como en login) */}
      <div className="relative hidden sm:block">
            <img
              src={registerImg}
              alt="Register"
              className="absolute inset-0 h-full w-full object-cover"
            />
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 via-transparent to-orange-500/20" />
      </div>

      {/* Formulario */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Marca */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2">
              <div className="h-8 w-1 rounded bg-orange-600" />
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Go<span className="text-orange-600">Cloud</span>{" "}
                <span className="text-sm font-medium text-gray-500">2.0</span>
              </h1>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Crea tu cuenta para comenzar
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Crear cuenta</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
              {/* Usuario */}
              <div>
                <label htmlFor="username" className="mb-1 block text-sm font-medium text-gray-700">
                  Usuario
                </label>
                <input
                  id="username"
                  placeholder="Tu usuario"
                  {...register("username")}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 outline-none transition
                             focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>

              {/* Contraseña */}
              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Tu contraseña"
                  {...register("password")}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 outline-none transition
                             focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>

              {/* Imagen de perfil (opcional) */}
              <div>
                <label htmlFor="image" className="mb-1 block text-sm font-medium text-gray-700">
                  Imagen de perfil (opcional)
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  {...register("image")}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-orange-600 file:px-3 file:py-2 file:font-medium file:text-white
                             hover:file:bg-orange-700 focus:outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  JPG, PNG o WEBP. Máx. 5MB.
                </p>
              </div>

              {/* URL de avatar (opcional, solo UI por ahora) */}
              <div>
                <label htmlFor="avatarUrl" className="mb-1 block text-sm font-medium text-gray-700">
                  URL de avatar (opcional)
                </label>
                <input
                  id="avatarUrl"
                  placeholder="https://…"
                  {...register("avatarUrl")}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 outline-none transition
                             focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>

              {/* Botón */}
              <button
                disabled={isLoading}
                className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-orange-600 px-4 py-2.5
                           text-sm font-semibold text-white shadow-sm transition
                           hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Registrarme
              </button>
            </form>

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                Error al registrar
              </div>
            )}

            {/* Link a Login */}
            <div className="mt-4 text-center text-sm">
              <Link to="/login" className="font-medium text-orange-600 hover:text-orange-700">
                Volver al inicio de sesión
              </Link>
            </div>
          </div>

          {/* Línea decorativa inferior */}
          <div className="mt-8 h-1 w-28 rounded bg-gradient-to-r from-orange-600 to-orange-300" />
        </div>
      </div>
    </div>
  );
}
