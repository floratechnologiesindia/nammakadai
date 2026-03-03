import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type User = {
  _id: string;
  email: string;
  name?: string;
  roles: string[];
  isActive: boolean;
  createdAt: string;
};

type UsersResponse = {
  items: User[];
  page: number;
  totalPages: number;
  total: number;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export function UsersListPage() {
  const { token } = useAuth();
  const [data, setData] = useState<UsersResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  async function load(targetPage: number) {
    setLoading(true);
    setError(null);
    try {
      const url = new URL("/api/admin/users", API_BASE_URL);
      url.searchParams.set("page", String(targetPage));
      url.searchParams.set("limit", String(pageSize));

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!res.ok) {
        throw new Error("Failed to load users");
      }
      const body = (await res.json()) as UsersResponse;
      setData(body);
      setPage(body.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
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
    if (!window.confirm("Delete this user? This cannot be undone.")) {
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (!res.ok && res.status !== 204) {
        throw new Error("Failed to delete user");
      }
      void load(page);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete user");
    }
  }

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2">
        <div>
          <h1 className="h5 mb-1">Users</h1>
          <p className="text-muted small mb-0">
            Manage admin and customer accounts for the platform.
          </p>
        </div>
        <Link to="/users/new" className="btn btn-success btn-sm align-self-start">
          + New user
        </Link>
      </div>
      {loading && <p className="text-muted small mb-0">Loading users…</p>}
      {error && <p className="text-danger small mb-0">{error}</p>}
      {data && data.items.length === 0 && !loading ? (
        <p className="text-muted small mb-0">No users found.</p>
      ) : null}
      {data && data.items.length > 0 && (
        <div className="table-responsive">
          <table className="table table-sm align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Roles</th>
                <th scope="col">Status</th>
                <th scope="col">Created</th>
                <th scope="col" className="text-end">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((user) => (
                <tr key={user._id}>
                  <td>
                    <span className="fw-semibold small">{user.name || "—"}</span>
                  </td>
                  <td className="small text-muted text-break">{user.email}</td>
                  <td className="small text-muted">{user.roles.join(", ")}</td>
                  <td>
                    <span
                      className={`badge rounded-pill ${
                        user.isActive ? "bg-success-subtle text-success" : "bg-secondary-subtle text-secondary"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="small text-muted">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="text-end">
                    <div className="btn-group btn-group-sm">
                      <Link to={`/users/${user._id}/edit`} className="btn btn-outline-secondary">
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => void handleDelete(user._id)}
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
                Page {data.page} of {data.totalPages} · {data.total} users
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

