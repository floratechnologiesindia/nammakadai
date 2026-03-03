import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type ProductPayload = {
  title: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  tags: string[];
  images: string[];
  stock: number;
  isFeatured: boolean;
  isPublished: boolean;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export function ProductFormPage({ mode }: { mode: "create" | "edit" }) {
  const { token } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<ProductPayload>({
    title: "",
    slug: "",
    description: "",
    price: 0,
    currency: "INR",
    category: "",
    tags: [],
    images: [],
    stock: 0,
    isFeatured: false,
    isPublished: true,
  });
  const [tagInput, setTagInput] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (mode === "edit" && id && token) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/admin/products?limit=1`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Failed to load product");
          const body = (await res.json()) as { items: any[] };
          const found = body.items.find((p) => p._id === id);
          if (!found) {
            throw new Error("Product not found");
          }
          setForm({
            title: found.title,
            slug: found.slug,
            description: found.description ?? "",
            price: found.price,
            currency: found.currency,
            category: found.category ?? "",
            tags: found.tags ?? [],
            images: found.images ?? [],
            stock: found.stock ?? 0,
            isFeatured: found.isFeatured ?? false,
            isPublished: found.isPublished ?? true,
          });
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load product");
        } finally {
          setLoading(false);
        }
      }
    }
    void load();
  }, [mode, id, token]);

  function updateField<K extends keyof ProductPayload>(key: K, value: ProductPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(value: string) {
    updateField("title", value);
    if (mode === "create") {
      const slug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      updateField("slug", slug);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { ...form };
      const res = await fetch(
        mode === "create"
          ? `${API_BASE_URL}/api/admin/products`
          : `${API_BASE_URL}/api/admin/products/${id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        let message = "Failed to save product";
        try {
          const data = (await res.json()) as { message?: string };
          if (data.message) message = data.message;
        } catch {
          // ignore
        }
        throw new Error(message);
      }
      navigate("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  function handleAddTag() {
    const value = tagInput.trim();
    if (!value) return;
    if (!form.tags.includes(value)) {
      updateField("tags", [...form.tags, value]);
    }
    setTagInput("");
  }

  function handleAddImage() {
    const value = imageInput.trim();
    if (!value) return;
    if (!form.images.includes(value)) {
      updateField("images", [...form.images, value]);
    }
    setImageInput("");
  }

  if (loading) {
    return <p className="text-xs text-slate-500">Loading product…</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            {mode === "create" ? "New product" : "Edit product"}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {mode === "create"
              ? "Add a new stationery item to your catalogue."
              : "Update details and visibility for this product."}
          </p>
        </div>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 text-xs">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block font-medium text-slate-700">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="w-full rounded-md border border-slate-200 px-3 py-2 outline-none ring-emerald-200 focus:border-emerald-400 focus:ring-2"
            />
          </div>
          <div>
            <label className="mb-1 block font-medium text-slate-700">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              required
              className="w-full rounded-md border border-slate-200 px-3 py-2 outline-none ring-emerald-200 focus:border-emerald-400 focus:ring-2"
            />
          </div>
          <div>
            <label className="mb-1 block font-medium text-slate-700">Category</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              placeholder="e.g. Pens, Notebooks"
              className="w-full rounded-md border border-slate-200 px-3 py-2 outline-none ring-emerald-200 focus:border-emerald-400 focus:ring-2"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="mb-1 block font-medium text-slate-700">Price</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.price}
                onChange={(e) => updateField("price", Number(e.target.value))}
                required
                className="w-full rounded-md border border-slate-200 px-3 py-2 outline-none ring-emerald-200 focus:border-emerald-400 focus:ring-2"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-slate-700">Currency</label>
              <input
                type="text"
                value={form.currency}
                onChange={(e) => updateField("currency", e.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2 outline-none ring-emerald-200 focus:border-emerald-400 focus:ring-2"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block font-medium text-slate-700">Stock</label>
            <input
              type="number"
              min={0}
              value={form.stock}
              onChange={(e) => updateField("stock", Number(e.target.value))}
              className="w-full rounded-md border border-slate-200 px-3 py-2 outline-none ring-emerald-200 focus:border-emerald-400 focus:ring-2"
            />
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block font-medium text-slate-700">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 outline-none ring-emerald-200 focus:border-emerald-400 focus:ring-2"
            />
          </div>
          <div>
            <label className="mb-1 block font-medium text-slate-700">Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="flex-1 rounded-md border border-slate-200 px-3 py-2 outline-none ring-emerald-200 focus:border-emerald-400 focus:ring-2"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() =>
                      updateField(
                        "tags",
                        form.tags.filter((t) => t !== tag)
                      )
                    }
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block font-medium text-slate-700">Image URLs</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="https://…"
                className="flex-1 rounded-md border border-slate-200 px-3 py-2 outline-none ring-emerald-200 focus:border-emerald-400 focus:ring-2"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Add
              </button>
            </div>
            <ul className="mt-2 space-y-1 text-[10px] text-slate-600">
              {form.images.map((url) => (
                <li key={url} className="flex justify-between gap-2">
                  <span className="truncate">{url}</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateField(
                        "images",
                        form.images.filter((img) => img !== url)
                      )
                    }
                    className="text-red-600"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-xs text-slate-700">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => updateField("isFeatured", e.target.checked)}
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-700">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => updateField("isPublished", e.target.checked)}
              />
              Published
            </label>
          </div>
        </div>
        <div className="md:col-span-2 flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Saving…" : mode === "create" ? "Create product" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

