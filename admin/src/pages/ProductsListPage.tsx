import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Product = {
  _id: string;
  title: string;
  slug: string;
  category?: string;
  price: number;
  currency: string;
  stock?: number;
  isPublished: boolean;
  isFeatured: boolean;
};

type ProductsResponse = {
  items: Product[];
  page: number;
  totalPages: number;
  total: number;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export function ProductsListPage() {
  const { token } = useAuth();
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  async function load(targetPage: number) {
    setLoading(true);
    setError(null);
    try {
      const url = new URL("/api/admin/products", API_BASE_URL);
      url.searchParams.set("page", String(targetPage));
      url.searchParams.set("limit", String(pageSize));

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!res.ok) {
        throw new Error("Failed to load products");
      }
      const body = (await res.json()) as ProductsResponse;
      setData(body);
      setPage(body.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      void load(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this product? This cannot be undone.")) {
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!res.ok) {
        throw new Error("Failed to delete product");
      }
      void load(page);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete product");
    }
  }

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2">
        <div>
          <h1 className="h5 mb-1">Products</h1>
          <p className="text-muted small mb-0">
            Manage stationery products visible on the public storefront.
          </p>
        </div>
        <Link to="/products/new" className="btn btn-success btn-sm align-self-start">
          + New product
        </Link>
      </div>
      {loading && <p className="text-muted small mb-0">Loading products…</p>}
      {error && <p className="text-danger small mb-0">{error}</p>}
      {data && data.items.length === 0 && !loading ? (
        <p className="text-muted small mb-0">No products yet. Create your first product.</p>
      ) : null}
      {data && data.items.length > 0 && (
        <div className="table-responsive">
          <table className="table table-sm align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Category</th>
                <th scope="col">Price</th>
                <th scope="col">Stock</th>
                <th scope="col">Featured</th>
                <th scope="col">Published</th>
                <th scope="col" className="text-end">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className="d-flex flex-column">
                      <span className="fw-semibold small">{product.title}</span>
                      <span className="text-muted text-uppercase small">{product.slug}</span>
                    </div>
                  </td>
                  <td className="small text-muted">{product.category || "—"}</td>
                  <td className="small text-muted">
                    {product.currency} {product.price.toFixed(2)}
                  </td>
                  <td className="small text-muted">{product.stock ?? 0}</td>
                  <td>
                    <span
                      className={`badge rounded-pill ${
                        product.isFeatured ? "bg-success-subtle text-success" : "bg-secondary-subtle text-secondary"
                      }`}
                    >
                      {product.isFeatured ? "Featured" : "No"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge rounded-pill ${
                        product.isPublished ? "bg-success-subtle text-success" : "bg-secondary-subtle text-secondary"
                      }`}
                    >
                      {product.isPublished ? "Published" : "Hidden"}
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="btn-group btn-group-sm">
                      <Link to={`/products/${product._id}/edit`} className="btn btn-outline-secondary">
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => void handleDelete(product._id)}
                        className="btn btn-outline-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-2">
              <small className="text-muted">
                Page {data.page} of {data.totalPages} · {data.total} products
              </small>
              <div className="btn-group btn-group-sm">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  disabled={page <= 1 || loading}
                  onClick={() => void load(page - 1)}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  disabled={page >= data.totalPages || loading}
                  onClick={() => void load(page + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

