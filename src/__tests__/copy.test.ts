import { describe, expect, it } from "vitest";

import { COPY } from "@/app/_site/copy";

const EM_DASH = "\u2014";
// L'apostrofo al posto dell'accento: "e'", "piu'", "perche'"...
const FINTO_ACCENTO = /\b(e|gia|piu|puo|perche|poiche|cosi|li|giu|meta|citta|attivita|sara|verra)'(?=\s|$|[.,;:])/i;

describe("testi del sito", () => {
  it("ogni chiave esiste in italiano e in inglese, mai vuota", () => {
    expect(Object.keys(COPY.en).sort()).toEqual(Object.keys(COPY.it).sort());
    for (const lang of ["it", "en"] as const) {
      for (const [k, v] of Object.entries(COPY[lang])) {
        expect(v.trim(), `${lang}.${k}`).not.toBe("");
      }
    }
  });

  it("nessun em-dash", () => {
    for (const lang of ["it", "en"] as const) {
      for (const [k, v] of Object.entries(COPY[lang])) {
        expect(v.includes(EM_DASH), `${lang}.${k}`).toBe(false);
      }
    }
  });

  it("in italiano l'accento vero, mai l'apostrofo al suo posto", () => {
    for (const [k, v] of Object.entries(COPY.it)) {
      expect(FINTO_ACCENTO.test(v), `it.${k}: ${v}`).toBe(false);
    }
  });
});

// Decisioni del PO del 2026-11-22: il sito dice solo cio' che il prodotto fa.
describe("affermazioni del sito", () => {
  const tutto = (lang: "it" | "en") => Object.values(COPY[lang]).join("\n");

  it("nessuna firma avanzata o eIDAS, che il prodotto non ha", () => {
    for (const lang of ["it", "en"] as const) {
      expect(tutto(lang)).not.toMatch(/eIDAS|avanzata|advanced|qualificata|qualified|valore legale|legally valid/i);
    }
  });

  it("la fattura non e' descritta come sempre manuale", () => {
    expect(tutto("it")).not.toMatch(/scelta umana/i);
    expect(tutto("en")).not.toMatch(/human choice/i);
  });

  it("nessun marchio della piattaforma di sviluppo", () => {
    for (const lang of ["it", "en"] as const) {
      expect(tutto(lang)).not.toMatch(/github|gitlab|bitbucket/i);
    }
  });

  it("nessun collegamento alle novita' finche' la pagina e' vuota", () => {
    expect(Object.keys(COPY.it)).not.toContain("ctaSecondary");
    expect(Object.keys(COPY.it)).not.toContain("footerChangelog");
  });
});
