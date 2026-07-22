"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function CheckoutPage() {
  const { items, subtotal, clearCart, itemCount } = useCart();
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <>
        <Nav />
        <main className="flex min-h-[80vh] items-center justify-center bg-[#FAFAFA] pt-[105px]">
          <div className="text-center px-6">
            <span className="text-6xl select-none">{String.fromCodePoint(0x2705)}</span>
            <h1 className="mt-6 text-3xl font-bold text-neutral-900">Order confirmed!</h1>
            <p className="mt-3 text-neutral-500 max-w-sm mx-auto">
              Thank you for your purchase. Your download links have been sent to your email.
            </p>
            <Link
              href="/"
              className="mt-8 inline-block rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Back to Store
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Nav />
        <main className="flex min-h-[80vh] items-center justify-center bg-[#FAFAFA] pt-[105px]">
          <div className="text-center px-6">
            <span className="text-6xl select-none">{String.fromCodePoint(0x1F6D2)}</span>
            <h1 className="mt-6 text-2xl font-bold text-neutral-900">Your cart is empty</h1>
            <p className="mt-2 text-neutral-500">Add some products before checking out.</p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Browse Products
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="bg-[#FAFAFA] pt-[105px]">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <h1 className="text-2xl font-bold text-neutral-900">Checkout</h1>
          <p className="mt-1 text-sm text-neutral-500">{itemCount} {itemCount === 1 ? "item" : "items"} in your cart</p>

          <div className="mt-8 grid gap-8 lg:grid-cols-5">
            {/* Order summary */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-neutral-200 bg-white p-6">
                <h2 className="text-sm font-bold text-neutral-900">Order Summary</h2>
                <ul className="mt-4 space-y-3">
                  {items.map((item) => (
                    <li key={item.id} className="flex justify-between text-sm">
                      <span className="text-neutral-600">
                        {item.name} <span className="text-neutral-400">x{item.quantity}</span>
                      </span>
                      <span className="font-medium text-neutral-900">${item.price * item.quantity}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 border-t border-neutral-200 pt-4 flex justify-between text-sm font-bold">
                  <span className="text-neutral-900">Total</span>
                  <span className="text-neutral-900">${subtotal}</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  clearCart();
                  setSubmitted(true);
                }}
                className="rounded-xl border border-neutral-200 bg-white p-6"
              >
                <h2 className="text-sm font-bold text-neutral-900">Contact Information</h2>
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-neutral-700">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      required
                      className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-neutral-700">Email</label>
                    <input
                      id="email"
                      type="email"
                      required
                      className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="you@example.com"
                    />
                    <p className="mt-1 text-xs text-neutral-400">
                      Download links will be sent to this email.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Complete Purchase — ${subtotal}
                </button>
                <p className="mt-3 text-center text-xs text-neutral-400">
                  This is a demo — no real payment will be processed.
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
