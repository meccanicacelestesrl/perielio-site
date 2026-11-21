import { NextResponse, type NextRequest } from "next/server";

import { APP_ORIGIN } from "@/lib/app-origin";
import { LANG_HEADER, resolveLang } from "@/lib/lang";

/**
 * Il sito ha una pagina sola, `/`. Ogni altro percorso e' dell'applicazione
 * e ci va con un redirect che tiene percorso e query: i vecchi link
 * (`perielio.com/login`, `/release-notes`, `/intake/...`, `/r/...`) continuano
 * a portare dove portavano quando sito e applicazione erano lo stesso servizio.
 * Restano qui solo gli asset del sito, che il `matcher` lascia fuori.
 *
 * Sulla `/` scrive la CSP a nonce. `script-src` porta il nonce e
 * `'strict-dynamic'`: passano gli script del framework (Next estrae il nonce
 * dal `Content-Security-Policy` dei REQUEST header e lo mette sui suoi tag).
 * Uno script inline senza nonce resta bloccato: l'interattivita' sta nei
 * client component, mai in `onclick=` o `<script>` scritti a mano.
 */
export function buildCsp(nonce: string, isDev = process.env.NODE_ENV === "development"): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    `connect-src 'self'${isDev ? " ws:" : ""}`,
    "worker-src 'self'",
    "manifest-src 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
  ].join("; ");
}

function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

/** Dove va un percorso che non e' del sito: stesso percorso e query, sull'app. */
export function appRedirectTarget(url: URL, appOrigin: string = APP_ORIGIN): URL {
  const to = new URL(appOrigin);
  to.pathname = url.pathname;
  to.search = url.search;
  return to;
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (pathname !== "/") {
    return NextResponse.redirect(appRedirectTarget(request.nextUrl));
  }

  // La `/` e' di sola lettura: nessuna Server Action. I POST che la colpiscono
  // sono scanner, e si fermano qui.
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new NextResponse(null, { status: 405, headers: { Allow: "GET, HEAD" } });
  }

  const nonce = generateNonce();
  const csp = buildCsp(nonce);
  const lang = resolveLang(request.nextUrl.searchParams.get("lang"), request.headers.get("accept-language"));

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);
  requestHeaders.set(LANG_HEADER, lang);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  // Fuori dal proxy: i pezzi del framework e gli asset del sito (public/ e
  // src/app/apple-icon.png). Un asset nuovo in public/ va aggiunto qui, sennò
  // il proxy lo manda all'applicazione.
  matcher: [
    "/((?!_next/|favicon\.ico$|icon\.svg$|icon-natale\.svg$|icon-sanvalentino\.svg$|icon-halloween\.svg$|apple-icon\.png$|sw\.js$).*)",
  ],
};
