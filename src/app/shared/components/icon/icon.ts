import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Icônes linéaires 24×24 (trait = currentColor). Décoratives : aria-hidden. */
const ICONS = {
  search: ['M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z', 'M21 21l-4.35-4.35'],
  pin: ['M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z', 'M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z'],
  calendar: ['M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z', 'M4 10h16', 'M8 3v4', 'M16 3v4'],
  scissors: [
    'M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    'M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    'M20 4L8.12 15.88',
    'M14.47 14.48L20 20',
    'M8.12 8.12L12 12',
  ],
  home: ['M3 11l9-7 9 7', 'M5 10v10h14V10', 'M10 20v-6h4v6'],
  'chevron-left': ['M15 18l-6-6 6-6'],
  'chevron-right': ['M9 18l6-6-6-6'],
  'chevron-down': ['M6 9l6 6 6-6'],
  'arrow-right': ['M5 12h14', 'M13 6l6 6-6 6'],
  check: ['M5 12.5l4.5 4.5L19 7.5'],
  'check-circle': ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M8 12.5l2.5 2.5L16 9.5'],
  shield: ['M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z', 'M9 12l2 2 4-4'],
  card: ['M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z', 'M3 10h18', 'M7 15h4'],
  headset: ['M4 14v-2a8 8 0 0 1 16 0v2', 'M4 14h3v5H5a1 1 0 0 1-1-1v-4z', 'M20 14h-3v5h2a1 1 0 0 0 1-1v-4z'],
  pause: ['M8 5v14', 'M16 5v14'],
  play: ['M7 4l13 8-13 8V4z'],
  close: ['M6 6l12 12', 'M18 6L6 18'],
  menu: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
  locate: ['M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M12 2v3', 'M12 19v3', 'M2 12h3', 'M19 12h3'],
  user: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M4 21a8 8 0 0 1 16 0'],
  users: ['M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M2 21a7 7 0 0 1 14 0', 'M16 3.5a4 4 0 0 1 0 7', 'M18 14a6 6 0 0 1 4 7'],
  clock: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 7v5l3 2'],
  growth: ['M3 17l6-6 4 4 8-8', 'M15 7h6v6'],
  info: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 11v5', 'M12 8h.01'],
  alert: ['M12 3l10 18H2L12 3z', 'M12 10v4', 'M12 17.5h.01'],
  mail: ['M4 6h16v12H4z', 'M4 7l8 6 8-6'],
  bag: ['M6 8h12l-1 12H7L6 8z', 'M9 8V6a3 3 0 0 1 6 0v2'],
  bike: [
    'M5.5 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
    'M18.5 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
    'M5.5 14.5L9 8h6l3.5 6.5',
    'M9 8l3 6.5h-6.5',
    'M14 5h2.5',
  ],
  door: ['M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17', 'M3 21h18', 'M14 12h.01'],
  sparkle: ['M12 3l2 5.5L19.5 10 14 12l-2 5.5L10 12 4.5 10 10 8.5 12 3z'],
  star: ['M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.3l1-6.2L3 9.7l6.2-.9L12 3z'],
  external: ['M14 4h6v6', 'M20 4l-9 9', 'M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5'],
  phone: ['M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z', 'M11 18h2'],
} satisfies Record<string, string[]>;

export type IconName = keyof typeof ICONS;

@Component({
  selector: 'app-icon',
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" [attr.stroke-width]="strokeWidth()"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      @for (d of paths(); track $index) {
        <path [attr.d]="d" />
      }
    </svg>
  `,
  styles: `
    :host { display: inline-block; width: 1.25em; height: 1.25em; flex-shrink: 0; line-height: 0; }
    svg { width: 100%; height: 100%; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly strokeWidth = input(1.8);
  protected readonly paths = computed(() => ICONS[this.name()]);
}
