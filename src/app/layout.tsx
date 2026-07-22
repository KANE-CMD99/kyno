import type { Metadata } from "next";
import { CartProvider } from "@/components/CartContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kyno — Premium Digital Assets for Creators",
  description:
    "Premium stock photos, templates, icons, and fonts crafted for the global creator economy.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
