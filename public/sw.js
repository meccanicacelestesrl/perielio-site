/*
 * Quando sito e applicazione erano lo stesso servizio, la pagina pubblica
 * registrava il service worker dell'applicazione anche su perielio.com. Il
 * sito non ne ha bisogno: questo worker prende il posto del vecchio al primo
 * controllo di aggiornamento del browser e si cancella da solo.
 */
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.registration.unregister());
});
