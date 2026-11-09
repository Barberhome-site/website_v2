import { Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, catchError, map, of, startWith } from 'rxjs';

export interface AsyncState<T> {
  status: 'loading' | 'ok' | 'error';
  value: T;
}

/**
 * Transforme un Observable en signal { status, value } : chargement, succès, erreur.
 * À appeler dans un contexte d'injection (champ de classe ou constructeur).
 * En SSR, Angular attend la fin des requêtes HttpClient : la page part avec `ok`.
 */
export function asyncState<T>(source: Observable<T>, initial: T): Signal<AsyncState<T>> {
  return toSignal(
    source.pipe(
      map((value): AsyncState<T> => ({ status: 'ok', value })),
      startWith<AsyncState<T>>({ status: 'loading', value: initial }),
      catchError(() => of<AsyncState<T>>({ status: 'error', value: initial })),
    ),
    { requireSync: true },
  );
}
