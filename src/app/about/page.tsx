import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="bg-white pt-[105px]">
        {/* Breadcrumb */}
        <div className="border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <p className="text-sm text-neutral-400">
              <Link href="/" className="hover:text-neutral-600 transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-neutral-900">About</span>
            </p>
          </div>
        </div>

        {/* Hero */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 md:text-5xl">
              Premium digital assets for creators
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-neutral-500">
              Kyno is an independent studio crafting high-quality stock photos, fonts,
              and design templates for designers and content creators worldwide.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="bg-neutral-50 px-6 py-20">
          <div className="mx-auto max-w-3xl grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Our story</h2>
              <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                Kyno started with a simple idea: creators should have access to premium
                design resources without the premium price tag or confusing licensing.
                Every product we ship is made with obsessive attention to detail —
                the same quality we&apos;d want for our own projects.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                We&apos;re a small team of designers and developers who believe great tools
                make great work possible. No investors, no boardroom, just a commitment
                to building things people love to use.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">What we believe</h2>
              <ul className="mt-4 space-y-3">
                {[
                  { title: "Quality over quantity", desc: "Every product is polished and production-ready before it ships." },
                  { title: "Fair pricing, forever", desc: "Pay once, own forever. No subscriptions, no hidden fees." },
                  { title: "Clear licensing", desc: "Simple commercial licenses. No legal headaches." },
                  { title: "Creator-first", desc: "Everything we build starts with the creator's workflow in mind." },
                ].map((item) => (
                  <li key={item.title}>
                    <h3 className="text-sm font-semibold text-neutral-900">{item.title}</h3>
                    <p className="mt-0.5 text-sm text-neutral-500">{item.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Numbers */}
        <section className="bg-white px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-neutral-900">By the numbers</h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {[
                { value: "2025", label: "Founded" },
                { value: "10+", label: "Products" },
                { value: "1k+", label: "Customers" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-extrabold text-neutral-900">{stat.value}</div>
                  <div className="mt-1 text-sm text-neutral-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
