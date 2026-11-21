/**
 * La lingua della pagina: `?lang=it|en` se c'e', altrimenti la prima lingua
 * riconosciuta di `Accept-Language`. Due lingue sole: inglese per chi chiede
 * inglese, italiano per tutti gli altri (anche tedesco, francese, spagnolo:
 * e' il comportamento che il sito aveva dentro l'applicazione).
 *
 * La decide il proxy una volta sola e la passa a layout e pagina
 * nell'intestazione `x-site-lang`.
 */
export type Lang = "it" | "en";

export const LANG_HEADER = "x-site-lang";

const RICONOSCIUTE = new Set(["it", "en", "de", "fr", "es"]);

export function resolveLang(langParam: string | null | undefined, acceptLanguage: string | null | undefined): Lang {
  if (langParam === "en") return "en";
  if (langParam === "it") return "it";
  const prime = (acceptLanguage ?? "")
    .split(",")
    .map((l) => l.trim().split(";")[0].split("-")[0].toLowerCase())
    .filter(Boolean);
  const prima = prime.find((p) => RICONOSCIUTE.has(p));
  return prima === "en" ? "en" : "it";
}

export function asLang(value: string | null | undefined): Lang {
  return value === "en" ? "en" : "it";
}
