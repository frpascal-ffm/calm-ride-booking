import type { Metadata } from "next";
import { legal } from "../../src/config/legal";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Anbieterkennzeichnung nach § 5 DDG",
  alternates: { canonical: "/impressum" },
};

export default function ImpressumPage() {
  const c = legal.company;
  return (
    <div className="container mx-auto max-w-3xl space-y-6 p-4 md:p-8">
      <h1 className="text-3xl font-bold">Impressum</h1>
      <Card>
        <CardHeader>
          <CardTitle>Anbieter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>{c.name} {c.rechtsform}</p>
          <p>{c.anschrift.strasse}</p>
          <p>{c.anschrift.plz} {c.anschrift.ort}</p>
          <p>{c.anschrift.land}</p>
          <p>Tel: {c.kontakt.tel}</p>
          <p>E-Mail: <a href={`mailto:${c.kontakt.email}`} className="underline">{c.kontakt.email}</a></p>
          <p>Vertretungsberechtigt: {c.vertretungsberechtigte}</p>
          <p>Register: {c.register.gericht}, Nr. {c.register.nummer}</p>
          <p>Umsatzsteuer-ID: {c.ustId}</p>
          {c.verantwortlicher_iSd_MStV && (
            <p>Verantwortlich i.S.d. § 18 Abs. 2 MStV: {c.verantwortlicher_iSd_MStV}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Haftung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Für eigene Inhalte übernehmen wir gemäß § 7 Abs. 1 DDG Verantwortung. Nach §§ 8 bis 10 DDG sind wir jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.</p>
          <p>Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für externe Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Urheberrecht</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Die durch uns erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung bedürfen der schriftlichen Zustimmung des jeweiligen Autors.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verbraucherstreitbeilegung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit: <a href={c.eu_os_link} className="underline" target="_blank" rel="noopener noreferrer">{c.eu_os_link}</a>.</p>
          <p>Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">Stand: {legal.lastUpdated}</p>
      <p className="text-xs italic text-muted-foreground">Diese Mustertexte ersetzen keine Rechtsberatung. Bitte lassen Sie die Inhalte final anwaltlich prüfen.</p>
    </div>
  );
}
