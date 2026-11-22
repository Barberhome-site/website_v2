/**
 * Cache mémoire à durée de vie limitée, avec partage des requêtes en cours
 * (dix visiteurs simultanés = un seul appel à l'API). Les erreurs ne sont pas gardées.
 */
export class TtlCache {
  private readonly entries = new Map<string, { expires: number; value: Promise<unknown> }>();

  constructor(
    private readonly now: () => number = Date.now,
    private readonly maxEntries = 1000,
  ) {}

  get<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<T> {
    const time = this.now();
    const hit = this.entries.get(key);
    if (hit && hit.expires > time) {
      return hit.value as Promise<T>;
    }
    const value = load();
    this.entries.delete(key);
    this.entries.set(key, { expires: time + ttlMs, value });
    value.catch(() => {
      if (this.entries.get(key)?.value === value) {
        this.entries.delete(key);
      }
    });
    // Les plus anciennes entrées partent en premier (ordre d'insertion de la Map).
    while (this.entries.size > this.maxEntries) {
      const oldest = this.entries.keys().next().value;
      if (oldest === undefined) {
        break;
      }
      this.entries.delete(oldest);
    }
    return value;
  }
}
