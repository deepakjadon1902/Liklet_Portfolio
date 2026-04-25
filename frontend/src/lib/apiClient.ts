const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;
export const API_BASE_URL = RAW_API_BASE_URL && RAW_API_BASE_URL.trim() ? RAW_API_BASE_URL : "/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type Json = Record<string, unknown> | unknown[] | null;

function getErrorMessage(data: unknown, status: number) {
  if (data && typeof data === "object" && "error" in data) {
    const maybeError = (data as { error?: unknown }).error;
    if (typeof maybeError === "string" && maybeError.trim()) return maybeError;
  }
  if (typeof data === "string" && data.trim()) {
    return data.length > 160 ? `${data.slice(0, 160)}…` : data;
  }
  return `Request failed (${status})`;
}

export async function apiFetch<T = Json>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (options.token) headers.set("Authorization", `Bearer ${options.token}`);

  let res: Response;
  try {
    res = await fetch(url, { ...options, headers });
  } catch (err: unknown) {
    throw new ApiError(err instanceof Error ? err.message : "Network error", 0);
  }

  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();
  let data: unknown = null;

  if (text) {
    if (contentType.includes("application/json")) {
      try {
        data = JSON.parse(text) as unknown;
      } catch {
        data = null;
      }
    } else {
      data = text;
    }
  }

  if (!res.ok) {
    throw new ApiError(getErrorMessage(data, res.status), res.status);
  }

  if (!contentType.includes("application/json")) {
    throw new ApiError(
      "Invalid server response (expected JSON). Check `VITE_API_BASE_URL` and that the backend is running.",
      res.status
    );
  }

  return data as T;
}
