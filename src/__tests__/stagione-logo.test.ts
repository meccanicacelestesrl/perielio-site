import { describe, expect, it } from "vitest";
import { iconaDellaStagione, msAllaProssimaMezzanotte, stagioneDelLogo } from "@/lib/stagione-logo";

// Gli istanti sono in UTC: l'Italia sta a +1 d'inverno.
describe("stagioneDelLogo", () => {
  it("fuori periodo non cambia il marchio", () => {
    expect(stagioneDelLogo(new Date("2026-11-06T10:00:00Z"))).toBeNull();
    expect(stagioneDelLogo(new Date("2026-07-15T10:00:00Z"))).toBeNull();
  });

  it("dall'8 dicembre al 6 gennaio compresi mette il cappello", () => {
    expect(stagioneDelLogo(new Date("2026-12-08T10:00:00Z"))).toBe("natale");
    expect(stagioneDelLogo(new Date("2026-12-25T10:00:00Z"))).toBe("natale");
    expect(stagioneDelLogo(new Date("2026-12-31T22:30:00Z"))).toBe("natale");
    expect(stagioneDelLogo(new Date("2027-01-06T10:00:00Z"))).toBe("natale");
  });

  it("il 7 dicembre e il 7 gennaio sono fuori", () => {
    expect(stagioneDelLogo(new Date("2026-12-07T10:00:00Z"))).toBeNull();
    expect(stagioneDelLogo(new Date("2027-01-07T10:00:00Z"))).toBeNull();
  });

  it("i confini seguono la mezzanotte italiana, non quella UTC", () => {
    // 7 dicembre 23:30 UTC = 8 dicembre 00:30 a Roma: gia' dentro.
    expect(stagioneDelLogo(new Date("2026-12-07T23:30:00Z"))).toBe("natale");
    // 6 gennaio 22:59 UTC = 23:59 a Roma: ancora dentro.
    expect(stagioneDelLogo(new Date("2027-01-06T22:59:00Z"))).toBe("natale");
    // 6 gennaio 23:00 UTC = 7 gennaio 00:00 a Roma: fuori.
    expect(stagioneDelLogo(new Date("2027-01-06T23:00:00Z"))).toBeNull();
  });
});

describe("San Valentino", () => {
  it("vale il solo 14 febbraio, dalle 00:00 alle 00:00 del 15 italiane", () => {
    expect(stagioneDelLogo(new Date("2027-02-13T22:59:59Z"))).toBeNull();
    expect(stagioneDelLogo(new Date("2027-02-13T23:00:00Z"))).toBe("sanvalentino");
    expect(stagioneDelLogo(new Date("2027-02-14T12:00:00Z"))).toBe("sanvalentino");
    expect(stagioneDelLogo(new Date("2027-02-14T22:59:59Z"))).toBe("sanvalentino");
    expect(stagioneDelLogo(new Date("2027-02-14T23:00:00Z"))).toBeNull();
  });
});

describe("Halloween", () => {
  // A fine ottobre l'Italia sta gia' a +1: l'ora legale finisce l'ultima
  // domenica di ottobre, che nel 2026 e' il 25.
  it("vale il solo 31 ottobre, dalle 00:00 alle 00:00 del 1 novembre italiane", () => {
    expect(stagioneDelLogo(new Date("2026-10-30T22:59:59Z"))).toBeNull();
    expect(stagioneDelLogo(new Date("2026-10-30T23:00:00Z"))).toBe("halloween");
    expect(stagioneDelLogo(new Date("2026-10-31T22:59:59Z"))).toBe("halloween");
    expect(stagioneDelLogo(new Date("2026-10-31T23:00:00Z"))).toBeNull();
  });
});

describe("iconaDellaStagione", () => {
  it("sceglie l'icona della scheda per ogni veste", () => {
    expect(iconaDellaStagione(null)).toBe("/icon.svg");
    expect(iconaDellaStagione("natale")).toBe("/icon-natale.svg");
    expect(iconaDellaStagione("sanvalentino")).toBe("/icon-sanvalentino.svg");
    expect(iconaDellaStagione("halloween")).toBe("/icon-halloween.svg");
  });
});

describe("msAllaProssimaMezzanotte", () => {
  it("conta fino alla mezzanotte italiana", () => {
    // 22:59:59.500 UTC del 7 dicembre = 23:59:59.500 a Roma.
    expect(msAllaProssimaMezzanotte(new Date("2026-12-07T22:59:59.500Z"))).toBe(500);
    // 23:00 UTC = mezzanotte a Roma: la prossima e' fra un giorno intero.
    expect(msAllaProssimaMezzanotte(new Date("2026-12-07T23:00:00.000Z"))).toBe(24 * 60 * 60 * 1000);
    // 12:00 a Roma: mancano 12 ore.
    expect(msAllaProssimaMezzanotte(new Date("2027-01-06T11:00:00.000Z"))).toBe(12 * 60 * 60 * 1000);
  });

  it("allo scadere del conto il marchio e' gia' quello del giorno nuovo", () => {
    for (const iso of ["2026-12-07T15:42:10.123Z", "2027-01-06T20:00:00.000Z", "2027-02-13T09:00:00.000Z", "2027-02-14T21:30:00.000Z", "2026-10-30T10:00:00.000Z", "2026-10-31T10:00:00.000Z"]) {
      const adesso = new Date(iso);
      const allo = new Date(adesso.getTime() + msAllaProssimaMezzanotte(adesso));
      const prima = new Date(allo.getTime() - 1);
      expect(stagioneDelLogo(allo)).not.toBe(stagioneDelLogo(prima));
    }
  });
});
