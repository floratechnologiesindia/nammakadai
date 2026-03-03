const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export interface ApiError {
  message: string;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("authToken");
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    let message = "Something went wrong";
    try {
      const data = (await res.json()) as ApiError;
      if (data.message) message = data.message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  if (res.status === 204) {
    // no content
    return undefined as T;
  }
  return (await res.json()) as T;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  roles: string[];
}

export async function login(email: string, password: string) {
  return request<{ token: string; user: AuthUser }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

