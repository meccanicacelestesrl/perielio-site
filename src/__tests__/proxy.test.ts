import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { appRedirectTarget, buildCsp, config, proxy } from "@/proxy";

const req = (url: string, init?: { method?: string; headers?: Record<string, string> }) =>
  new NextRequest(new URL(url), init);

describe("proxy del sito", () => {
  it("ogni percorso diverso da / va all'applicazione, con percorso e query", () => {
    const r = proxy(req("https://perielio.com/login?next=/area"));
    expect(r.status).toBe(307);
    expect(r.headers.get("location")).toBe("https://app.perielio.com/login?next=/area");
  });

  it("anche i percorsi pubblici dell'applicazione (intake, roadmap, note di rilascio)", () => {
    for (const p of ["/release-notes", "/intake/abc", "/r/acme", "/widget/perielio.js"]) {
      expect(proxy(req(`https://www.perielio.com${p}`)).headers.get("location")).toBe(`https://app.perielio.com${p}`);
    }
  });

  it("la / risponde con la CSP a nonce e la lingua scelta", () => {
    const r = proxy(req("https://perielio.com/?lang=en"));
    expect(r.status).toBe(200);
    const csp = r.headers.get("content-security-policy") ?? "";
    expect(csp).toMatch(/script-src 'self' 'nonce-[A-Za-z0-9+/=]+' 'strict-dynamic'/);
    expect(csp).toContain("frame-ancestors 'none'");
    expect(r.headers.get("x-middleware-request-x-site-lang")).toBe("en");
  });

  it("la / non accetta POST", () => {
    const r = proxy(req("https://perielio.com/", { method: "POST" }));
    expect(r.status).toBe(405);
    expect(r.headers.get("allow")).toBe("GET, HEAD");
  });

  it("due richieste, due nonce", () => {
    const a = proxy(req("https://perielio.com/")).headers.get("content-security-policy");
    const b = proxy(req("https://perielio.com/")).headers.get("content-security-policy");
    expect(a).not.toBe(b);
  });

  it("in sviluppo la CSP ammette eval e la websocket del ricaricamento", () => {
    expect(buildCsp("n", true)).toContain("'unsafe-eval'");
    expect(buildCsp("n", true)).toContain("ws:");
    expect(buildCsp("n", false)).not.toContain("'unsafe-eval'");
  });

  it("appRedirectTarget tiene percorso e query su un'origine qualsiasi", () => {
    expect(appRedirectTarget(new URL("https://perielio.com/a/b?c=1"), "http://localhost:3000").toString()).toBe(
      "http://localhost:3000/a/b?c=1",
    );
  });

  it("il matcher lascia fuori gli asset del sito e prende tutto il resto", () => {
    const re = new RegExp(`^${config.matcher[0]}$`);
    for (const p of ["/", "/login", "/icon-192.png", "/manifest.webmanifest"]) expect(re.test(p), p).toBe(true);
    for (const p of ["/_next/static/x.js", "/favicon.ico", "/icon.svg", "/icon-natale.svg", "/apple-icon.png", "/sw.js"]) {
      expect(re.test(p), p).toBe(false);
    }
  });
});
