import type { Metadata } from "next";
import { legal } from "../../src/config/legal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../src/components/ui/accordion";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Informationen nach Art. 12 ff. DSGVO",
  alternates: { canonical: "/datenschutz" },
};

export default function DatenschutzPage() {
  const c = legal.company;
  return (
    <div className="container mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="mb-6 text-3xl font-bold">Datenschutzerklärung</h1>
      <nav className="mb-6">
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li><a href="#verantwortlicher" className="underline">Verantwortlicher</a></li>
          <li><a href="#verarbeitung" className="underline">Verarbeitungstätigkeiten</a></li>
          <li><a href="#empfaenger" className="underline">Empfänger & Auftragsverarbeiter</a></li>
          <li><a href="#rechte" className="underline">Ihre Rechte</a></li>
          <li><a href="#cookies" className="underline">Cookies & Tracking</a></li>
          <li><a href="#aenderungen" className="underline">Änderungen</a></li>
        </ul>
      </nav>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="verantwortlicher" id="verantwortlicher">
          <AccordionTrigger>Verantwortlicher</AccordionTrigger>
          <AccordionContent className="space-y-2 text-sm">
            <p>{c.name} {c.rechtsform}</p>
            <p>{c.anschrift.strasse}, {c.anschrift.plz} {c.anschrift.ort}, {c.anschrift.land}</p>
            <p>Tel: {c.kontakt.tel}</p>
            <p>E-Mail: <a href={`mailto:${c.kontakt.email}`} className="underline">{c.kontakt.email}</a></p>
            {c.dpo && c.dpo.name && c.dpo.email && (
              <p>Datenschutzbeauftragter: {c.dpo.name}, <a href={`mailto:${c.dpo.email}`} className="underline">{c.dpo.email}</a></p>
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="verarbeitung" id="verarbeitung">
          <AccordionTrigger>Verarbeitungstätigkeiten</AccordionTrigger>
          <AccordionContent className="space-y-2 text-sm">
            <p>Wir verarbeiten personenbezogene Daten gemäß Art. 6 Abs. 1 DSGVO nur, soweit dies zur Bereitstellung unserer Dienste erforderlich ist. Dies umfasst insbesondere Stammdaten, Vertrags- und Abrechnungsdaten, Nutzungs- und Protokolldaten sowie Inhalte, die Sie hochladen.</p>
            <p>Die Zwecke umfassen die Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO), berechtigte Interessen wie die Optimierung unseres Angebots und Sicherheit (Art. 6 Abs. 1 lit. f DSGVO) sowie Ihre Einwilligung, soweit erforderlich (Art. 6 Abs. 1 lit. a DSGVO).</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="empfaenger" id="empfaenger">
          <AccordionTrigger>Empfänger & Auftragsverarbeiter</AccordionTrigger>
          <AccordionContent className="space-y-2 text-sm">
            <p>Wir setzen folgende Auftragsverarbeiter ein gemäß Art. 28 DSGVO. Bei Übermittlung in Drittländer werden Standardvertragsklauseln nach Art. 44 ff. DSGVO abgeschlossen:</p>
            <ul className="list-disc space-y-2 pl-5">
              {legal.processors.map((p) => (
                <li key={p.name}>
                  <strong>{p.name}</strong> – {p.zweck}, Sitz: {p.sitz}, {" "}
                  <a href={p.datenschutz_url} target="_blank" rel="noopener noreferrer" className="underline">Datenschutz</a>
                  {p.dpa_scc && ", DPA/SCC"}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="rechte" id="rechte">
          <AccordionTrigger>Ihre Rechte</AccordionTrigger>
          <AccordionContent className="space-y-2 text-sm">
            <p>Sie haben gemäß Art. 12–23 DSGVO das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit sowie Widerspruch gegen bestimmte Verarbeitungen. Einwilligungen können Sie jederzeit mit Wirkung für die Zukunft widerrufen.</p>
            <p>Sie können sich bei einer Aufsichtsbehörde beschweren, z.B. {legal.supervisory_authority_hint}.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="cookies" id="cookies">
          <AccordionTrigger>Cookies & Tracking</AccordionTrigger>
          <AccordionContent className="space-y-2 text-sm">
            <p>Wir verwenden technisch notwendige Cookies zur Bereitstellung unserer Dienste. Nicht notwendige Cookies setzen wir nur mit Ihrer Einwilligung gemäß § 25 TTDSG/TDDDG. Sie können Ihre Einwilligungen jederzeit über die Funktion „Cookie-Einstellungen" widerrufen.</p>
            {legal.cookiesAndTracking.length > 0 && (
              <div>
                <p>Folgende Tools werden eingesetzt:</p>
                <ul className="list-disc space-y-1 pl-5">
                  {legal.cookiesAndTracking.map((t) => (
                    <li key={t.name}><strong>{t.name}</strong>: {t.zweck}</li>
                  ))}
                </ul>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="aenderungen" id="aenderungen">
          <AccordionTrigger>Änderungen</AccordionTrigger>
          <AccordionContent className="space-y-2 text-sm">
            <p>Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte Rechtslagen oder bei Änderungen des Dienstes anzupassen.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <p className="mt-8 text-sm text-muted-foreground">Stand: {legal.lastUpdated}</p>
      <p className="text-xs italic text-muted-foreground">Diese Mustertexte ersetzen keine Rechtsberatung. Bitte lassen Sie die Inhalte final anwaltlich prüfen.</p>
    </div>
  );
}
