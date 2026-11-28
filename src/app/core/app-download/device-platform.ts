/** Plateforme du visiteur, pour proposer le bon store. */
export type DevicePlatform = 'ios' | 'android' | 'desktop';

/**
 * Détecte iPhone/iPad (y compris iPadOS qui se présente comme un Mac) et Android.
 * Tout le reste, et le rendu serveur (`win` absent), compte comme « desktop ».
 */
export function detectPlatform(win: Window | null | undefined): DevicePlatform {
  if (!win) {
    return 'desktop';
  }
  const ua = win.navigator.userAgent || '';
  const iPadOs = /Macintosh/.test(ua) && win.navigator.maxTouchPoints > 1;
  if (/iPhone|iPad|iPod/i.test(ua) || iPadOs) {
    return 'ios';
  }
  if (/Android/i.test(ua)) {
    return 'android';
  }
  return 'desktop';
}
