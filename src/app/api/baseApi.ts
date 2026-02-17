declare const __API_BASE_URL__: string;

export const BASE_URL = __API_BASE_URL__;

export type ApiOptions = RequestInit & {
  json?: unknown;
};

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;

  const headers: HeadersInit = {
    "Accept": "application/json",
    ...(options.json ? { "Content-Type": "application/json" } : {}),
    ...(options.headers ?? {})
  };

  const response = await fetch(url, {
    ...options,
    headers,
    body: options.json ? JSON.stringify(options.json) : options.body
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const text = await response.text();
      message = text || message;
    } catch { }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}
