/**
 * Chiavi dei documenti legali = indirizzi italiani delle pagine (/termini, /privacy…).
 * File separato da legal-docs.ts per non caricare i testi (100 kB) nel bundle iniziale delle rotte.
 */
export const LEGAL_DOC_KEYS = ['termini', 'termini-professionisti', 'privacy', 'cookie', 'cancellazioni-rimborsi'] as const;
