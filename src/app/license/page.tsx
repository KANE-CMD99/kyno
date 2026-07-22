import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function LicensePage() {
  return (
    <>
      <Nav />
      <main className="bg-white pt-[105px]">
        <div className="border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <p className="text-sm text-neutral-400">
              <Link href="/" className="hover:text-neutral-600 transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-neutral-900">License</span>
            </p>
          </div>
        </div>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-extrabold text-neutral-900">Product License</h1>
            <p className="mt-2 text-sm text-neutral-500">Applies to all Kyno digital products</p>

            <h2 className="mt-10 text-lg font-bold text-neutral-900">What You Can Do</h2>
            <ul className="mt-2 space-y-1.5 text-sm text-neutral-600">
              <li>Use purchased products in personal and commercial projects</li>
              <li>Use products in client work (the license transfers to the client&apos;s end product)</li>
              <li>Modify and customize products to fit your needs</li>
              <li>Use products in unlimited projects with no expiration</li>
              <li>Install fonts on multiple devices you own</li>
            </ul>

            <h2 className="mt-8 text-lg font-bold text-neutral-900">What You Cannot Do</h2>
            <ul className="mt-2 space-y-1.5 text-sm text-neutral-600">
              <li>Resell, redistribute, or sublicense the original product files</li>
              <li>Share or transfer the license to another person or entity</li>
              <li>Use product files to create competing products for resale</li>
              <li>Claim ownership or authorship of the original product</li>
              <li>Use products in trademark, logo, or branding for resale as a standalone asset</li>
              <li>Reupload or distribute fonts on font-sharing websites</li>
            </ul>

            <h2 className="mt-8 text-lg font-bold text-neutral-900">Commercial Use</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              All products include a standard commercial license at no extra cost. You may use them
              in client projects, marketing materials, websites, social media, presentations, and
              physical products. The end product must be significantly different from the original
              asset and not simply repackaged.
            </p>

            <h2 className="mt-8 text-lg font-bold text-neutral-900">Font License</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              Font purchases include both desktop and web font licenses. Desktop: install on your
              computers for use in design software. Web: embed in websites using @font-face with
              the provided WOFF2 files. Pageview limits: up to 50,000 monthly pageviews per font
              purchase. For higher-traffic sites, contact us.
            </p>

            <h2 className="mt-8 text-lg font-bold text-neutral-900">Questions</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              Need a custom license or enterprise terms? Contact{" "}
              <a href="mailto:hello@kyno.dev" className="text-blue-600 hover:text-blue-700">hello@kyno.dev</a>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
