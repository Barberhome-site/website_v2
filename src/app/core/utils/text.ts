/** Minuscules sans accents ni espaces superflus, pour comparer des saisies libres. */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

/** Un CAP italien : exactement 5 chiffres. */
export function isPostalCode(value: string): boolean {
  return /^\d{5}$/.test(value.trim());
}

/** Initiales pour l'avatar de secours : « Giulia M. » → « GM ». */
export function initials(displayName: string): string {
  return displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

/** Échappe une chaîne avant de l'insérer dans du HTML construit à la main (marqueurs de la carte). */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}
