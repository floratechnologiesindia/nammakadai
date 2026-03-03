export function getApiBaseUrl() {
  // When running in Docker, use INTERNAL_API_BASE_URL (e.g. http://backend:4000)
  if (process.env.INTERNAL_API_BASE_URL) {
    return process.env.INTERNAL_API_BASE_URL;
  }

  // Fallback for local dev outside Docker
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
}

