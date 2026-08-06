import { notFound } from "next/navigation";
import Link from "next/link";
import { getCreatorByUsername } from "@/db/creators";
import { getAllProducts } from "@/db/products-store";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function CreatorProfilePage({ params }: PageProps) {
  const { username } = await params;
  const creator = await getCreatorByUsername(username.toLowerCase());
  if (!creator) notFound();

  const products = (await getAllProducts()).filter(
    (p) => p.creatorId === creator.id || p.creator === creator.name
  );

  return (
    <>
      <Nav />
      <main className="bg-[#FAFAFA] pt-[105px]">
        {/* Profile header */}
        <section className="bg-white border-b border-neutral-200 px-6 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white">
              {creator.name.charAt(0)}
            </div>
            <h1 className="mt-4 text-2xl font-bold text-neutral-900">{creator.name}</h1>
            {creator.englishName && (
              <p className="mt-0.5 text-base text-neutral-500 font-medium">{creator.englishName}</p>
            )}
            <p className="mt-1 text-sm text-neutral-500">@{creator.username}</p>
            {creator.bio && (
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-neutral-600">{creator.bio}</p>
            )}
            <div className="mt-4 flex items-center justify-center gap-6 text-sm text-neutral-500">
              <span>{products.length} products</span>
              <span>{creator.totalSales} sales</span>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-xl font-bold text-neutral-900 text-center">Products by {creator.name}</h2>
            {products.length === 0 ? (
              <p className="mt-8 text-center text-sm text-neutral-400">No products yet. Check back soon.</p>
            ) : (
              <div className="mt-8 flex flex-wrap justify-center gap-5">
                {products.map((product, i) => (
                  <div key={product.id} className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]">
                    <Link href={`/products/${product.id}`} className="block">
                      <ProductCard product={{ id: product.id, name: product.name, category: product.category, price: `$${product.price}`, originalPrice: product.originalPrice ? `$${product.originalPrice}` : undefined, creator: creator.name, thumbnail: product.previewImages?.[0] }} index={i} />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
