import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getProductDetail, getRelatedProducts } from "@/data/product-detail";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
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
            {/* Left: Preview image or placeholder */}
            <div className="aspect-[4/3] sm:aspect-[4/3] rounded-lg sm:rounded-xl bg-neutral-100 flex items-center justify-center overflow-hidden order-1 lg:order-none">
              {detail.previewImages.filter(Boolean).length > 0 ? (
                <img
                  src={detail.previewImages[0]}
                  alt={detail.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <span className="text-7xl">
                    {detail.category === "Photos" ? String.fromCodePoint(0x1F4F7)
                     : detail.category === "Fonts" ? String.fromCodePoint(0x1F524)
                     : detail.category === "Free" ? String.fromCodePoint(0x1F381)
                     : String.fromCodePoint(0x1F4D0)}
                  </span>
                  <p className="mt-3 text-sm text-neutral-400">Product preview</p>
                </div>
              )}
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
                {detail.creatorEnglishName && (
                  <span className="text-neutral-400 ml-1">({detail.creatorEnglishName})</span>
                )}
              </p>

              <p className="mt-6 text-base leading-relaxed text-neutral-600">
                {detail.description}
              </p>

              {/* Price + CTA */}
              <div className="mt-8 flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <PriceDisplay
                    price={detail.price}
                    originalPrice={detail.originalPrice}
                    className="text-3xl font-bold text-neutral-900"
                    originalClassName="text-lg text-neutral-400 line-through"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <AddToCartButton
                  id={detail.id}
                  name={detail.name}
                  price={detail.price}
                  category={detail.category}
                  className="w-full sm:w-auto rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                />
                <button className="w-full sm:w-auto rounded-lg border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400">
                  Save
                </button>
              </div>

              <p className="mt-3 text-xs text-neutral-400">
                Pay once, own forever. Lifetime access included.
              </p>
            </div>
          </div>
        </section>

        {/* Features + Includes — only show if there's content */}
        {(hasFeatures || hasIncludes) ? (
          <section className="bg-neutral-50 px-4 sm:px-6 py-12 sm:py-16">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-lg font-bold text-neutral-900 text-center mb-6 sm:mb-8">What&apos;s inside</h2>
              <div className="grid gap-8 sm:gap-12 lg:grid-cols-2">
                {hasFeatures && (
                  <div>
                    <h3 className="text-base font-semibold text-neutral-900">Features</h3>
                    <ul className="mt-4 space-y-2.5">
                      {detail.features.filter(Boolean).map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-600">
                          <svg className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {hasIncludes && (
                  <div>
                    <h3 className="text-base font-semibold text-neutral-900">What&apos;s included</h3>
                    <ul className="mt-4 space-y-2.5">
                      {detail.includes.filter(Boolean).map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-600">
                          <svg className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : (
          <section className="bg-neutral-50 px-4 sm:px-6 py-12 sm:py-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-lg font-bold text-neutral-900">What&apos;s inside</h2>
              <p className="mt-4 text-sm leading-relaxed text-neutral-600 px-2 sm:px-0">
                {detail.description || "This digital product includes downloadable files ready for use in your projects."}
              </p>
              {detail.previewImages.filter(Boolean).length > 1 && (
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {detail.previewImages.filter(Boolean).slice(1).map((url, i) => (
                    <img key={i} src={url} alt="" className="rounded-lg object-cover w-full aspect-[4/3]" />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

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
      <Footer />
    </>
  );
}
