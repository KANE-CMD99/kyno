"use client";

import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function ContactPage() {
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
              <span className="text-neutral-900">Contact</span>
            </p>
          </div>
        </div>

        {/* Hero */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 md:text-5xl">
              Get in touch
            </h1>
            <p className="mt-4 text-lg text-neutral-500">
              Questions about a product? Need help with licensing? Just want to say hi? We&apos;d love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Form + Info */}
        <section className="bg-neutral-50 px-6 py-16">
          <div className="mx-auto max-w-5xl grid gap-12 md:grid-cols-2">
            {/* Form */}
            <div>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-medium text-neutral-700">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    className="mt-1.5 block w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-medium text-neutral-700">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    className="mt-1.5 block w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-medium text-neutral-700">Subject</label>
                  <input
                    id="contact-subject"
                    type="text"
                    className="mt-1.5 block w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-xs font-medium text-neutral-700">Message</label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    className="mt-1.5 block w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                    placeholder="Tell us what you need..."
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Email</h3>
                <p className="mt-1 text-sm text-neutral-500">
                  <a href="mailto:33429296@qq.com" className="text-blue-600 hover:text-blue-700">33429296@qq.com</a>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Response Time</h3>
                <p className="mt-1 text-sm text-neutral-500">
                  We typically respond within 24 hours, Monday through Friday.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Follow Us</h3>
                <div className="mt-2 flex gap-4">
                  {["Twitter", "Dribbble", "GitHub"].map((platform) => (
                    <a
                      key={platform}
                      href="#"
                      className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
                    >
                      {platform}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
