import { useAppSelector } from "../../app/store";
import { selectCurrentUser } from "../../features/auth/selectors";

const DEFAULT_AVATAR = "data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'>\
<circle cx='50' cy='50' r='50' fill='#ddd'/>\
<circle cx='50' cy='40' r='18' fill='#999'/>\
<rect x='25' y='60' width='50' height='25' rx='12' fill='#999'/>\
</svg>";

export default function Avatar({ size = 36 }: { size?: number }) {
  const user = useAppSelector(selectCurrentUser);
  const src = user?.profileImageUrl || user?.profileImagePath || DEFAULT_AVATAR;
  return <img src={src} alt="avatar" width={size} height={size} style={{ borderRadius: "50%" }} />;
}
