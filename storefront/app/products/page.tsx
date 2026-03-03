import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getApiBaseUrl } from "../../lib/api";
//Comment

type Product = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  currency: string;
  category?: string;
  images?: string[];
};

interface ProductsResponse {
  items: Product[];
  page: number;
  totalPages: number;
  total: number;
}

export const metadata: Metadata = {
  title: "All stationery products",
  description: "Browse all notebooks, pens, and stationery sets available at NammaKadai.",
};

async function fetchProducts(
  searchParams: Record<string, string | string[] | undefined>
): Promise<ProductsResponse> {
  const baseUrl = getApiBaseUrl();
  const page = typeof searchParams.page === "string" ? searchParams.page : "1";
  const search = typeof searchParams.search === "string" ? searchParams.search : "";
  const category = typeof searchParams.category === "string" ? searchParams.category : "";

  const url = new URL("/api/products", baseUrl);
  url.searchParams.set("page", page);
  url.searchParams.set("limit", "16");
  if (search) url.searchParams.set("search", search);
  if (category) url.searchParams.set("category", category);

  try {
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) {
      return { items: [], page: 1, totalPages: 1, total: 0 };
    }
    return res.json();
  } catch {
    // During Docker image builds the backend may not be reachable
    return { items: [], page: 1, totalPages: 1, total: 0 };
  }
}

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const data = await fetchProducts(searchParams);
  const { items, page, totalPages } = data;
  const currentSearch = typeof searchParams.search === "string" ? searchParams.search : "";
  const currentCategory = typeof searchParams.category === "string" ? searchParams.category : "";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">All products</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Browse all stationery products available in NammaKadai.
          </p>
        </div>
        <form className="flex flex-wrap gap-3 text-sm">
          <input
            type="text"
            name="search"
            placeholder="Search by name or category"
            defaultValue={currentSearch}
            className="w-56 rounded-full border border-zinc-200 px-3 py-2 text-sm outline-none ring-emerald-200 focus:border-emerald-400 focus:ring-2"
          />
          <input
            type="text"
            name="category"
            placeholder="Category (e.g. Pens)"
            defaultValue={currentCategory}
            className="w-40 rounded-full border border-zinc-200 px-3 py-2 text-sm outline-none ring-emerald-200 focus:border-emerald-400 focus:ring-2"
          />
          <button
            type="submit"
            className="rounded-full bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
          >
            Filter
          </button>
        </form>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">No products found. Try adjusting your filters.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((product) => (
            <Link
              key={product._id}
              href={`/products/${product.slug}`}
              className="group flex flex-col rounded-2xl bg-white p-3 shadow-sm ring-1 ring-zinc-100 transition hover:-translate-y-0.5 hover:shadow-md"
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
                <div className="mb-3 h-32 rounded-xl bg-gradient-to-br from-zinc-50 to-emerald-50" />
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

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2 text-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const isActive = p === page;
            const query = new URLSearchParams();
            query.set("page", String(p));
            if (currentSearch) query.set("search", currentSearch);
            if (currentCategory) query.set("category", currentCategory);

            return (
              <Link
                key={p}
                href={`/products?${query.toString()}`}
                className={`rounded-full px-3 py-1 ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-50"
                }`}
              >
                {p}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

