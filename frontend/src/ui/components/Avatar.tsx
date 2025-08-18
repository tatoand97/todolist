// src/ui/components/Avatar.tsx
import { useMemo } from "react";
import { useAppSelector } from "../../app/store";
import { selectCurrentUser } from "../../features/auth/selectors";
import GoCloudLogo from "../../assets/avatar.jpg"; // asegúrate que exista este asset

type Status = "online" | "offline" | "busy" | "away" | "none";

interface AvatarProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl"; // tamaños predefinidos
  src?: string | null;                      // override manual si quieres
  alt?: string;
  showRing?: boolean;
  showBorder?: boolean;
  status?: Status;
  className?: string;
  rounded?: "full" | "lg" | "md";          // forma
}

const sizeMap = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-xs",
  lg: "h-14 w-14 text-sm",
  xl: "h-20 w-20 text-base",
};

const roundedMap = {
  full: "rounded-full",
  lg: "rounded-lg",
  md: "rounded-md",
};

const statusColor: Record<Exclude<Status, "none">, string> = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  busy: "bg-red-500",
  away: "bg-yellow-500",
};

export default function Avatar({
  size = "md",
  src,
  alt = "Avatar",
  showRing = true,
  showBorder = false,
  status = "none",
  className = "",
  rounded = "full",
}: AvatarProps) {
  const user = useAppSelector(selectCurrentUser);

  // 1) prioriza prop src; 2) user.profileImageUrl; 3) user.profileImagePath; 4) logo
  const resolvedSrc = src ?? user?.profileImageUrl ?? user?.profileImagePath ?? GoCloudLogo;

  // Iniciales como fallback visual si no hay imagen válida
  const initials = useMemo(() => {
    const name = user?.username || user?.name || "GC";
    return name
      .toString()
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((s:any) => s[0]?.toUpperCase() || "")
      .join("") || "GC";
  }, [user]);

  const sizeCls = sizeMap[size];
  const shapeCls = roundedMap[rounded];

  return (
    <div
      className={[
        "relative inline-flex items-center justify-center",
        sizeCls,
        shapeCls,
        showRing ? "ring-2 ring-orange-500 ring-offset-2 ring-offset-white" : "",
        showBorder ? "border border-gray-200" : "",
        "bg-white shadow-sm overflow-hidden",
        className,
      ].join(" ")}
      aria-label={alt}
    >
      {/* Imagen si existe */}
      {resolvedSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolvedSrc}
          alt={alt}
          className={["h-full w-full object-cover", shapeCls].join(" ")}
          onError={(e) => {
            // Si falla la imagen, usamos el fallback con iniciales
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      ) : null}

      {/* Fallback con iniciales y fondo con acento GoCloud */}
      <div
        className={[
          "absolute inset-0 flex items-center justify-center",
          "bg-gradient-to-br from-orange-600 via-orange-500 to-orange-400",
          "text-white font-semibold select-none",
          shapeCls,
          resolvedSrc ? "hidden" : "block",
        ].join(" ")}
      >
        {initials}
      </div>

      {/* Punto de estado opcional */}
      {status !== "none" && (
        <span
          className={[
            "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-white",
            statusColor[status as Exclude<Status, "none">] || "bg-gray-400",
          ].join(" ")}
          aria-hidden="true"
          title={status}
        />
      )}
    </div>
  );
}
