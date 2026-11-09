import { Provider } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GlamroDataSource } from './glamro-data-source';
import { HttpGlamroDataSource } from './http/http-glamro-data-source';
import { MockGlamroDataSource } from './mock/mock-glamro-data-source';

/** Choisit la source de données selon l'environnement. */
export function provideGlamroData(): Provider {
  return {
    provide: GlamroDataSource,
    useClass: environment.useMockData ? MockGlamroDataSource : HttpGlamroDataSource,
  };
}
