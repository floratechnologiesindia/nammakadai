import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type UserPayload = {
  email: string;
  name: string;
  roles: string[];
  isActive: boolean;
  password?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export function UserFormPage({ mode }: { mode: "create" | "edit" }) {
  const { token } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<UserPayload>({
    email: "",
    name: "",
    roles: ["admin"],
    isActive: true,
    password: "",
  });
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (mode === "edit" && id && token) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/admin/users?limit=1`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Failed to load user");
          const body = (await res.json()) as { items: any[] };
          const found = body.items.find((u) => u._id === id);
          if (!found) {
            throw new Error("User not found");
          }
          setForm({
            email: found.email,
            name: found.name ?? "",
            roles: found.roles ?? [],
            isActive: found.isActive ?? true,
          });
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load user");
        } finally {
          setLoading(false);
        }
      }
    }
    void load();
  }, [mode, id, token]);

  function updateField<K extends keyof UserPayload>(key: K, value: UserPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleRole(role: string) {
    if (form.roles.includes(role)) {
      updateField(
        "roles",
        form.roles.filter((r) => r !== role)
      );
    } else {
      updateField("roles", [...form.roles, role]);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload: UserPayload = {
        email: form.email,
        name: form.name,
        roles: form.roles,
        isActive: form.isActive,
      };
      if (form.password) {
        payload.password = form.password;
      }
      const res = await fetch(
        mode === "create" ? `${API_BASE_URL}/api/admin/users` : `${API_BASE_URL}/api/admin/users/${id}`,
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
        let message = "Failed to save user";
        try {
          const data = (await res.json()) as { message?: string };
          if (data.message) message = data.message;
        } catch {
          // ignore
        }
        throw new Error(message);
      }
      navigate("/users");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save user");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-xs text-slate-500">Loading user…</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            {mode === "create" ? "New user" : "Edit user"}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Configure access and details for this account.
          </p>
        </div>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 text-xs">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              required
              disabled={mode === "edit"}
              className="w-full rounded-md border border-slate-200 px-3 py-2 outline-none ring-emerald-200 focus:border-emerald-400 focus:ring-2 disabled:bg-slate-50"
            />
          </div>
          <div>
            <label className="mb-1 block font-medium text-slate-700">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 outline-none ring-emerald-200 focus:border-emerald-400 focus:ring-2"
            />
          </div>
          <div>
            <label className="mb-1 block font-medium text-slate-700">Roles</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={form.roles.includes("admin")}
                  onChange={() => toggleRole("admin")}
                />
                Admin
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={form.roles.includes("customer")}
                  onChange={() => toggleRole("customer")}
                />
                Customer
              </label>
            </div>
          </div>
          <div>
            <label className="mb-1 block font-medium text-slate-700">Status</label>
            <label className="flex items-center gap-2 text-xs text-slate-700">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => updateField("isActive", e.target.checked)}
              />
              Active
            </label>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block font-medium text-slate-700">
              {mode === "create" ? "Password" : "Reset password (optional)"}
            </label>
            <input
              type="password"
              value={form.password ?? ""}
              onChange={(e) => updateField("password", e.target.value)}
              placeholder={mode === "edit" ? "Leave blank to keep current password" : ""}
              className="w-full rounded-md border border-slate-200 px-3 py-2 outline-none ring-emerald-200 focus:border-emerald-400 focus:ring-2"
            />
            {mode === "create" && (
              <p className="mt-1 text-[10px] text-slate-500">
                Password must be at least 6 characters.
              </p>
            )}
          </div>
        </div>
        <div className="md:col-span-2 flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => navigate("/users")}
            className="rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Saving…" : mode === "create" ? "Create user" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

