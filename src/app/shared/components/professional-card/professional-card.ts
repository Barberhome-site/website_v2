import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../../core/booking/booking.service';
import { FormatPipe, LocalizePathPipe } from '../../../core/i18n/i18n.pipes';
import { I18n } from '../../../core/i18n/i18n.service';
import { ProfessionalSummary } from '../../../core/models/glamro.models';
import { Avatar } from '../avatar/avatar';
import { Icon } from '../icon/icon';

let nextId = 0;
/** Marge entre la coche et l'infobulle, et entre l'infobulle et le bord de l'écran. */
const GAP = 8;

/**
 * Carte professionnel : nom public, spécialité, ville/zone, vérification, disponibilité.
 *  - toute la carte ouvre la page du professionnel (lien du nom étendu à la carte) ;
 *  - bouton « Prenota » → popup de réservation (redirection vers l'app) ;
 *  - coche verte « profil vérifié » : infobulle au survol (souris), au focus clavier ou au clic/tap.
 * Variantes : `card` (carrousel, grilles) et `row` (panneau de la carte).
 */
@Component({
  selector: 'app-professional-card',
  imports: [RouterLink, Avatar, Icon, LocalizePathPipe, FormatPipe],
  templateUrl: './professional-card.html',
  styleUrl: './professional-card.scss',
  host: {
    '[class]': '"pc pc--" + variant()',
    '[class.pc--sponsored]': 'pro().sponsored',
    '(keydown.escape)': 'hideTip(true)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfessionalCard {
  readonly pro = input.required<ProfessionalSummary>();
  readonly variant = input<'card' | 'row'>('card');
  readonly headingLevel = input<3 | 4>(3);

  protected readonly i18n = inject(I18n);
  private readonly booking = inject(BookingService);
  private readonly doc = inject(DOCUMENT);
  protected readonly availability = computed(() => this.i18n.availability(this.pro().nextAvailability));

  protected readonly tipId = `pc-verified-${nextId++}`;
  private readonly verifiedBtn = viewChild<ElementRef<HTMLButtonElement>>('verifiedBtn');
  private readonly tip = viewChild<ElementRef<HTMLElement>>('tip');
  /** Ouverte par un clic/tap : reste affichée jusqu'au prochain clic, Échap ou défilement. */
  private pinned = false;

  private readonly onOutside = (event: Event): void => {
    const target = event.target as Node;
    if (!this.verifiedBtn()?.nativeElement.contains(target) && !this.tip()?.nativeElement.contains(target)) {
      this.hideTip(true);
    }
  };
  private readonly onMove = (): void => this.hideTip(true);

  constructor() {
    inject(DestroyRef).onDestroy(() => this.hideTip(true));
  }

  protected book(): void {
    this.booking.open(this.pro());
  }

  protected toggleTip(): void {
    if (this.pinned) {
      this.hideTip(true);
    } else {
      this.pinned = true;
      this.showTip();
    }
  }

  /** Survol : seulement à la souris (au toucher, c'est le clic qui ouvre). */
  protected onPointer(event: PointerEvent, enter: boolean): void {
    if (event.pointerType !== 'mouse') {
      return;
    }
    if (enter) {
      this.showTip();
    } else {
      this.hideTip();
    }
  }

  /** Focus clavier uniquement (un clic donne aussi le focus, mais c'est toggleTip qui gère). */
  protected onFocus(): void {
    if (this.verifiedBtn()?.nativeElement.matches(':focus-visible')) {
      this.showTip();
    }
  }

  protected hideTip(force = false): void {
    if (this.pinned && !force) {
      return;
    }
    this.pinned = false;
    const tip = this.tip()?.nativeElement;
    if (tip && typeof tip.hidePopover === 'function' && tip.matches(':popover-open')) {
      tip.hidePopover();
    }
    this.doc.removeEventListener('click', this.onOutside, true);
    this.doc.removeEventListener('scroll', this.onMove, true);
    this.doc.defaultView?.removeEventListener('resize', this.onMove);
  }

  private showTip(): void {
    const tip = this.tip()?.nativeElement;
    const btn = this.verifiedBtn()?.nativeElement;
    const win = this.doc.defaultView;
    if (!tip || !btn || !win || typeof tip.showPopover !== 'function') {
      return;
    }
    if (!tip.matches(':popover-open')) {
      tip.showPopover();
      this.doc.addEventListener('click', this.onOutside, true);
      this.doc.addEventListener('scroll', this.onMove, { capture: true, passive: true });
      win.addEventListener('resize', this.onMove, { passive: true });
    }

    // Sous la coche, centrée ; au-dessus s'il n'y a pas la place ; jamais hors de l'écran.
    const b = btn.getBoundingClientRect();
    const w = tip.offsetWidth;
    const h = tip.offsetHeight;
    const center = b.left + b.width / 2;
    const left = Math.min(Math.max(center - w / 2, GAP), win.innerWidth - w - GAP);
    const below = b.bottom + GAP + h <= win.innerHeight - GAP;
    tip.style.left = `${left}px`;
    tip.style.top = `${below ? b.bottom + GAP : b.top - GAP - h}px`;
    tip.style.setProperty('--arrow-x', `${center - left}px`);
    tip.dataset['side'] = below ? 'bottom' : 'top';
  }
}
