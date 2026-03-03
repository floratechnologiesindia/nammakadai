import Link from "next/link";
import Image from "next/image";
import { getApiBaseUrl } from "../lib/api";

type Product = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  currency: string;
  category?: string;
  images?: string[];
};

async function fetchFeaturedProducts(): Promise<Product[]> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(
    `${baseUrl}/api/products?featured=true&limit=8`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) {
    return [];
  }
  const data = await res.json();
  return data.items ?? [];
}

export default async function Home() {
  const products = await fetchFeaturedProducts();

  return (
    <div className="bg-gradient-to-b from-emerald-50/60 to-white">
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-12 md:flex-row md:items-center md:gap-16 md:pt-20">
        <div className="flex-1 space-y-6">
          <p className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            New • Curated stationery for everyday joy
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            Elevate your desk with{" "}
            <span className="text-emerald-600">thoughtful stationery</span>.
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-zinc-600 sm:text-base">
            Discover pens, notebooks, and desk essentials designed to make
            every note, sketch, and idea feel special.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              href="/products"
              className="rounded-full bg-emerald-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-emerald-700"
            >
              Browse all products
            </Link>
            <button
              type="button"
              className="rounded-full border border-zinc-200 px-5 py-2.5 font-medium text-zinc-700 transition hover:border-emerald-300 hover:text-emerald-700"
            >
              Shop featured sets
            </button>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-zinc-500">
            <span>✓ Free shipping over ₹999</span>
            <span>✓ Handpicked stationery sets</span>
            <span>✓ Local NammaKadai curation</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-zinc-100">
            <div className="flex flex-col justify-between rounded-2xl bg-emerald-50 p-4 text-sm">
              <h3 className="font-medium text-emerald-900">Writing tools</h3>
              <p className="mt-2 text-xs text-emerald-700">
                Smooth ballpoints, gel pens, and fineliners for everyday notes.
              </p>
            </div>
            <div className="flex flex-col justify-between rounded-2xl bg-zinc-50 p-4 text-sm">
              <h3 className="font-medium text-zinc-900">Notebooks</h3>
              <p className="mt-2 text-xs text-zinc-600">
                Ruled, dotted, and plain notebooks for journaling and planning.
              </p>
            </div>
            <div className="flex flex-col justify-between rounded-2xl bg-zinc-50 p-4 text-sm">
              <h3 className="font-medium text-zinc-900">Desk essentials</h3>
              <p className="mt-2 text-xs text-zinc-600">
                Sticky notes, clips, and organizers to keep your desk tidy.
              </p>
            </div>
            <div className="flex flex-col justify-between rounded-2xl bg-emerald-50 p-4 text-sm">
              <h3 className="font-medium text-emerald-900">Gift-ready sets</h3>
              <p className="mt-2 text-xs text-emerald-700">
                Curated stationery bundles perfect for gifting.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-900">Featured products</h2>
          <Link href="/products" className="text-xs font-medium text-emerald-700 hover:text-emerald-800">
            View all
          </Link>
        </div>
        {products.length === 0 ? (
          <p className="text-sm text-zinc-500">Featured products will appear here once added.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white p-3 shadow-sm ring-1 ring-zinc-100 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {product.images?.[0] ? (
                  <div className="mb-3 overflow-hidden rounded-xl bg-zinc-50">
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      width={400}
                      height={240}
                      className="h-32 w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                    />
                  </div>
                ) : (
                  <div className="mb-3 h-32 rounded-xl bg-gradient-to-br from-emerald-100 to-zinc-50" />
                )}
                <div className="space-y-1">
                  <p className="line-clamp-2 text-sm font-medium text-zinc-900 group-hover:text-emerald-700">
                    {product.title}
                  </p>
                  {product.category && (
                    <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                      {product.category}
                    </p>
                  )}
                  <p className="text-sm font-semibold text-zinc-900">
                    {product.currency} {product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
