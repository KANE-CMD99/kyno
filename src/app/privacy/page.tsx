import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="bg-white pt-[105px]">
        <div className="border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <p className="text-sm text-neutral-400">
              <Link href="/" className="hover:text-neutral-600 transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-neutral-900">Privacy Policy</span>
            </p>
          </div>
        </div>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-extrabold text-neutral-900">Privacy Policy</h1>
            <p className="mt-2 text-sm text-neutral-500">Last updated: July 2026</p>

            <h2 className="mt-10 text-lg font-bold text-neutral-900">1. Information We Collect</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              When you create an account, place an order, or contact us, we may collect: name, email address,
              and purchase history. For newsletter signup, we collect only your email address. We do NOT collect
              or store payment card details — all payments are processed by third-party providers.
            </p>

            <h2 className="mt-8 text-lg font-bold text-neutral-900">2. How We Use Your Information</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              We use your information to: process and deliver your digital product purchases, send order
              confirmations and download links, respond to customer support inquiries, and (with your consent)
              send occasional product updates and promotional emails.
            </p>

            <h2 className="mt-8 text-lg font-bold text-neutral-900">3. Data Storage &amp; Security</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              Your data is stored securely and accessed only by authorized personnel. Passwords are hashed
              using industry-standard cryptography. We implement reasonable security measures to protect
              your personal information against unauthorized access or disclosure.
            </p>

            <h2 className="mt-8 text-lg font-bold text-neutral-900">4. Cookies</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              We use essential session cookies to keep you signed in and to remember your shopping cart.
              We do not use third-party tracking cookies or advertising cookies on our site.
            </p>

            <h2 className="mt-8 text-lg font-bold text-neutral-900">5. Third-Party Services</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              We may use third-party services for payment processing, email delivery, and hosting.
              These providers have their own privacy policies and are contractually obligated to protect
              your data.
            </p>

            <h2 className="mt-8 text-lg font-bold text-neutral-900">6. Your Rights (CCPA)</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              If you are a California resident, you have the right to: know what personal information we
              have collected about you, request deletion of your data, and opt out of the sale of your
              personal information. Kyno does not sell personal information. To exercise these rights,
              email us at hello@kyno.dev.
            </p>

            <h2 className="mt-8 text-lg font-bold text-neutral-900">7. Children&apos;s Privacy</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              Our services are not directed to individuals under 16. We do not knowingly collect personal
              information from children. If you believe a child has provided us with personal data, please
              contact us.
            </p>

            <h2 className="mt-8 text-lg font-bold text-neutral-900">8. Changes to This Policy</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              We may update this policy from time to time. Changes will be posted on this page with an
              updated date. Continued use of the site after changes constitutes acceptance.
            </p>

            <h2 className="mt-8 text-lg font-bold text-neutral-900">9. Contact</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              For privacy-related questions or to exercise your data rights, contact us at{" "}
              <a href="mailto:hello@kyno.dev" className="text-blue-600 hover:text-blue-700">hello@kyno.dev</a>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
