import { useForm } from "react-hook-form";
import { useRegisterMutation } from "../../services/auth.api";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const { register, handleSubmit } = useForm<{ username: string; password: string; image?: FileList; avatarUrl?: string }>();
  const [registerUser, { isLoading, error }] = useRegisterMutation();
  const nav = useNavigate();

  const onSubmit = async (data: any) => {
    const payload = { username: data.username, password: data.password, image: data.image?.[0] ?? null };
    await registerUser(payload).unwrap();
    nav("/login");
  };

  return (
    <div style={{ display: "grid", gap: 8, maxWidth: 360, margin: "40px auto" }}>
      <h2>Crear cuenta</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: 8 }}>
        <input placeholder="Usuario" {...register("username")} />
        <input placeholder="Contraseña" type="password" {...register("password")} />
        <label>Imagen de perfil (opcional)<input type="file" accept="image/*" {...register("image")} /></label>
        <label>URL de avatar (opcional)<input placeholder="avatarurl" {...register("avatarUrl")} /></label>
        <button disabled={isLoading}>Registrarme</button>
      </form>
      {error && <small style={{ color: "red" }}>Error al registrar</small>}
      <Link to="/login">Volver</Link>
    </div>
  );
}
