const pending = new Map<string, Promise<void>>();

/** Charge un script externe une seule fois (navigateur uniquement). */
export function loadScript(doc: Document, src: string, attrs: Record<string, string> = {}): Promise<void> {
  const existing = pending.get(src);
  if (existing) {
    return existing;
  }
  const promise = new Promise<void>((resolve, reject) => {
    const script = doc.createElement('script');
    script.src = src;
    script.async = true;
    for (const [key, value] of Object.entries(attrs)) {
      script.setAttribute(key, value);
    }
    script.onload = () => resolve();
    script.onerror = () => {
      pending.delete(src);
      script.remove();
      reject(new Error(`Impossibile caricare ${src}`));
    };
    doc.head.appendChild(script);
  });
  pending.set(src, promise);
  return promise;
}

/** Charge une feuille de style externe une seule fois. */
export function loadStylesheet(doc: Document, href: string): void {
  if (doc.head.querySelector(`link[rel="stylesheet"][href="${href}"]`)) {
    return;
  }
  const link = doc.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  doc.head.appendChild(link);
}
