import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Inter } from "next/font/google";

import { COPY } from "./_site/copy";
import { asLang, LANG_HEADER } from "@/lib/lang";
import { iconaDellaStagione, stagioneDelLogo } from "@/lib/stagione-logo";
import "./globals.css";

// Il carattere lo scarica Next al build e lo serve da qui: nessun host
// esterno a runtime, `font-src 'self'` basta.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

// Icona della scheda: nei giorni di festa quella della stagione (stesso
// calendario del marchio, src/lib/stagione-logo.ts). L'icona di iOS va
// ripetuta qui: con `icons` dichiarato, Next non aggiunge da solo quella del
// file src/app/apple-icon.png.
const APPLE = "/apple-icon.png";

function iconeDellaScheda(): Metadata["icons"] {
  const stagione = stagioneDelLogo();
  if (stagione) {
    return { icon: [{ url: iconaDellaStagione(stagione), type: "image/svg+xml" }], apple: APPLE };
  }
  return {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: APPLE,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = asLang((await headers()).get(LANG_HEADER));
  return {
    title: "Perielio",
    applicationName: "Perielio",
    description: COPY[lang].metaDescription,
    // L'indirizzo principale e' `www`: l'apice ci arriva in 301 dal Worker
    // di Cloudflare (repository Perielio, infra/cloudflare/worker).
    alternates: { canonical: "https://www.perielio.com/" },
    icons: iconeDellaScheda(),
  };
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const lang = asLang((await headers()).get(LANG_HEADER));
  // Veste stagionale del marchio: il CSS la legge da qui (_site/logo.tsx).
  const stagione = stagioneDelLogo() ?? undefined;
  return (
    // Tema scuro fisso: e' come il sito si e' sempre mostrato dentro
    // l'applicazione, dove lo scuro e' il predefinito.
    <html lang={lang} className={`dark ${inter.variable} antialiased`} data-stagione={stagione}>
      <body className="pe-site">{children}</body>
    </html>
  );
}
