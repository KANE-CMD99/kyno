import Logo from "./Logo";

const socialLinks = [
  { label: "Twitter", href: "#" },
  { label: "Dribbble", href: "#" },
  { label: "Email", href: "mailto:hello@kyno.tech" },
];

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-[#FAFAFA] px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="text-sm text-neutral-400">
            &copy; {new Date().getFullYear()} Kyno
          </span>
        </div>
        <div className="flex gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-neutral-400 transition-colors hover:text-neutral-600"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
