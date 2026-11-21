/**
 * L'indirizzo dell'applicazione (il gestionale), che vive su un altro host e
 * in un altro repository. Il sito ci manda il login, le note di rilascio e
 * ogni percorso che non e' suo (src/proxy.ts).
 *
 * Fissato al build: `NEXT_PUBLIC_*` entra nel bundle. Vuoto = la produzione.
 */
export const APP_ORIGIN = (process.env.NEXT_PUBLIC_APP_ORIGIN ?? "").trim() || "https://app.perielio.com";

/** Un percorso dell'applicazione, assoluto. Assoluto e non relativo: Next non
 *  prefetcha i link esterni, e il browser va diretto all'app. */
export function appHref(path: string, origin: string = APP_ORIGIN): string {
  return `${origin.replace(/\/+$/, "")}${path}`;
}
