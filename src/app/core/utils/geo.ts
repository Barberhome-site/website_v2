/** Distance en kilomètres entre deux points (formule de haversine). */
export function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/** Élément le plus proche d'une position, avec sa distance. */
export function nearest<T extends { latitudeApprox: number; longitudeApprox: number }>(
  items: T[],
  lat: number,
  lon: number,
): { item: T; km: number } | null {
  let best: { item: T; km: number } | null = null;
  for (const item of items) {
    const km = distanceKm(lat, lon, item.latitudeApprox, item.longitudeApprox);
    if (!best || km < best.km) {
      best = { item, km };
    }
  }
  return best;
}
