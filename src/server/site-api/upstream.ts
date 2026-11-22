/**
 * Client HTTP vers l'API GLAMRO (barberhome-backend), utilisé uniquement côté serveur.
 * Le navigateur n'appelle jamais l'API directement : il passe par /site-api (voir site-api.ts).
 */

export type QueryValue = string | number | boolean | null | undefined;

export class UpstreamError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'UpstreamError';
  }
}

export interface UpstreamOptions {
  /** Base des routes, avec le préfixe /api : `https://api.glamro.it/api`. */
  baseUrl: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

export type UpstreamGet = <T>(path: string, params?: Record<string, QueryValue>) => Promise<T>;

export function createUpstream({ baseUrl, timeoutMs = 8000, fetchImpl = fetch }: UpstreamOptions): UpstreamGet {
  const base = baseUrl.replace(/\/+$/, '');
  return async <T>(path: string, params: Record<string, QueryValue> = {}): Promise<T> => {
    const url = new URL(base + path);
    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }
    const res = await fetchImpl(url, {
      headers: { accept: 'application/json', 'user-agent': 'glamro-website/1' },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) {
      throw new UpstreamError(res.status, `GLAMRO API ${res.status} on ${url.pathname}`);
    }
    return (await res.json()) as T;
  };
}
