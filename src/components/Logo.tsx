interface LogoProps {
  dark?: boolean;
}

export default function Logo({ dark }: LogoProps) {
  return (
    <span className={`select-none text-2xl font-black tracking-tight ${dark ? "text-white" : "text-neutral-900"}`}>
      KYNO
    </span>
  );
}
