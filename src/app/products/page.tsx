import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts } from "@/db/products-store";
import { categoryFull } from "@/data/site";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kyno.ltd";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse every template, font and photo pack on Kyno — pay once, own forever, from $1.",
  alternates: { canonical: `${SITE_URL}/products` },
  openGraph: {
    title: "All Products — Kyno",
    description:
      "Browse every template, font and photo pack on Kyno — pay once, own forever, from $1.",
    type: "website",
    url: `${SITE_URL}/products`,
  },
};

export const revalidate = 3600;

const CATEGORY_ORDER = ["Templates", "Fonts", "Photos", "Free"];

export default async function ProductsIndexPage() {
  const products = await getAllProducts();

  const groups = CATEGORY_ORDER.map((cat) => ({
    cat,
    items: products.filter((p) => p.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      <Nav />
      <main className="bg-[#FAFAFA] pt-[105px]">
        <div className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <p className="text-sm text-neutral-400">
              <Link href="/" className="hover:text-neutral-600 transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-neutral-900">Products</span>
            </p>
          </div>
        </div>

        <section className="bg-white px-6 py-12">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-3xl font-bold text-neutral-900 md:text-4xl">All Products</h1>
            <p className="mx-auto mt-3 max-w-lg text-neutral-500">
              {products.length} digital downloads — pay once, own forever.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-14 px-6 py-12">
          {groups.length === 0 ? (
            <p className="py-20 text-center text-sm text-neutral-400">No products yet.</p>
          ) : (
            groups.map(({ cat, items }) => (
              <section key={cat}>
                <h2 className="text-2xl font-bold text-neutral-900">{categoryFull(cat)}</h2>
                <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
                  {items.map((p, i) => (
                    <ProductCard
                      key={p.id}
                      index={i}
                      product={{
                        id: p.id,
                        name: p.name,
                        category: p.category,
                        price: `$${p.price}`,
                        ...(p.originalPrice ? { originalPrice: `$${p.originalPrice}` } : {}),
                        creator: p.creator,
                        thumbnail: p.previewImages?.[0],
                      }}
                    />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
