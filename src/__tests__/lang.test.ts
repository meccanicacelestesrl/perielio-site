import { describe, expect, it } from "vitest";

import { asLang, resolveLang } from "@/lib/lang";

describe("resolveLang", () => {
  it("?lang vince sulla lingua del browser", () => {
    expect(resolveLang("en", "it-IT,it;q=0.9")).toBe("en");
    expect(resolveLang("it", "en-US,en;q=0.9")).toBe("it");
  });

  it("senza ?lang segue la prima lingua riconosciuta del browser", () => {
    expect(resolveLang(null, "en-GB,en;q=0.9")).toBe("en");
    expect(resolveLang(null, "it-IT,en;q=0.8")).toBe("it");
    expect(resolveLang(null, "nl-NL,en;q=0.8")).toBe("en");
  });

  it("tedesco, francese e spagnolo restano in italiano, come nell'applicazione", () => {
    expect(resolveLang(null, "de-DE,en;q=0.8")).toBe("it");
    expect(resolveLang(null, "fr")).toBe("it");
  });

  it("senza indicazioni e' italiano", () => {
    expect(resolveLang(undefined, "")).toBe("it");
    expect(resolveLang("xx", null)).toBe("it");
  });

  it("asLang accetta solo en, il resto e' italiano", () => {
    expect(asLang("en")).toBe("en");
    expect(asLang("de")).toBe("it");
    expect(asLang(null)).toBe("it");
  });
});
