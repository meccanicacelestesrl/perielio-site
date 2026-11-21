# Sito di Perielio

Il sito pubblico `perielio.com` (e `www.perielio.com`): una pagina sola, la `/`, in italiano e in inglese. L'applicazione (il gestionale) vive in un altro repository e su un altro host, `app.perielio.com`: il sito ci manda il login, le note di rilascio e ogni altro percorso (`src/proxy.ts`, `src/lib/app-origin.ts`).

## Rilascio

- **Il push su `main` rilascia**: il trigger Cloud Build `rilascio-sito` (progetto `perielio-shared`, `europe-west8`) esegue `cloudbuild.yaml`, mette l'immagine sul servizio Cloud Run `site` (progetto `perielio-prod`) e controlla che la pagina risponda. Non serve accesso a Google Cloud per rilasciare.
- Si lavora su un branch, si apre una PR su `main`, si mergia quando la modifica è provata. Mai un push diretto su `main` di lavoro non provato.
- Prima della PR: `npm run validate` (tipi e test) e `npm run build` verdi, poi la prova a mano con `npm run dev` (porta 3020): la pagina toccata si apre, i link portano dove devono, la console del browser è pulita.
- Se il rilascio fallisce, il sito resta sulla versione precedente: si legge il motivo nel build e si corregge con un altro push.

## Regole

- **Mai em-dash** (`—`, U+2014), da nessuna parte: si usa `-` con gli spazi, la virgola o i due punti.
- **Mai nominare prodotti o marchi di terzi** nei testi del sito, nei commit, nelle PR. Nessun testo dice da dove viene un'idea.
- **Tono**: B2B professionale, al visitatore si dà del tu, conciso. Niente esclamazioni né emoji. Nel testo italiano l'accento vero (`è`, `più`, `perché`), mai l'apostrofo al suo posto (lo controlla `src/__tests__/copy.test.ts`).
- **Testi in due lingue**: ogni testo visibile sta in `src/app/_site/copy.ts`, in italiano E in inglese nella stessa modifica. Mai testo scritto direttamente nel componente.
- **CSS isolato**: il CSS scritto a mano sta in `src/app/globals.css`, sotto `.pe-site`. I colori sono token (`--brand`, `--gold`, ...) usati con le classi semantiche (`bg-brand`, `text-gold`), mai un colore scritto a mano nel componente.
- **CSP a nonce** (`src/proxy.ts`): l'interattività sta nei client component. Uno `<script>` inline o un `onclick=` scritto a mano viene bloccato. Uno script, un carattere o un'immagine da un host esterno va aggiunto alla CSP, e prima ancora concordato (vedi sotto).
- **Informativa privacy allineata agli script**: oggi il sito non carica nulla da terzi (niente analytics, pixel, captcha, video) e non ha moduli, quindi non ha un'informativa sua. Chi aggiunge uno script di terzi o un modulo aggiunge nella stessa PR la pagina privacy che lo dichiara, concordata col titolare.
- **I contatti vanno dove vanno oggi**: il sito non raccoglie dati e non ha un database. I moduli di contatto sono dell'applicazione (i canali d'ingresso del CRM, `app.perielio.com/intake/...`): un modulo sul sito si collega a quelli, mai a un archivio del sito.
- **Percorsi nuovi**: il sito ha solo la `/`. Ogni altro percorso va all'applicazione (redirect in `src/proxy.ts`). Una pagina nuova del sito va tolta da quel redirect, e un file nuovo in `public/` va aggiunto al `matcher` del proxy, sennò finisce all'applicazione.
- **Segreti**: il sito oggi non ne ha. Se un giorno ne servisse uno, sta in Secret Manager e lo aggiunge chi amministra la produzione. Mai una chiave nel repository.
- **Il DNS non si tocca da qui**: `perielio.com` e `www.perielio.com` arrivano al servizio `site` passando dal Worker Cloudflare del repository dell'applicazione. Claude non cambia DNS, Worker né infrastruttura.
