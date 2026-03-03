import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getApiBaseUrl } from "../../../lib/api";

type Product = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;
  category?: string;
  tags?: string[];
  images?: string[];
};

async function fetchProduct(slug: string): Promise<Product | null> {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/products/${slug}`, { cache: "no-store" });
    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch {
    return null;
  }
}

// Avoid build-time data fetching so Docker image builds don't require a running backend
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = `${siteUrl}/products/${slug}`;
  const description =
    "Discover stationery details, pricing, and specs for this NammaKadai product.";

  return {
    title: `Product details`,
    description,
    openGraph: {
      title: `Product details`,
      description,
      url,
      type: "website",
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm text-zinc-500">Product not found.</p>
        <Link href="/products" className="mt-4 inline-block text-sm font-medium text-emerald-700">
          ← Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/products" className="mb-4 inline-block text-xs font-medium text-emerald-700">
        ← Back to products
      </Link>

      <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)]">
        <div>
          {product.images?.[0] ? (
            <div className="overflow-hidden rounded-3xl bg-zinc-50">
              <Image
                src={product.images[0]}
                alt={product.title}
                width={640}
                height={400}
                className="h-64 w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-64 rounded-3xl bg-gradient-to-br from-emerald-100 to-zinc-50" />
          )}
        </div>
        <div className="space-y-4">
          {product.category && (
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              {product.category}
            </p>
          )}
          <h1 className="text-2xl font-semibold text-zinc-900 sm:text-3xl">{product.title}</h1>
          <p className="text-lg font-semibold text-zinc-900">
            {product.currency} {product.price.toFixed(2)}
          </p>
          {product.description && (
            <p className="text-sm leading-relaxed text-zinc-600">{product.description}</p>
          )}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <button
            type="button"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
          >
            Enquire about this product
          </button>
        </div>
      </div>
    </div>
  );
}

