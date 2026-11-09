import { Injectable, signal } from '@angular/core';
import { ProfessionalSummary } from '../models/glamro.models';

/**
 * Ouverture de la popup « Prenota ».
 * Aujourd'hui : redirection vers l'app (App Store / Google Play).
 * Plus tard (quand l'authentification existera) : remplacer le contenu de BookingDialog
 * par un vrai parcours de réservation — les composants appellent toujours `open(pro)`.
 */
@Injectable({ providedIn: 'root' })
export class BookingService {
  readonly professional = signal<ProfessionalSummary | null>(null);

  open(professional: ProfessionalSummary): void {
    this.professional.set(professional);
  }

  close(): void {
    this.professional.set(null);
  }
}
