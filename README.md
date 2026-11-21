# perielio-site

Il sito pubblico `perielio.com`. Regole di lavoro in [`CLAUDE.md`](CLAUDE.md).

```
npm install
npm run dev        # http://localhost:3020
npm run validate   # tipi e test
npm run build
```

Il push su `main` rilascia: il trigger Cloud Build `rilascio-sito` esegue [`cloudbuild.yaml`](cloudbuild.yaml) e aggiorna il servizio Cloud Run `site`.

## Com'è fatto

- `src/app/_site/landing.tsx`: la pagina; `copy.ts` i testi in italiano e in inglese.
- `src/proxy.ts`: CSP a nonce sulla `/`, lingua (`?lang=it|en` o quella del browser), redirect all'applicazione per ogni altro percorso.
- `src/lib/app-origin.ts`: l'indirizzo dell'applicazione (`NEXT_PUBLIC_APP_ORIGIN`, vuoto = `https://app.perielio.com`).
- `public/sw.js`: toglie il service worker che la pagina registrava quando stava dentro l'applicazione.

Provenienza: il codice viene dal repository dell'applicazione (Perielio), dove il sito è vissuto fino al 2026-11-21 (`apps/web/src/app/landing.tsx`). Lo storico precedente sta lì.
