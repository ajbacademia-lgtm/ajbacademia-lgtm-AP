/**
 * Universal safe API fetch wrapper
 * Attaches Authorization header or credentials automatically
 */

interface SafeFetchOptions extends RequestInit {
  timeout?: number;
  silent?: boolean;
}

export async function safeFetchJson<T = any>(
  url: string,
  options: SafeFetchOptions = {},
  fallback: T = null as unknown as T
): Promise<T> {
  const { timeout = 15000, silent = false, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((fetchOptions.headers as Record<string, string>) || {})
    };

    // Attach token if present in session storage
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('ajp_token');
      if (token && !headers['Authorization']) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      credentials: 'include', // Include HTTP-only cookies
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (!silent) {
        console.warn(`[API Response Not OK]: ${response.status} for ${url}`);
      }
      return fallback;
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (!silent) {
      if (error.name === 'AbortError') {
        console.warn(`[API Timeout]: Request to ${url} timed out after ${timeout}ms`);
      } else {
        console.warn(`[API Notice]: Request to ${url} failed`, error);
      }
    }
    return fallback;
  }
}
