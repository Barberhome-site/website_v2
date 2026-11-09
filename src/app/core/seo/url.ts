import { environment } from '../../../environments/environment';

/** Transforme un chemin interne en URL absolue du site. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) {
    return path;
  }
  const base = environment.siteUrl.replace(/\/$/, '');
  return path === '/' ? `${base}/` : `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
