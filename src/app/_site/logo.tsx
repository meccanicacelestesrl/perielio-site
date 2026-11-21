import { useId, type SVGProps } from "react";

// Marchio Perielio: la lettera P il cui occhiello e' un'orbita ellittica, con
// il Sole nel fuoco (oro) e la Terra al perielio, il punto piu' vicino (azzurro).
// Asta e orbita usano currentColor, Sole e Terra i design token --gold/--earth:
// cosi' il marchio si adatta da solo a tema chiaro/scuro e al pannello brand.
// Decorativo: l'aria-hidden di default va affiancato dal testo "Perielio".
//
// Vesti stagionali: il marchio contiene anche la versione di Natale (cappello),
// quella di San Valentino (cuori) e quella di Halloween (cappello da strega,
// zucca, ragnatela, ragno e pipistrelli), nascoste. Le mostra il CSS quando il
// layout radice mette `data-stagione` su <html> (periodi in
// `lib/stagione-logo.ts`): nessuno stato nel componente, quindi stesso markup
// da server e client.
function Asta() {
  return (
    <>
      <path d="M9.5 5.5 V26.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <ellipse
        cx="17.4"
        cy="11.8"
        rx="8"
        ry="6.4"
        transform="rotate(-16 17.4 11.8)"
        stroke="currentColor"
        strokeWidth="2"
      />
    </>
  );
}

function Lettera() {
  return (
    <>
      <Asta />
      <circle cx="22" cy="10.5" r="2.2" fill="var(--gold)" />
      <circle cx="25.1" cy="9.6" r="1.05" fill="var(--earth)" />
    </>
  );
}

// San Valentino: Sole e Terra diventano due cuori, e una freccia attraversa
// quello grande. Cuore di larghezza 2 centrato sull'origine.
const CUORE =
  "M0 0.9 C-0.15 0.75 -1 0.2 -1 -0.35 C-1 -0.75 -0.7 -1 -0.4 -1 C-0.2 -1 -0.05 -0.9 0 -0.75 C0.05 -0.9 0.2 -1 0.4 -1 C0.7 -1 1 -0.75 1 -0.35 C1 0.2 0.15 0.75 0 0.9 Z";

function LetteraSanValentino() {
  return (
    <>
      <Asta />
      <path d="M13.2 17.1 L27.6 6.1" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M29.2 4.9 L26.3 5.6 L27.9 7.7 Z" fill="currentColor" />
      <g fill="var(--sanvalentino-piuma)">
        <path d="M13.2 17.1 L11.3 16.9 L12.4 15.4 L14.1 15.8 Z" />
        <path d="M13.2 17.1 L13.4 19.0 L14.9 17.9 L14.6 16.2 Z" />
      </g>
      <path d={CUORE} transform="translate(22 10.5) scale(2.7)" fill="var(--sanvalentino-cuore)" />
      <path
        d={CUORE}
        transform="translate(25.6 8.6) scale(1.15) rotate(18)"
        fill="var(--sanvalentino-cuore-piccolo)"
      />
    </>
  );
}

// Il cappello e' disegnato su una griglia di 512, la stessa delle immagini del
// marchio di stagione, dove la P sta in translate(62 131) scale(11.4).
// CAPPELLO lo riporta sulla P a grandezza piena: la P resta quella di sempre e
// il cappello esce sopra il riquadro del marchio (overflow visibile, circa un
// quarto dell'altezza), dove le intestazioni hanno spazio libero. Orlo e
// pompon stanno sopra la lettera: lo stacco intorno a loro e' tolto con una
// maschera, cosi' si separano dalla P su qualunque sfondo senza doverne
// conoscere il colore.
const CAPPELLO = "scale(1.4035) translate(-3.875 -8.1875) scale(0.0625)";
const ORLO = { x: 100, y: 141, width: 204, height: 50, rx: 25, transform: "rotate(-8 202 166)" };
const POMPON = { cx: 358, cy: 114, r: 27 };

// Halloween: cappello da strega e zucca sulla griglia di 512 (come il cappello
// di Natale, riportati con CAPPELLO); ragnatela, ragno, pipistrelli e Terra
// nelle coordinate della P.
const ORLO_STREGA = { cx: 206, cy: 160, rx: 128, ry: 24, transform: "rotate(-8 206 160)" };
const CONO_STREGA = "M142 160 L196 68 C206 48 226 30 266 20 C250 40 242 60 246 82 L274 146 Z";
const PIPISTRELLO =
  "M0 -0.3 C0.4 -0.9 1.2 -1.1 2 -0.8 C1.7 -0.5 1.7 -0.1 1.9 0.2 C1.5 0 1.1 0.1 0.9 0.4 C0.7 0.1 0.4 0.1 0.25 0.35 L0 0.1 L-0.25 0.35 C-0.4 0.1 -0.7 0.1 -0.9 0.4 C-1.1 0.1 -1.5 0 -1.9 0.2 C-1.7 -0.1 -1.7 -0.5 -2 -0.8 C-1.2 -1.1 -0.4 -0.9 0 -0.3 Z M-0.25 -0.35 L-0.2 -0.8 L0 -0.5 L0.2 -0.8 L0.25 -0.35 Z";

function DecoriHalloween() {
  return (
    <>
      <g
        stroke="currentColor"
        strokeWidth="0.13"
        strokeOpacity="0.8"
        strokeLinecap="round"
        transform="translate(10.6 8.6) scale(1.45) translate(-10.6 -8.6)"
      >
        <path d="M10.6 8.6 L13.7 8.6 M10.6 8.6 L13.3 10.15 M10.6 8.6 L12.15 11.3 M10.6 8.6 L10.6 11.7" />
        <path d="M11.6 8.6 Q11.4 8.95 11.47 9.1 Q11.2 9.3 11.1 9.47 Q10.9 9.45 10.6 9.6" />
        <path d="M12.6 8.6 Q12.2 9.2 12.33 9.6 Q11.8 9.9 11.6 10.33 Q11.1 10.3 10.6 10.6" />
        <path d="M13.6 8.6 Q13.1 9.5 13.2 10.1 Q12.5 10.6 12.1 11.2 Q11.4 11.2 10.6 11.6" />
      </g>
      <Asta />
      <path d="M19.4 17.95 L19.4 22.1" stroke="currentColor" strokeWidth="0.14" />
      <g stroke="currentColor" strokeWidth="0.26" strokeLinecap="round">
        <path d="M19.1 22.7 Q17.9 21.9 17.5 22.7 M19.1 22.95 Q17.7 22.7 17.4 23.6 M19.1 23.2 Q17.9 23.5 17.7 24.3 M19.2 23.4 Q18.4 24.1 18.5 24.8" />
        <path d="M19.7 22.7 Q20.9 21.9 21.3 22.7 M19.7 22.95 Q21.1 22.7 21.4 23.6 M19.7 23.2 Q20.9 23.5 21.1 24.3 M19.6 23.4 Q20.4 24.1 20.3 24.8" />
      </g>
      <circle cx="19.4" cy="22.35" r="0.45" fill="currentColor" />
      <circle cx="19.4" cy="23.25" r="0.8" fill="currentColor" />
      <circle cx="25.1" cy="9.6" r="1.05" fill="var(--earth)" />
      <path d={PIPISTRELLO} transform="translate(27.8 4.4) rotate(-12) scale(1.25)" fill="currentColor" />
      <path d={PIPISTRELLO} transform="translate(30.6 0.6) rotate(12) scale(0.75)" fill="currentColor" />
    </>
  );
}

function ZuccaECappelloDaStrega() {
  return (
    <g transform={CAPPELLO}>
      <g transform="translate(312.8 250.7)">
        <ellipse rx="27" ry="24" fill="var(--halloween-arancio)" />
        <ellipse rx="13" ry="24" stroke="var(--halloween-coste)" strokeWidth="3" />
        <ellipse rx="2" ry="24" stroke="var(--halloween-coste)" strokeWidth="3" />
        <path d="M-2 -23 L-1 -32 L5 -32 L4 -23 Z" fill="var(--halloween-picciolo)" />
        <path
          d="M-15 -7 L-6 -7 L-10.5 -14 Z M6 -7 L15 -7 L10.5 -14 Z M-16 4 L-10 9 L-6 5 L-2 10 L2 5 L6 10 L10 5 L16 4 C12 15 -12 15 -16 4 Z"
          fill="var(--halloween-intaglio)"
        />
      </g>
      <path d={CONO_STREGA} fill="var(--halloween-cappello)" />
      <path d="M157 134 L166 118 L261 115 L267 129 Z" fill="var(--halloween-arancio)" />
      <path d={CONO_STREGA} stroke="currentColor" strokeWidth="6" strokeLinejoin="round" />
      <ellipse {...ORLO_STREGA} fill="var(--halloween-cappello)" stroke="currentColor" strokeWidth="6" />
    </g>
  );
}

export function Logo(props: SVGProps<SVGSVGElement>) {
  const id = useId().replace(/:/g, "");
  const stacco = `logo-stacco-${id}`;
  const staccoStrega = `logo-stacco-strega-${id}`;
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <g className="logo-base">
        <Lettera />
      </g>
      <g className="logo-stagionale logo-sanvalentino">
        <LetteraSanValentino />
      </g>
      <g className="logo-stagionale logo-halloween">
        <mask id={staccoStrega} maskUnits="userSpaceOnUse" x="-2" y="-12" width="36" height="46">
          <rect x="-2" y="-12" width="36" height="46" fill="#fff" />
          <g transform={CAPPELLO}>
            <ellipse {...ORLO_STREGA} fill="#000" stroke="#000" strokeWidth="16" />
          </g>
        </mask>
        <g mask={`url(#${staccoStrega})`}>
          <DecoriHalloween />
        </g>
        <ZuccaECappelloDaStrega />
      </g>
      <g className="logo-stagionale logo-natale">
        <mask id={stacco} maskUnits="userSpaceOnUse" x="-2" y="-10" width="36" height="44">
          <rect x="-2" y="-10" width="36" height="44" fill="#fff" />
          <g transform={CAPPELLO} fill="#000" stroke="#000" strokeWidth="14">
            <rect {...ORLO} />
            <circle {...POMPON} />
          </g>
        </mask>
        <g mask={`url(#${stacco})`}>
          <Lettera />
          <g transform={CAPPELLO}>
            <path
              d="M118 160 C128 92 170 40 236 34 C288 30 336 56 354 104 C326 82 294 90 288 140 Z"
              fill="var(--natale-rosso)"
            />
            <path
              d="M236 34 C288 30 336 56 354 104 C326 82 294 90 288 140 L256 145 C262 96 262 62 236 34 Z"
              fill="var(--natale-rosso-ombra)"
            />
          </g>
        </g>
        <g transform={CAPPELLO} fill="var(--natale-pelliccia)" stroke="currentColor" strokeWidth="7">
          <rect {...ORLO} />
          <circle {...POMPON} />
        </g>
      </g>
    </svg>
  );
}
