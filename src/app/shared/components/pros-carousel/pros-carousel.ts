import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { I18n } from '../../../core/i18n/i18n.service';
import { ProfessionalSummary } from '../../../core/models/glamro.models';
import { Icon } from '../icon/icon';
import { ProfessionalCard } from '../professional-card/professional-card';

const AUTOPLAY_MS = 5000;

/**
 * Carrousel des professionnels (brief §7) :
 *  - défilement lent automatique, avec bouton pause TOUJOURS visible ;
 *  - flèches, clavier (← →) et swipe (scroll natif avec scroll-snap) ;
 *  - aucun défilement automatique si prefers-reduced-motion ;
 *  - pause au survol et quand le focus est dans le carrousel.
 */
@Component({
  selector: 'app-pros-carousel',
  imports: [Icon, ProfessionalCard],
  templateUrl: './pros-carousel.html',
  styleUrl: './pros-carousel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProsCarousel {
  readonly professionals = input.required<ProfessionalSummary[]>();
  readonly label = input('');
  protected readonly i18n = inject(I18n);

  private readonly track = viewChild.required<ElementRef<HTMLUListElement>>('track');
  private readonly doc = inject(DOCUMENT);

  /** Lecture automatique possible (navigateur + mouvement autorisé). */
  protected readonly autoplayAvailable = signal(false);
  /** Pause demandée par l'utilisateur via le bouton. */
  protected readonly userPaused = signal(false);
  private hovering = false;
  private focusWithin = false;
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    afterNextRender(() => {
      const reduce = this.doc.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? true;
      this.autoplayAvailable.set(!reduce);
      this.userPaused.set(reduce);
      if (!reduce) {
        this.timer = setInterval(() => this.tick(), AUTOPLAY_MS);
      }
    });
    inject(DestroyRef).onDestroy(() => {
      if (this.timer) {
        clearInterval(this.timer);
      }
    });
  }

  protected togglePause(): void {
    this.userPaused.update((v) => !v);
  }

  protected prev(): void {
    this.scrollBySlide(-1);
  }

  protected next(): void {
    this.scrollBySlide(1);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.next();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.prev();
    }
  }

  protected setHover(value: boolean): void {
    this.hovering = value;
  }

  protected onFocusIn(): void {
    this.focusWithin = true;
  }

  protected onFocusOut(event: FocusEvent): void {
    const host = event.currentTarget as HTMLElement;
    this.focusWithin = host.contains(event.relatedTarget as Node | null);
  }

  private tick(): void {
    if (this.userPaused() || this.hovering || this.focusWithin || this.doc.hidden) {
      return;
    }
    const el = this.track().nativeElement;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    if (atEnd) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      this.scrollBySlide(1);
    }
  }

  private scrollBySlide(direction: 1 | -1): void {
    const el = this.track().nativeElement;
    const first = el.querySelector('li');
    const gap = parseFloat(getComputedStyle(el).columnGap || '0') || 0;
    const step = first ? first.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step, behavior: this.autoplayAvailable() ? 'smooth' : 'auto' });
  }
}
