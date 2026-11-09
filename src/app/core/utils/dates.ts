/**
 * Utilitaires de date. Tout est calculé dans le fuseau Europe/Rome pour que
 * le rendu serveur (SSR) et le navigateur affichent la même chose.
 */
const TZ = 'Europe/Rome';

/** Date du jour au format AAAA-MM-JJ, fuseau Europe/Rome. */
export function todayIso(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

/** Ajoute `days` jours à une date ISO AAAA-MM-JJ. */
export function addDaysIso(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return date.toISOString().slice(0, 10);
}

/** Nombre de jours entre deux dates ISO (b - a). */
export function diffDaysIso(a: string, b: string): number {
  const toUtc = (iso: string) => {
    const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((toUtc(b) - toUtc(a)) / 86_400_000);
}

// Formatage des dates dans la langue courante : voir I18n.formatDate() et I18n.availability().
