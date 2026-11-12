import { ConsentCategory } from './consent.model';

/**
 * Inventaire des technologies (brief §13 et §15).
 * Alimente le tableau de la cookie policy et le panneau des préférences.
 * Finalité, durée et transferts sont traduits dans les dictionnaires (clé `trackers.<id>`).
 *
 * IMPORTANT : à valider par une scansione effettiva du site en production avant publication.
 */
export type TrackerId = 'consent' | 'ga' | 'gaSession' | 'trustpilot' | 'basemap';

export interface TrackerInfo {
  id: TrackerId;
  name: string;
  provider: string;
  domain: string;
  category: ConsentCategory;
}

export const COOKIE_INVENTORY: TrackerInfo[] = [
  { id: 'consent', name: 'glamro_consent (localStorage)', provider: 'GLAMRO', domain: 'www.glamro.it', category: 'necessary' },
  { id: 'ga', name: '_ga', provider: 'Google Ireland Ltd.', domain: '.glamro.it', category: 'analytics' },
  { id: 'gaSession', name: '_ga_<ID>', provider: 'Google Ireland Ltd.', domain: '.glamro.it', category: 'analytics' },
  { id: 'trustpilot', name: 'TrustBox', provider: 'Trustpilot A/S', domain: 'widget.trustpilot.com', category: 'functional' },
  { id: 'basemap', name: 'LFMaps (vector tiles)', provider: 'LFMaps / OpenFreeMap', domain: 'data.lfmaps.fr', category: 'functional' },
];
