import Logo from "./Logo";
import { footerColumns } from "@/data/site";
import { SITE } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-900 px-6 py-16 text-neutral-300">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div>
            <Logo dark />
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              {SITE.description}
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
                      className="text-sm text-neutral-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* A buyer who has never heard of Kyno Studio should be able to see who they
            are paying and how to reach them without hunting for /contact — and a
            buyer in the US should be able to verify the company exists at all.
            The name, the company number and the registered office are the three
            things that make that check possible, so all three are here rather
            than only on /terms. */}
        <div className="mt-12 border-t border-neutral-800 pt-6 text-center text-xs text-neutral-400">
          <p>&copy; {new Date().getFullYear()} {SITE.legalName}. All rights reserved.</p>
          <p className="mt-1.5">
            Registered in Hong Kong SAR
            <span aria-hidden className="mx-1.5 text-neutral-500">·</span>
            Company No. {SITE.companyNumber}
          </p>
          <p className="mt-1.5">{SITE.registeredAddress}</p>
          <p className="mt-1.5">
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="transition-colors hover:text-white"
            >
              {SITE.contactEmail}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
