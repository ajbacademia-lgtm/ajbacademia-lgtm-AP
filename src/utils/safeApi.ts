/**
 * Universal safe API fetch wrapper
 * Attaches Authorization header or credentials automatically
 * Completely immune to "Unexpected token '<', '<!DOCTYPE '... is not valid JSON" errors
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

    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();

    if (!text || !text.trim()) {
      return fallback;
    }

    // Guard against HTML error pages or SPA fallback index.html
    if (text.trim().startsWith('<') || (!contentType.includes('json') && text.includes('<!DOCTYPE'))) {
      if (!silent) {
        console.warn(`[API Response is HTML]: Expected JSON but received HTML for ${url}`);
      }
      return fallback;
    }

    try {
      const data = JSON.parse(text);
      return data as T;
    } catch (parseError) {
      if (!silent) {
        console.warn(`[API JSON Parse Error]: Invalid JSON received for ${url}`, parseError);
      }
      return fallback;
    }
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (!silent) {
      if (error.name === 'AbortError') {
        console.warn(`[API Timeout]: Request to ${url} timed out after ${timeout}ms`);
      } else {
        console.warn(`[API Notice]: Request to ${url} failed:`, error?.message || error);
      }
    }
    return fallback;
  }
}
