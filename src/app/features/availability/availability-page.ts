import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { BehaviorSubject, Observable, catchError, combineLatest, map, of, startWith, switchMap } from 'rxjs';
import { SITE } from '../../core/config/site.config';
import { GlamroDataSource } from '../../core/data/glamro-data-source';
import { FormatPipe, LocalizePathPipe } from '../../core/i18n/i18n.pipes';
import { I18n } from '../../core/i18n/i18n.service';
import { AvailabilityQuery, AvailabilityResult, City, ServiceCategory } from '../../core/models/glamro.models';
import { SeoService } from '../../core/seo/seo.service';
import { asyncState } from '../../core/utils/async-state';
import { AvailabilitySearch, AvailabilitySearchInitial } from '../../shared/components/availability-search/availability-search';
import { Icon } from '../../shared/components/icon/icon';
import { ProfessionalCard } from '../../shared/components/professional-card/professional-card';

type ResultState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'error' }
  | { kind: 'result'; result: AvailabilityResult };

function toQuery(params: ParamMap): AvailabilityQuery | null {
  const query: AvailabilityQuery = {
    citySlug: params.get('citta'),
    postalCode: params.get('cap'),
    serviceSlug: params.get('servizio'),
    date: params.get('data'),
  };
  return query.citySlug || query.postalCode ? query : null;
}

/**
 * Résultats de « Verifica la disponibilità » (page non indexée).
 * États : formulaire vide, chargement, erreur, zone non couverte, aucun résultat, résultats.
 */
@Component({
  selector: 'app-availability-page',
  imports: [RouterLink, LocalizePathPipe, FormatPipe, AvailabilitySearch, Icon, ProfessionalCard],
  templateUrl: './availability-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvailabilityPage {
  protected readonly site = SITE;
  private readonly data = inject(GlamroDataSource);
  private readonly route = inject(ActivatedRoute);
  protected readonly i18n = inject(I18n);

  protected readonly cities = asyncState<City[]>(this.data.getCities(), []);
  protected readonly services = asyncState<ServiceCategory[]>(this.data.getServices(), []);

  private readonly query = toSignal(this.route.queryParamMap.pipe(map(toQuery)), { initialValue: null });

  /** Relancer la même recherche après une erreur. */
  private readonly retry$ = new BehaviorSubject(0);

  protected readonly state = toSignal(
    combineLatest([this.route.queryParamMap, this.retry$]).pipe(
      map(([params]) => toQuery(params)),
      switchMap((q): Observable<ResultState> =>
        q
          ? this.data.searchAvailability(q).pipe(
              map((result): ResultState => ({ kind: 'result', result })),
              startWith<ResultState>({ kind: 'loading' }),
              catchError(() => of<ResultState>({ kind: 'error' })),
            )
          : of<ResultState>({ kind: 'idle' }),
      ),
    ),
    { initialValue: { kind: 'idle' } as ResultState },
  );

  protected readonly result = computed(() => {
    const s = this.state();
    return s.kind === 'result' ? s.result : null;
  });

  protected readonly initial = computed<AvailabilitySearchInitial | null>(() => {
    const q = this.query();
    if (!q) {
      return null;
    }
    const city = this.cities().value.find((c) => c.slug === q.citySlug);
    return { location: q.postalCode ?? city?.name ?? q.citySlug ?? '', serviceSlug: q.serviceSlug, date: q.date };
  });

  protected readonly serviceName = computed(() => {
    const slug = this.query()?.serviceSlug;
    return slug ? (this.services().value.find((s) => s.slug === slug)?.name ?? null) : null;
  });

  protected readonly dateLabel = computed(() => {
    const date = this.query()?.date;
    return date ? this.i18n.formatDate(date) : null;
  });

  constructor() {
    const t = this.i18n.d().availability;
    inject(SeoService).set({ title: t.title, description: t.seoDescription, path: '/disponibilita', noindex: true });
  }

  protected reload(): void {
    this.retry$.next(this.retry$.value + 1);
  }
}
