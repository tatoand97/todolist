import Logo from "../../assets/GoCloud.png";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 sm:flex-row sm:px-6">
        
        {/* Logo + Marca */}
        <div className="flex items-center gap-2">
          <img src={Logo} alt="GoCloud" className="h-6 w-6" />
          <span className="text-sm font-medium text-gray-600">GoCloud</span>
        </div>

        {/* Centro - Leyenda extra */}
        <p className="text-sm text-gray-500 text-center sm:text-left">
          Nivelación 0 : Desarrollo de Soluciones Cloud - 2025 Sem 2
        </p>

        {/* Copyright */}
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} GoCloud. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
