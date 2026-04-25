import { apiFetch } from "@/lib/apiClient";
import { getAdminToken } from "./adminAuth";

export function adminApiFetch<T>(
  path: string,
  options: Parameters<typeof apiFetch>[1] = {}
) {
  const token = getAdminToken();
  return apiFetch<T>(path.startsWith("/admin") ? path : `/admin${path.startsWith("/") ? path : `/${path}`}`, {
    ...options,
    token: options.token || token || undefined,
  });
}

