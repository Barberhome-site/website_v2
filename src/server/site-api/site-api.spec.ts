import { describe, expect, it } from 'vitest';
import { createSiteApi, handleSiteApi, publicName, romeDate } from './site-api';
import { UpstreamError, UpstreamGet } from './upstream';

/* Faux backend : mêmes formats de réponse que barberhome-backend (services, nearby, profil). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;
const A = '11111111-1111-4111-8111-111111111111', B = '22222222-2222-4222-8222-222222222222', C = '33333333-3333-4333-8333-333333333333';
const cat = (cov: Any) => ({ categories: [
  { id: 'cap', name: 'CAPELLI', subcategories: [{ name: 'TAGLIO_STYLING', services: cov.taglio ? [{ id: 's1' }] : [] }, { name: 'BARBA', services: cov.barba ? [{ id: 's2' }] : [] }] },
  { id: 'est', name: 'ESTETICA', subcategories: [{ name: 'MANI', services: cov.mani ? [{ id: 's3' }] : [] }, { name: 'VISO', services: cov.viso ? [{ id: 's4' }] : [] }] },
  { id: 'mas', name: 'MASSAGGI', subcategories: [{ name: 'RELAX', services: cov.relax ? [{ id: 's5' }] : [] }] },
  { id: 'mak', name: 'MAKEUP', subcategories: [{ name: 'BASE', services: cov.base ? [{ id: 's6' }] : [] }] },
  { id: 'pac', name: 'PACCHETTI', subcategories: [{ name: 'UOMO', services: cov.uomo ? [{ id: 's7' }] : [] }] },
] });
const ALL = { taglio:1, barba:1, mani:1, viso:1, relax:1, base:1, uomo:1 };
const item = (id: string, first: string, last: string, dist: number, next: string | null, tags: string[]) => ({ id, firstName: first, lastName: last, avatarUrl: `https://cdn.example/${id}.jpg`, distanceKm: dist, nextAvailableAt: next, serviceTags: tags, badges: ['VERIFIED_PRO'], lat: 45.1, lng: 9.1, bio: 'x' });
const pros: Record<string, Any[]> = {
  milano: [item(A, 'Giulia', 'Rossi', 2.4, '2026-11-23T08:00:00.000Z', ['Taglio donna', 'Piega']), item(B, 'Luca', 'Bianchi', 5, '2026-11-25T22:30:00.000Z', ['Manicure'])],
  roma: [item(C, 'Sara', 'Verdi', 1, null, ['Massaggio relax'])],
  bergamo: [item(A, 'Giulia', 'Rossi', 18, '2026-11-23T08:00:00.000Z', ['Taglio donna'])],
};
const calls: string[] = [];
const get = (async (path: string, params: Any = {}) => {
  calls.push(path + JSON.stringify(params));
  if (path === '/services' && params.lat === undefined) return cat(ALL);
  if (path === '/services') {
    const cov = params.lat > 45.3 && params.lng < 9.5 ? { taglio:1, barba:1, mani:1 } : params.lat < 42 && params.lat > 41.8 ? { relax:1 } : params.lat > 45.6 ? { taglio:1 } : {};
    return cat(cov);
  }
  if (path === '/discovery/nearby-professionals') {
    const city = params.lat === 45.4642 ? 'milano' : params.lat === 41.9028 ? 'roma' : params.lat === 45.6983 ? 'bergamo' : null;
    let list = (city && pros[city]) || [];
    if (params.categoryId === 'cap') list = list.filter(p => p.id === A);
    if (params.categoryId === 'mas') list = list.filter(p => p.id === C);
    if (params.serviceIds === 's2') list = list.filter(p => p.id === A);
    if (params.serviceIds === 's3') list = list.filter(p => p.id === B);
    return { items: list, total: list.length, totalPages: list.length ? 1 : 0, page: params.page, pageSize: params.limit };
  }
  if (path === `/professionals/${A}/profile`) return {
    id: A, firstName: 'Giulia', lastName: 'Rossi', bio: 'Parrucchiera da 10 anni.', avatarUrl: 'https://cdn.example/a.jpg', badges: ['VERIFIED_PRO'],
    specializations: ['Balayage'], professionalTypes: ['HAIR_BARBER'], rating: { average: 4.666, count: 3, distribution: [] },
    serviceRadiusKm: 25, platformFeePct: 20, email: undefined,
    services: [{ serviceId: 's1', name: 'Taglio donna', category: 'CAPELLI', subcategory: 'TAGLIO_STYLING', durationMin: 45, clientPriceCents: 4500, currency: 'EUR', platformFeePct: 20 },
               { serviceId: 's7', name: 'Pacchetto sposa', category: 'PACCHETTI', subcategory: 'SPOSA', durationMin: 120, clientPriceCents: null, currency: 'EUR' }],
    recentReviews: [{ id: 'r1', rating: 5, comment: 'Bravissima', createdAt: '2026-11-01T23:30:00.000Z', author: { firstName: 'Marta', lastName: 'Neri', fullName: 'Marta Neri' } }],
  };
  if (path.startsWith('/professionals/')) throw new UpstreamError(404, 'nf');
  throw new Error('unexpected ' + path);
}) as UpstreamGet;


describe('site-api', () => {
  it('formate les noms publics et les dates', () => {
    expect(publicName('Giulia', 'rossi')).toBe('Giulia R.');
    expect(publicName(null, null)).toBe('GLAMRO');
    expect(romeDate('2026-11-25T23:30:00.000Z')).toBe('2026-11-26');
  });

  it('calcule villes, services et carte à partir de l\'API', async () => {
    const api = createSiteApi(get);
    const cities = await api.getCities('en');
    const milan = cities.find((c) => c.slug === 'milano')!;
    expect(milan).toMatchObject({ status: 'active', availableCount: 2, name: 'Milan' });
    expect([...milan.activeServiceSlugs].sort()).toEqual(['barber', 'capelli', 'estetica', 'nails']);
    expect(cities.find((c) => c.slug === 'napoli')).toMatchObject({ status: 'waitlist', indexable: false });

    const services = await api.getServices('it');
    expect(services.map((s) => s.slug).sort()).toEqual(['barber', 'capelli', 'estetica', 'massaggi', 'nails']);
    expect(await api.getService('make-up', 'it')).toBeNull();

    const clusters = await api.getCityClusters('nails', 'en');
    expect(clusters.map((c) => [c.citySlug, c.availableCount])).toEqual([['milano', 1]]);
  });

  it('liste les professionnels par ville, service et date', async () => {
    const api = createSiteApi(get);
    expect((await api.getProfessionals({ limit: 16 }, 'it')).map((p) => p.displayName)).toEqual(['Giulia R.', 'Sara V.', 'Luca B.']);
    expect((await api.getProfessionals({ serviceSlug: 'barber' }, 'it')).map((p) => p.professionalId)).toEqual([A]);
    expect((await api.getProfessionals({ citySlug: 'milano', date: '2026-11-23' }, 'it')).map((p) => p.professionalId)).toEqual([A]);
  });

  it('assemble un profil sans données personnelles', async () => {
    const api = createSiteApi(get);
    const profile = (await api.getProfessional(A, 'en'))!;
    expect(profile).toMatchObject({ displayName: 'Giulia R.', citySlug: 'milano', specialtyLabel: 'Hairdresser / Barber' });
    expect(profile.reviewSummary).toEqual({ average: 4.7, count: 3 });
    expect(profile.reviews[0].authorDisplayName).toBe('Marta N.');
    expect(await api.getProfessional('giulia-m', 'it')).toBeNull();

    const res = await handleSiteApi(api, '/site-api/professionals/' + A, new URLSearchParams('lang=it'));
    const json = JSON.stringify(res.body);
    for (const leak of ['Rossi', 'Neri', 'platformFee', 'serviceRadius', 'lastName']) {
      expect(json).not.toContain(leak);
    }
  });

  it('gère CAP, zones non couvertes et pannes', async () => {
    const api = createSiteApi(get);
    const ok = await api.searchAvailability({ postalCode: '20121', serviceSlug: 'nails' }, 'it');
    expect(ok.status).toBe('ok');
    const nc = await api.searchAvailability({ citySlug: 'bari' }, 'it');
    expect(nc.status).toBe('not_covered');
    expect((await handleSiteApi(api, '/site-api/unknown', new URLSearchParams())).status).toBe(404);
    const down = createSiteApi((async () => {
      throw new UpstreamError(503, 'down');
    }) as UpstreamGet);
    expect((await handleSiteApi(down, '/site-api/cities', new URLSearchParams())).status).toBe(502);
  });
});
