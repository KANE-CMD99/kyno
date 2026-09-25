import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description:
    "Kyno is an independent studio selling ready-made resume templates, printables and menu templates — pay once, own forever, from $4.",
  alternates: { canonical: "/about" },
};

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
              Kyno is an independent studio crafting high-quality resume templates,
              printables, and menu templates for job seekers, small businesses, and creators worldwide.
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
                We&apos;re an independent studio, and every template in the shop is designed
                in-house and checked by hand before it goes up. We&apos;d rather ship one
                product we stand behind than fifty we don&apos;t.
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
                { value: "Instant", label: "Digital Delivery" },
                { value: "Secure", label: "Stripe Checkout" },
                { value: "Lifetime", label: "Access" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-extrabold text-neutral-900">{stat.value}</div>
                  <div className="mt-1 text-sm text-neutral-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company details — someone who has never heard of Kyno should be able
            to see who they are paying before they hand over money. */}
        <section className="bg-neutral-50 px-6 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-xl font-bold text-neutral-900">Who you&apos;re buying from</h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600">
              Kyno is operated by Kyno Technology Limited, registered in Hong Kong SAR.
              Questions about an order, a licence or a product? Email{" "}
              <a href={`mailto:${SITE.contactEmail}`} className="text-blue-600 hover:underline">
                {SITE.contactEmail}
              </a>{" "}
              and you&apos;ll get a reply from the people who made the product.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              Every purchase is refundable within 7 days — see our{" "}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
