/**
 * Catégories de consentement (brief §13 et §15).
 * `necessary` est toujours actif et n'est pas modifiable par l'utilisateur.
 */
export type ConsentCategory = 'necessary' | 'functional' | 'analytics' | 'marketing';

export type OptionalConsentCategory = Exclude<ConsentCategory, 'necessary'>;

export type ConsentChoices = Record<OptionalConsentCategory, boolean>;

export type ConsentMethod = 'accept_all' | 'reject_all' | 'custom' | 'close';

/** Preuve du consentement : version, horodatage, choix et méthode. */
export interface ConsentRecord {
  id: string;
  version: string;
  timestamp: string;
  choices: ConsentChoices;
  method: ConsentMethod;
}

/**
 * Version de la politique cookies/consentement.
 * L'incrémenter quand la liste des technologies change : le bandeau sera reproposé.
 */
export const CONSENT_VERSION = '2026-11-v3';

/** Durée de validité du choix (Garante : ne pas reproposer le bandeau avant 6 mois). */
export const CONSENT_MAX_AGE_DAYS = 180;

export const CONSENT_STORAGE_KEY = 'glamro_consent';

/** Catégories toujours actives (libellés et descriptions : dictionnaire `consent.categories`). */
export const CONSENT_REQUIRED: Record<ConsentCategory, boolean> = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};
