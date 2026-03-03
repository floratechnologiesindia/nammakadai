import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { type AuthUser } from "../api/client";

type CountResponse = {
  total: number;
};

async function fetchJson<T>(path: string, token: string | null): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const res = await fetch(`${baseUrl}${path}`, { headers });
  if (!res.ok) {
    throw new Error("Failed to load dashboard data");
  }
  return (await res.json()) as T;
}

export function DashboardPage() {
  const { user, token } = useAuth();
  const [productCount, setProductCount] = useState<number | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const products = await fetchJson<{ total: number }>("/api/admin/products?limit=1", token);
        const users = await fetchJson<{ total: number }>("/api/admin/users?limit=1", token);
        setProductCount(products.total);
        setUserCount(users.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      }
    }
    if (token) {
      void load();
    }
  }, [token]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-xs text-slate-500">
          Overview of your stationery catalogue and admin users.
        </p>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Total products
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {productCount === null ? "–" : productCount}
          </p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Total users
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {userCount === null ? "–" : userCount}
          </p>
        </div>
      </div>
      {user && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-xs text-emerald-800">
          Logged in as <span className="font-medium">{(user as AuthUser).email}</span>
        </div>
      )}
    </div>
  );
}

