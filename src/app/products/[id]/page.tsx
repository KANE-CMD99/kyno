import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getProductDetail, getRelatedProducts } from "@/data/product-detail";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import ProductDescription from "@/components/ProductDescription";
import MobileBuyBar from "@/components/MobileBuyBar";
import AddToCartButton from "@/components/AddToCartButton";
import PriceDisplay from "@/components/PriceDisplay";
import ProductComments from "@/components/ProductComments";
import ProductStructuredData from "@/components/ProductStructuredData";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const detail = await getProductDetail(id);
  if (!detail) return { title: "Not Found" };
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.kyno.ltd"}/products/${id}`;
  const imageUrl = detail.previewImages?.[0]?.startsWith("http")
    ? detail.previewImages[0]
    : detail.previewImages?.[0]
      ? `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.kyno.ltd"}${detail.previewImages[0]}`
      : undefined;

  return {
    title: `${detail.name} — $${detail.price} | Kyno`,
    description: detail.description.slice(0, 160),
    alternates: { canonical: url },
    openGraph: {
      title: `${detail.name} — Kyno`,
      description: detail.description.slice(0, 160),
      type: "article",
      url,
      ...(imageUrl ? { images: [{ url: imageUrl, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: detail.name,
      description: detail.description.slice(0, 160),
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const detail = await getProductDetail(id);
  if (!detail) notFound();

  const relatedProducts = await getRelatedProducts(id);

  const hasFeatures = detail.features.filter(Boolean).length > 0;
  const hasIncludes = detail.includes.filter(Boolean).length > 0;
  const images = detail.previewImages.filter(Boolean).slice(0, 3);
  const highlights = detail.features.filter(Boolean).slice(0, 4);

  return (
    <>
      <ProductStructuredData
        name={detail.name}
        description={detail.description}
        image={detail.previewImages?.[0]}
        price={detail.price}
        category={detail.category}
        productUrl={`${process.env.NEXT_PUBLIC_SITE_URL || "https://www.kyno.ltd"}/products/${detail.id}`}
      />
      <Nav />
      <main className="bg-white pt-[105px]">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 sm:pt-8">
          <p className="text-xs sm:text-sm text-neutral-400 truncate">
            <Link href="/" className="hover:text-neutral-600 transition-colors">Home</Link>
            <span className="mx-1.5 sm:mx-2">/</span>
            <Link href={`/categories/${detail.category.toLowerCase()}`} className="hover:text-neutral-600 transition-colors">{detail.category}</Link>
            <span className="mx-1.5 sm:mx-2">/</span>
            <span className="text-neutral-900">{detail.name}</span>
          </p>
        </div>

        {/* Hero: stacked on mobile, 2-col on desktop */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-2">
            {/* Left: Preview gallery or placeholder */}
            <div className="order-1 lg:order-none">
              {images.length > 0 ? (
                <ProductGallery images={images} name={detail.name} />
              ) : (
                <div className="aspect-[4/3] rounded-lg sm:rounded-xl bg-neutral-100 flex items-center justify-center overflow-hidden">
                  <div className="text-center">
                    <span className="text-7xl">
                      {detail.category === "Photos" ? String.fromCodePoint(0x1F4F7)
                       : detail.category === "Fonts" ? String.fromCodePoint(0x1F524)
                       : detail.category === "Free" ? String.fromCodePoint(0x1F381)
                       : String.fromCodePoint(0x1F4D0)}
                    </span>
                    <p className="mt-3 text-sm text-neutral-400">Product preview</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
                  {detail.category}
                </span>
                <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium text-neutral-500">
                  Digital Download
                </span>
              </div>

              <h1 className="mt-3 text-3xl font-bold leading-tight text-neutral-900 md:text-4xl">
                {detail.name}
              </h1>

              {/* Creator card */}
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-neutral-200 p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {(detail.creatorEnglishName || detail.creator).charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-900">
                    {detail.creatorEnglishName || detail.creator}
                  </p>
                  <p className="text-xs text-neutral-500">Creator</p>
                </div>
                {detail.creatorUsername && (
                  <Link href={`/${detail.creatorUsername}`} className="shrink-0 text-xs font-medium text-blue-600 hover:text-blue-700">
                    View Store
                  </Link>
                )}
              </div>

              {/* Highlights */}
              {highlights.length > 0 && (
                <ul className="mt-5 space-y-2.5">
                  {highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-700">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Price */}
              <div className="mt-6 flex items-center gap-3">
                <PriceDisplay
                  price={detail.price}
                  originalPrice={detail.originalPrice}
                  className="text-3xl font-bold text-neutral-900"
                  originalClassName="text-lg text-neutral-400 line-through"
                />
              </div>

              {/* CTA */}
              <div className="mt-5">
                {detail.price === 0 ? (
                  <Link
                    href="/free-downloads"
                    className="block w-full rounded-lg bg-emerald-600 px-8 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                  >
                    Download Free
                  </Link>
                ) : (
                  <AddToCartButton
                    id={detail.id}
                    name={detail.name}
                    price={detail.price}
                    category={detail.category}
                    className="w-full rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 shadow-sm shadow-blue-200"
                  />
                )}
              </div>

              {/* Trust badges */}
              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-neutral-100 pt-5">
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <span className="text-xl">⚡</span>
                  <span className="text-[11px] font-medium leading-tight text-neutral-600">Instant delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <span className="text-xl">🔒</span>
                  <span className="text-[11px] font-medium leading-tight text-neutral-600">Secure payment</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <span className="text-xl">∞</span>
                  <span className="text-[11px] font-medium leading-tight text-neutral-600">Lifetime access</span>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6 border-t border-neutral-100 pt-5">
                <h2 className="text-sm font-bold text-neutral-900">About this product</h2>
                <div className="mt-2">
                  <ProductDescription description={detail.description} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What's inside — visual quick-glance format */}
        {hasFeatures || hasIncludes ? (
          <section className="bg-neutral-50 px-4 sm:px-6 py-14 sm:py-20">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-xl font-bold text-neutral-900 text-center mb-2">What&apos;s inside</h2>
              <p className="text-sm text-neutral-500 text-center mb-10">
                Everything included in this product
              </p>
              <div className={`grid gap-6 ${hasFeatures && hasIncludes ? "md:grid-cols-2" : "max-w-lg mx-auto"}`}>
                {hasFeatures && (
                  <div className="rounded-xl border border-neutral-200 bg-white p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700 text-sm font-bold">✨</span>
                      <h3 className="text-sm font-bold text-neutral-900">Key Features</h3>
                    </div>
                    <ul className="space-y-2.5">
                      {detail.features.filter(Boolean).map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-600">
                          <svg className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {hasIncludes && (
                  <div className="rounded-xl border border-neutral-200 bg-white p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-100 text-green-700 text-sm font-bold">📦</span>
                      <h3 className="text-sm font-bold text-neutral-900">What&apos;s Included</h3>
                    </div>
                    <ul className="space-y-2.5">
                      {detail.includes.filter(Boolean).map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-600">
                          <svg className="mt-0.5 h-4 w-4 shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : null}

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="bg-white px-4 sm:px-6 py-14 sm:py-20">
            <div className="mx-auto max-w-7xl text-center">
              <h2 className="text-2xl font-bold text-neutral-900">
                More {detail.category}
              </h2>
              <p className="mt-2 text-sm text-neutral-500">
                You might also like
              </p>
              <div className="mt-8 grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((product, i) => {
                  const cardProduct = {
                    id: product.id,
                    name: product.name,
                    category: product.category,
                    price: `$${product.price}`,
                    creator: product.creator,
                    thumbnail: product.previewImages?.[0],
                  };
                  return (
                    <Link key={product.id} href={`/products/${product.id}`}>
                      <ProductCard product={cardProduct} index={i} />
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Comments */}
        <ProductComments productId={detail.id} />
      </main>
      <MobileBuyBar
        id={detail.id}
        name={detail.name}
        price={detail.price}
        originalPrice={detail.originalPrice}
        category={detail.category}
      />
      <Footer />
    </>
  );
}
