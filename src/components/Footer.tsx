import Logo from "./Logo";
import { footerColumns } from "@/data/site";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-900 px-6 py-16 text-neutral-300">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div>
            <Logo dark />
            <p className="mt-3 text-sm leading-relaxed text-neutral-500">
              Premium creative assets for designers and content creators.
            </p>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-neutral-500 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-neutral-800 pt-6 text-center text-xs text-neutral-600">
          &copy; {new Date().getFullYear()} Kyno. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
