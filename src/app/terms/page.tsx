import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

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
              Due to the digital nature of our products, all sales are final. We do not offer refunds
              or exchanges once a product has been downloaded. If you experience technical issues with
              a product, please contact us at 33429296@qq.com and we will work to resolve the problem.
              Exceptions may be made at our sole discretion in cases of duplicate purchases or
              demonstrable product defects.
            </p>

            <h2 className="mt-8 text-lg font-bold text-neutral-900">5. Intellectual Property</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              All products, images, fonts, templates, and content on Kyno are protected by copyright
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
              These terms are governed by the laws of the State of California, without regard to
              conflict of law principles. Any disputes shall be resolved in the courts of California.
            </p>

            <h2 className="mt-8 text-lg font-bold text-neutral-900">9. Contact</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              For questions about these terms, contact{" "}
              <a href="mailto:33429296@qq.com" className="text-blue-600 hover:text-blue-700">33429296@qq.com</a>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
