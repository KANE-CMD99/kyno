import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductDetail } from "@/data/product-detail";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import AddToCartButton from "@/components/AddToCartButton";
import { products } from "@/data/site";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const detail = getProductDetail(id);
  if (!detail) notFound();

  const relatedProducts = products.filter(
    (p) => p.category === detail.category && p.id !== id
  );

  return (
    <>
      <Nav />
      <main className="bg-white pt-[105px]">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-7xl px-6 pt-8">
          <p className="text-sm text-neutral-400">
            <Link href="/" className="hover:text-neutral-600 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/#products" className="hover:text-neutral-600 transition-colors">{detail.category}</Link>
            <span className="mx-2">/</span>
            <span className="text-neutral-900">{detail.name}</span>
          </p>
        </div>

        {/* Hero: 2-col */}
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Left: Preview placeholder */}
            <div className="aspect-[4/3] rounded-xl bg-neutral-100 flex items-center justify-center">
              <div className="text-center">
                <span className="text-7xl">
                  {detail.category === "Photos" ? String.fromCodePoint(0x1F4F7)
                   : detail.category === "Fonts" ? String.fromCodePoint(0x1F524)
                   : String.fromCodePoint(0x1F4D0)}
                </span>
                <p className="mt-3 text-sm text-neutral-400">Product preview</p>
              </div>
            </div>

            {/* Right: Info */}
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
                {detail.category}
              </span>
              <h1 className="mt-2 text-3xl font-bold text-neutral-900 md:text-4xl">
                {detail.name}
              </h1>
              <p className="mt-2 text-sm text-neutral-500">
                by <span className="font-medium text-neutral-700">{detail.creator}</span>
              </p>

              <p className="mt-6 text-base leading-relaxed text-neutral-600">
                {detail.description}
              </p>

              {/* Price + CTA */}
              <div className="mt-8 flex items-center gap-4">
                <div>
                  <span className="text-3xl font-bold text-neutral-900">${detail.price}</span>
                  {detail.originalPrice && (
                    <span className="ml-2 text-lg text-neutral-400 line-through">
                      ${detail.originalPrice}
                    </span>
                  )}
                </div>
                {detail.originalPrice && (
                  <span className="rounded bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
                    {Math.round((1 - detail.price / detail.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <AddToCartButton
                  id={detail.id}
                  name={detail.name}
                  price={detail.price}
                  category={detail.category}
                  className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                />
                <button className="rounded-lg border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400">
                  Save
                </button>
              </div>

              <p className="mt-3 text-xs text-neutral-400">
                Pay once, own forever. Lifetime access included.
              </p>
            </div>
          </div>
        </section>

        {/* Features + Includes */}
        <section className="bg-neutral-50 px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 md:grid-cols-2">
              {/* Features */}
              <div>
                <h2 className="text-lg font-bold text-neutral-900">Features</h2>
                <ul className="mt-4 space-y-2.5">
                  {detail.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-600">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* What's included */}
              <div>
                <h2 className="text-lg font-bold text-neutral-900">What&apos;s included</h2>
                <ul className="mt-4 space-y-2.5">
                  {detail.includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-600">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="bg-white px-6 py-20">
            <div className="mx-auto max-w-7xl text-center">
              <h2 className="text-2xl font-bold text-neutral-900">
                More {detail.category}
              </h2>
              <p className="mt-2 text-sm text-neutral-500">
                You might also like
              </p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((product, i) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <ProductCard product={product} index={i} />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
