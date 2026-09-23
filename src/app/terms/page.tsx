import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that apply when you buy from Kyno — digital delivery, payment, refunds and acceptable use.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="bg-white pt-[105px]">
        <div className="border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <p className="text-sm text-neutral-400">
              <Link href="/" className="hover:text-neutral-600 transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-neutral-900">Terms of Service</span>
            </p>
          </div>
        </div>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-extrabold text-neutral-900">Terms of Service</h1>
            <p className="mt-2 text-sm text-neutral-500">Last updated: July 2026</p>

            <h2 className="mt-10 text-lg font-bold text-neutral-900">1. Acceptance of Terms</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              By accessing or purchasing from Kyno (&quot;the Site&quot;), you agree to these Terms of Service.
              If you do not agree, do not use the Site.
            </p>

            <h2 className="mt-8 text-lg font-bold text-neutral-900">2. Digital Products &amp; License</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              All products sold on Kyno are digital goods. Upon purchase, you receive a non-exclusive,
              perpetual, worldwide license to use the product in personal and commercial projects. You may
              not resell, redistribute, or sublicense the products as standalone assets. Each product page
              may specify additional license terms.
            </p>

            <h2 className="mt-8 text-lg font-bold text-neutral-900">3. Payments &amp; Pricing</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              All prices are listed in USD. We reserve the right to change prices at any time without
              prior notice. Payment is required before digital products are delivered. Applicable sales
              tax may be added at checkout based on your location.
            </p>

            <h2 className="mt-8 text-lg font-bold text-neutral-900">4. Refund Policy</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              If a product is not what you expected, you can request a refund within 7 days of
              purchase and we will refund you in full to your original payment method. You do not
              need to give a reason, and it makes no difference whether you have already downloaded
              the files.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              To request a refund, email us at {SITE.contactEmail} with the address you used at
              checkout. Refunds are issued within 5 business days of your request. Please note that
              once a refund is issued, the licence to use the product ends and you should delete any
              copies you have.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              If something is technically wrong with a product — a corrupt file, a missing page, a
              template that will not open — contact us first and we will fix it or refund you either
              way.
            </p>

            <h2 className="mt-8 text-lg font-bold text-neutral-900">5. Intellectual Property</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              All products, images, templates, and content on Kyno are protected by copyright
              and owned by Kyno or its licensors. Purchasing a product grants you a license to use it;
              it does not transfer ownership or copyright.
            </p>

            <h2 className="mt-8 text-lg font-bold text-neutral-900">6. Limitation of Liability</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              Kyno provides products &quot;as is&quot; without warranty of any kind. We are not liable for any
              damages arising from the use or inability to use our products. Our total liability for any
              claim shall not exceed the amount paid for the specific product in question.
            </p>

            <h2 className="mt-8 text-lg font-bold text-neutral-900">7. Account Terms</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              You are responsible for maintaining the confidentiality of your account credentials.
              We reserve the right to terminate accounts that violate these terms or engage in
              unauthorized redistribution of our products.
            </p>

            <h2 className="mt-8 text-lg font-bold text-neutral-900">8. Governing Law</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              These terms are governed by the laws of the Hong Kong Special Administrative Region,
              without regard to conflict of law principles. Any disputes shall be resolved in the
              courts of Hong Kong.
            </p>

            <h2 className="mt-8 text-lg font-bold text-neutral-900">9. Contact</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              For questions about these terms, contact{" "}
              <a href={`mailto:${SITE.contactEmail}`} className="text-blue-600 hover:text-blue-700">{SITE.contactEmail}</a>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
