import { headers } from "next/headers";

import { LandingPage } from "./_site/landing";
import { asLang, LANG_HEADER } from "@/lib/lang";

// La lingua la decide il proxy (?lang o Accept-Language): qui si legge e basta.
export default async function Home() {
  const lang = asLang((await headers()).get(LANG_HEADER));
  return <LandingPage lang={lang} />;
}
