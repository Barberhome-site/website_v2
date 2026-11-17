import { Lang, isLang } from './i18n.config';

/**
 * Cookie de préférence de langue — partagé entre le navigateur et le serveur Express.
 * Cookie technique (choix explicite de l'utilisateur) : pas de consentement requis,
 * mais listé dans l'inventaire des cookies (cookie-inventory.ts, id `lang`).
 */
export const LANG_COOKIE = 'glamro_lang';
export const LANG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 an

/** Lit la langue enregistrée dans un en-tête `Cookie` (ou `document.cookie`). */
export function readLangCookie(cookieHeader: string | null | undefined): Lang | null {
  if (!cookieHeader) {
    return null;
  }
  for (const part of cookieHeader.split(';')) {
    const [name, ...rest] = part.trim().split('=');
    if (name === LANG_COOKIE) {
      const value = decodeURIComponent(rest.join('='));
      return isLang(value) ? value : null;
    }
  }
  return null;
}

export function serializeLangCookie(lang: Lang, secure: boolean): string {
  return `${LANG_COOKIE}=${lang}; Max-Age=${LANG_COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure ? '; Secure' : ''}`;
}
