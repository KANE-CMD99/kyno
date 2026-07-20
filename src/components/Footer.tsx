import Logo from "./Logo";

const socialLinks = [
  { label: "Twitter", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Email", href: "mailto:hello@kyno.tech" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.05] bg-[#06060a] px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Kyno Technology Limited
          </span>
        </div>
        <div className="flex gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-gray-500 transition-colors hover:text-gray-300"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
