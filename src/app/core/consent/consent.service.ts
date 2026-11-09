import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { GlamroDataSource } from '../data/glamro-data-source';
import {
  CONSENT_MAX_AGE_DAYS,
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  ConsentCategory,
  ConsentChoices,
  ConsentMethod,
  ConsentRecord,
} from './consent.model';

const NONE: ConsentChoices = { functional: false, analytics: false, marketing: false };
const ALL: ConsentChoices = { functional: true, analytics: true, marketing: true };

/**
 * Gestion du consentement (CMP interne, brief §13).
 *
 *  - Avant tout choix : seules les technologies strictement nécessaires sont actives.
 *  - « Accetta », « Rifiuta » et « Personalizza » ont la même visibilité et le même nombre d'actions.
 *  - Fermer le bandeau (X) = conserver uniquement les technologies nécessaires.
 *  - Preuve : version, date, choix et méthode stockés localement ET envoyés à l'API.
 *  - Révocation à tout moment via « Gestisci cookie » dans le footer.
 *
 * Si GLAMRO choisit une CMP commerciale (Iubenda, Cookiebot…), seul ce service est à remplacer :
 * le reste du site lit `isGranted()`.
 */
@Injectable({ providedIn: 'root' })
export class ConsentService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly data = inject(GlamroDataSource);

  /** Choix enregistré (null = aucun choix valide). */
  readonly record = signal<ConsentRecord | null>(null);
  /** Passe à true une fois le stockage lu, côté navigateur, après l'hydratation. */
  readonly ready = signal(false);
  readonly preferencesOpen = signal(false);

  readonly bannerVisible = computed(() => this.ready() && !this.record() && !this.preferencesOpen());
  readonly choices = computed<ConsentChoices>(() => this.record()?.choices ?? NONE);

  /** À appeler une fois côté navigateur, après l'hydratation (voir App). */
  init(): void {
    if (!this.isBrowser || this.ready()) {
      return;
    }
    this.record.set(this.readStored());
    this.ready.set(true);
  }

  isGranted(category: ConsentCategory): boolean {
    return category === 'necessary' || this.choices()[category];
  }

  acceptAll(): void {
    this.persist(ALL, 'accept_all');
  }

  rejectAll(): void {
    this.persist(NONE, 'reject_all');
  }

  /** Fermeture du bandeau sans choix explicite : rien d'autre que le nécessaire. */
  close(): void {
    this.persist(NONE, 'close');
  }

  save(choices: ConsentChoices): void {
    this.persist({ ...choices }, 'custom');
  }

  openPreferences(): void {
    this.preferencesOpen.set(true);
  }

  closePreferences(): void {
    this.preferencesOpen.set(false);
  }

  private persist(choices: ConsentChoices, method: ConsentMethod): void {
    const record: ConsentRecord = {
      id: this.newId(),
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      choices,
      method,
    };
    this.record.set(record);
    this.preferencesOpen.set(false);
    if (!this.isBrowser) {
      return;
    }
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
    } catch {
      // Stockage indisponible (navigation privée stricte) : le choix vaut pour la session.
    }
    // Preuve côté serveur ; un échec ne bloque pas la navigation.
    this.data.recordConsent(record).subscribe({ error: () => undefined });
  }

  private readStored(): ConsentRecord | null {
    try {
      const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const record = JSON.parse(raw) as ConsentRecord;
      const ageDays = (Date.now() - new Date(record.timestamp).getTime()) / 86_400_000;
      if (record.version !== CONSENT_VERSION || !(ageDays >= 0 && ageDays <= CONSENT_MAX_AGE_DAYS)) {
        return null;
      }
      return { ...record, choices: { ...NONE, ...record.choices } };
    } catch {
      return null;
    }
  }

  private newId(): string {
    try {
      return crypto.randomUUID();
    } catch {
      return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    }
  }
}
