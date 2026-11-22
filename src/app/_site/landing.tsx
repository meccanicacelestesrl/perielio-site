import Link from "next/link";
import { FileText, LifeBuoy, Receipt, RefreshCw, ShieldCheck, ArrowRight } from "lucide-react";
import { Logo } from "./logo";
import { COPY, type CopyKey } from "./copy";
import type { Lang } from "@/lib/lang";
import { FeaturesAccordion } from "./features-accordion";
import { appHref } from "@/lib/app-origin";

/**
 * La pagina pubblica: spiega Perielio, bilingue (IT/EN via ?lang, altrimenti
 * dalla lingua del browser, src/lib/lang.ts). Server component, per la SEO.
 * Le card delle funzionalita' sono una fisarmonica client (FeaturesAccordion).
 * I testi stanno in ./copy.ts.
 */
export function LandingPage({ lang }: { lang: Lang }) {
  const copy = COPY[lang];
  const t = (key: CopyKey) => copy[key];
  // Assoluti, non relativi: login e note di rilascio sono dell'applicazione,
  // su un altro host. Un link relativo passerebbe da un redirect, e il
  // prefetch di Next lo vedrebbe bloccato da `connect-src 'self'`.
  const loginHref = appHref("/login");
  const langCls = (active: boolean) =>
    active
      ? "font-semibold text-brand-foreground"
      : "cursor-pointer text-brand-foreground/55 transition hover:text-brand-foreground";

  const steps = [
    { k: "step1", Icon: FileText },
    { k: "step2", Icon: LifeBuoy },
    { k: "step3", Icon: Receipt },
    { k: "step4", Icon: RefreshCw },
  ];
  const featureItems = ["f1", "f2", "f3", "f4", "f5", "f6"].map((k) => ({
    key: k,
    title: t(`${k}Title` as CopyKey),
    short: t(`${k}Body` as CopyKey),
    long: t(`${k}Long` as CopyKey),
  }));
  const trust = ["trust1", "trust2", "trust3", "trust4"];
  const eyebrow = "text-xs font-semibold uppercase tracking-wide text-muted-foreground";

  return (
    <main className="min-h-dvh bg-background text-foreground">
      {/* HERO */}
      <section className="relative overflow-hidden bg-brand text-brand-foreground">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          aria-hidden="true"
        >
          <ellipse cx="840" cy="300" rx="520" ry="230" stroke="currentColor" strokeOpacity="0.10" />
          <ellipse
            cx="840"
            cy="300"
            rx="360"
            ry="150"
            stroke="currentColor"
            strokeOpacity="0.08"
            transform="rotate(-16 840 300)"
          />
          <circle cx="300" cy="150" r="64" fill="var(--gold)" fillOpacity="0.9" />
          <circle cx="1080" cy="430" r="3" fill="currentColor" fillOpacity="0.5" />
          <circle cx="960" cy="120" r="2" fill="currentColor" fillOpacity="0.5" />
          <circle cx="1140" cy="300" r="2.4" fill="currentColor" fillOpacity="0.45" />
          <circle cx="700" cy="520" r="2" fill="currentColor" fillOpacity="0.4" />
        </svg>
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16 sm:py-24">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Logo className="h-7 w-7" />
              <span className="text-lg font-semibold tracking-tight">Perielio</span>
            </div>
            {/* `<a>` e non `<Link>`: cambiare lingua ricarica la pagina, cosi'
                anche il layout (lang di <html>, descrizione) passa all'altra
                lingua. Una navigazione client rifarebbe solo la pagina. */}
            <nav aria-label={t("langSwitchLabel")} className="flex items-center gap-2 text-sm">
              <a href="/?lang=it" className={langCls(lang === "it")}>
                IT
              </a>
              <span aria-hidden="true" className="text-brand-foreground/30">
                /
              </span>
              <a href="/?lang=en" className={langCls(lang === "en")}>
                EN
              </a>
            </nav>
          </div>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-foreground/60">
              {t("heroEyebrow")}
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              {t("brandTitle")}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-brand-foreground/75 sm:text-lg">
              {t("brandTagline")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={loginHref}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-gold-foreground transition hover:opacity-90"
            >
              {t("heroCtaPrimary")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href="#come-funziona"
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-brand-foreground/25 px-5 py-2.5 text-sm font-medium text-brand-foreground/85 transition hover:bg-brand-foreground/10"
            >
              {t("heroCtaSecondary")}
            </a>
          </div>
        </div>
      </section>

      {/* TESI */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <p className={eyebrow}>{t("thesisEyebrow")}</p>
        <h2 className="mt-2 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("thesisTitle")}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {t("thesisBody")}
        </p>
      </section>

      {/* COME FUNZIONA */}
      <section id="come-funziona" className="border-y border-card-foreground/10 bg-card/40">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <p className={eyebrow}>{t("howEyebrow")}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("howTitle")}
          </h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li
                key={s.k}
                className="rounded-xl border border-card-foreground/10 bg-card p-5 text-card-foreground"
              >
                <div className="flex items-center gap-2 text-gold">
                  <s.Icon className="h-5 w-5" aria-hidden="true" />
                  <span className="text-xs font-semibold text-muted-foreground">0{i + 1}</span>
                </div>
                <h3 className="mt-3 font-semibold">{t(`${s.k}Title` as CopyKey)}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {t(`${s.k}Body` as CopyKey)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FUNZIONALITA (accordion) */}
      <section id="funzionalita" className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <p className={eyebrow}>{t("featuresEyebrow")}</p>
        <FeaturesAccordion items={featureItems} moreLabel={t("featureMore")} />
      </section>

      {/* PER CHI */}
      <section className="border-t border-card-foreground/10 bg-card/40">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <p className={eyebrow}>{t("whoEyebrow")}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("whoTitle")}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {t("whoBody")}
          </p>
        </div>
      </section>

      {/* TRUST */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
          {trust.map((k) => (
            <span key={k} className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-gold" aria-hidden="true" />
              {t(k as CopyKey)}
            </span>
          ))}
        </div>
      </section>

      {/* SCOPO */}
      <section className="border-t border-card-foreground/10 bg-card/40">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-20">
          <p className={eyebrow}>{t("purposeEyebrow")}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("purposeTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {t("purposeBody")}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand text-brand-foreground">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("ctaTitle")}
          </h2>
          <p className="mt-3 text-brand-foreground/75">{t("ctaBody")}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={loginHref}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-gold-foreground transition hover:opacity-90"
            >
              {t("heroCtaPrimary")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-8 text-sm text-muted-foreground">
        <span>{t("brandFooter")}</span>
        <span className="flex gap-4">
          <Link href={loginHref} className="cursor-pointer transition hover:text-foreground">
            {t("heroCtaPrimary")}
          </Link>
        </span>
      </footer>
    </main>
  );
}
