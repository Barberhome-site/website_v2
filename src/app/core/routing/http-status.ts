import { RESPONSE_INIT, inject } from '@angular/core';

/**
 * Définit le code HTTP de la réponse SSR (ex. 404 pour une page inexistante).
 * Sans effet dans le navigateur. À appeler dans un contexte d'injection.
 */
export function setResponseStatus(status: number): void {
  const init = inject(RESPONSE_INIT, { optional: true });
  if (init) {
    init.status = status;
  }
}
