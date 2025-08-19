import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { logout } from "../../features/auth/auth.slice";
import { selectCurrentUser } from "../../features/auth/selectors";
import Avatar from "./Avatar"; // el Avatar que hicimos antes

interface HeaderProps {
  onToggleSidebar?: () => void; // opcional, por si tienes sidebar
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const [openUser, setOpenUser] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-3 sm:h-16 sm:px-6">
        {/* Botón menú mobile (opcional) */}
        <button
          onClick={onToggleSidebar ?? (() => setOpenMobile(v => !v))}
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300 sm:hidden"
          aria-label="Abrir menú"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="2" strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>

        {/* Brand */}
        <Link to="/tasks" className="group inline-flex items-center gap-2">
          <div className="h-6 w-1 rounded bg-orange-600 group-hover:bg-orange-700" />
          <span className="text-lg font-bold tracking-tight text-gray-900">
            Go<span className="text-orange-600">Cloud</span>
          </span>
          <span className="hidden text-xs font-medium text-gray-500 sm:inline">2.0</span>
        </Link>

        {/* Navegación (desktop) */}
        <nav className="ml-4 hidden items-center gap-4 sm:flex">
          <HeaderLink to="/tasks">Tareas</HeaderLink>
          <HeaderLink to="/categories">Categorías</HeaderLink>
          {/* agrega más: <HeaderLink to="/reportes">Reportes</HeaderLink> */}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* (Opcional) Search breve */}
        {/* <div className="hidden md:block">
          <input
            className="w-64 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            placeholder="Buscar…"
          />
        </div> */}

        {/* Usuario */}
        <div className="relative">
          <button
            onClick={() => setOpenUser(o => !o)}
            className="group inline-flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            <Avatar size="sm" status="online" />
            <span className="hidden text-sm font-medium text-gray-800 sm:inline">
              {user?.username ?? "Usuario"}
            </span>
            <svg
              className="h-4 w-4 text-gray-500 transition group-hover:text-gray-700"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Dropdown */}
          {openUser && (
            <div
              className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black/5"
              onMouseLeave={() => setOpenUser(false)}
            >
              <div className="px-3 py-2 text-xs text-gray-500">
                Sesión de <span className="font-medium text-gray-800">{user?.username ?? "usuario"}</span>
              </div>
              <Link
                to="/profile"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setOpenUser(false)}
              >
                Perfil
              </Link>
              <button
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setOpenUser(false);
                  dispatch(logout());
                }}
              >
                <svg className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeWidth="2" d="M15 12H3m12 0l-4-4m4 4l-4 4M21 5v14a2 2 0 01-2 2h-5" />
                </svg>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Nav móvil (simple) */}
      {openMobile && (
        <div className="border-t border-gray-200 bg-white sm:hidden">
          <nav className="mx-auto max-w-7xl px-3 py-2">
            <MobileLink to="/tasks" onClick={() => setOpenMobile(false)}>Tareas</MobileLink>
            <MobileLink to="/categories" onClick={() => setOpenMobile(false)}>Categorías</MobileLink>
          </nav>
        </div>
      )}
    </header>
  );
}

function HeaderLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "rounded-md px-3 py-1.5 text-sm font-medium transition",
          isActive
            ? "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

function MobileLink({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "block rounded-md px-3 py-2 text-base font-medium",
          isActive ? "bg-orange-50 text-orange-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}
