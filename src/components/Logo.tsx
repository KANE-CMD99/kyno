import Link from "next/link";

interface LogoProps {
  dark?: boolean;
}

export default function Logo({ dark }: LogoProps) {
  return (
    <Link href="/" className={`select-none text-2xl font-black tracking-tight ${dark ? "text-white" : "text-neutral-900"}`}>
      KYNO
    </Link>
  );
}
