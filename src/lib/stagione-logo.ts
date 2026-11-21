// Periodi in cui il marchio Perielio cambia veste (components/logo.tsx).
// Il giorno si legge sul fuso italiano: il server gira in UTC, e sul fuso
// del server il cappello comparirebbe e sparirebbe un'ora dopo la mezzanotte.

export type StagioneLogo = "natale" | "sanvalentino" | "halloween";

const FUSO = "Europe/Rome";

const formato = new Intl.DateTimeFormat("en-US", {
  timeZone: FUSO,
  month: "numeric",
  day: "numeric",
});

/** La veste del marchio per il giorno dato, o null fuori da ogni periodo.
 *  Natale: dall'8 dicembre al 6 gennaio compresi. San Valentino: il 14
 *  febbraio, dalle 00:00 alle 00:00 del 15. Halloween: il 31 ottobre, dalle
 *  00:00 alle 00:00 del 1 novembre. */
export function stagioneDelLogo(adesso: Date = new Date()): StagioneLogo | null {
  const parti = formato.formatToParts(adesso);
  const mese = Number(parti.find((p) => p.type === "month")?.value);
  const giorno = Number(parti.find((p) => p.type === "day")?.value);
  if ((mese === 12 && giorno >= 8) || (mese === 1 && giorno <= 6)) return "natale";
  if (mese === 2 && giorno === 14) return "sanvalentino";
  if (mese === 10 && giorno === 31) return "halloween";
  return null;
}

const formatoOra = new Intl.DateTimeFormat("en-GB", {
  timeZone: FUSO,
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hourCycle: "h23",
});

/** Millisecondi alla prossima mezzanotte italiana: e' li' che la veste del
 *  marchio puo' cambiare, quindi la pagina aperta ricontrolla in quel momento. */
export function msAllaProssimaMezzanotte(adesso: Date = new Date()): number {
  const parti = formatoOra.formatToParts(adesso);
  const val = (tipo: string) => Number(parti.find((p) => p.type === tipo)?.value);
  const trascorsi = ((val("hour") * 60 + val("minute")) * 60 + val("second")) * 1000 + adesso.getMilliseconds();
  return 24 * 60 * 60 * 1000 - trascorsi;
}

/** Icona della scheda del browser per la veste data (file in /public). */
export function iconaDellaStagione(stagione: StagioneLogo | null): string {
  if (stagione === "natale") return "/icon-natale.svg";
  if (stagione === "sanvalentino") return "/icon-sanvalentino.svg";
  if (stagione === "halloween") return "/icon-halloween.svg";
  return "/icon.svg";
}
