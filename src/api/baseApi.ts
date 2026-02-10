declare const __API_BASE_URL__: string;
export const BASE_URL = __API_BASE_URL__;

export interface ApiOptions extends RequestInit {
    json?: any;          // shortcut pre body
    auth?: boolean;      // či pribaliť token
}

export async function api(path: string, options: ApiOptions = {}) {
    const url = `${BASE_URL}${path}`;

    const headers: HeadersInit = {
        "Accept": "application/json",
        ...(options.json ? { "Content-Type": "application/json" } : {}),
        ...(options.headers ?? {})
    };

    // // ak chceš do budúcna token
    // if (options.auth) {
    //     const token = localStorage.getItem("auth.token");
    //     if (token) headers["Authorization"] = `Bearer ${token}`;
    // }

    const response = await fetch(url, {
        ...options,
        headers,
        body: options.json ? JSON.stringify(options.json) : options.body,
    });

    if (!response.ok) {
        let message = "Request failed";
        try {
            const text = await response.text();
            message = text || message;
        } catch { }

        throw new Error(message);
    }

    // ak je prázdna odpoveď (204)
    if (response.status === 204) return null;

    return response.json();
}