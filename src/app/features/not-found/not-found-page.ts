import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NotFoundView } from '../../shared/components/not-found-view/not-found-view';

@Component({
  selector: 'app-not-found-page',
  imports: [NotFoundView],
  template: `<app-not-found-view />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPage {}
