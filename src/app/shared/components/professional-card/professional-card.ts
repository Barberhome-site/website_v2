import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../../core/booking/booking.service';
import { FormatPipe, LocalizePathPipe } from '../../../core/i18n/i18n.pipes';
import { I18n } from '../../../core/i18n/i18n.service';
import { ProfessionalSummary } from '../../../core/models/glamro.models';
import { Avatar } from '../avatar/avatar';
import { Icon } from '../icon/icon';

/**
 * Carte professionnel : nom public, spécialité, ville/zone, vérification, disponibilité.
 *  - bouton principal « Prenota » → popup de réservation (redirection vers l'app) ;
 *  - icône profil → page du professionnel.
 * Variantes : `card` (carrousel, grilles) et `row` (panneau de la carte).
 */
@Component({
  selector: 'app-professional-card',
  imports: [RouterLink, Avatar, Icon, LocalizePathPipe, FormatPipe],
  templateUrl: './professional-card.html',
  styleUrl: './professional-card.scss',
  host: { '[class]': '"pc pc--" + variant()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfessionalCard {
  readonly pro = input.required<ProfessionalSummary>();
  readonly variant = input<'card' | 'row'>('card');
  readonly headingLevel = input<3 | 4>(3);

  protected readonly i18n = inject(I18n);
  private readonly booking = inject(BookingService);
  protected readonly availability = computed(() => this.i18n.availability(this.pro().nextAvailability));

  protected book(): void {
    this.booking.open(this.pro());
  }
}
