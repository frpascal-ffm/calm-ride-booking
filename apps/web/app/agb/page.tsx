import type { Metadata } from "next";
import { legal } from "../../src/config/legal";

export const metadata: Metadata = {
  title: "Allgemeine Geschäftsbedingungen",
  description: "AGB",
  alternates: { canonical: "/agb" },
};

export default function AgbPage() {
  return (
    <div className="container mx-auto max-w-3xl space-y-6 p-4 md:p-8">
      <h1 className="text-3xl font-bold">Allgemeine Geschäftsbedingungen (AGB)</h1>
      <ol className="list-decimal space-y-4 pl-5 text-sm">
        <li id="geltungsbereich">
          <h2 className="font-semibold">Geltungsbereich</h2>
          <p>Diese AGB gelten für alle Verträge zwischen {legal.company.name} ({legal.company.rechtsform}) und Unternehmern ("Kunde") über die Nutzung unserer SaaS-Plattform.</p>
        </li>
        <li id="vertragsschluss">
          <h2 className="font-semibold">Vertragsschluss</h2>
          <p>Der Vertrag kommt durch Registrierung und Bestätigung des Accounts zustande. Ein Anspruch auf Abschluss besteht nicht. Testphasen können jederzeit beendet werden.</p>
        </li>
        <li id="leistungen">
          <h2 className="font-semibold">Leistungsbeschreibung</h2>
          <p>Wir stellen eine SaaS-Lösung zur Verfügung. Ein bestimmter Erfolg wird nicht geschuldet. Verfügbarkeit und Wartung erfolgen nach den üblichen Standards; planbare Wartungsfenster werden rechtzeitig angekündigt.</p>
        </li>
        <li id="preise">
          <h2 className="font-semibold">Preise und Abrechnung</h2>
          <p>Die Nutzung erfolgt im Abonnement. Preise richten sich nach Fahrzeuganzahl (Platzhalter). Der Abrechnungszeitraum beträgt einen Monat, Zahlungen sind im Voraus fällig. Bei Verzug gelten die gesetzlichen Regelungen. Rabatte und Testphasen sind freiwillig und können widerrufen werden.</p>
        </li>
        <li id="laufzeit">
          <h2 className="font-semibold">Laufzeit und Kündigung</h2>
          <p>Verträge laufen auf unbestimmte Zeit und können mit einer Frist von 30 Tagen zum Monatsende gekündigt werden. Eine fristlose Kündigung aus wichtigem Grund bleibt unberührt. Nach Vertragsende stellen wir Ihnen Ihre Daten innerhalb von 30 Tagen in einem gängigen Format zum Export bereit.</p>
        </li>
        <li id="nutzungsrechte">
          <h2 className="font-semibold">Nutzungsrechte</h2>
          <p>Der Kunde erhält ein einfaches, nicht übertragbares Nutzungsrecht an der Software für die Vertragsdauer. Feedback darf von uns unentgeltlich genutzt werden. Open-Source-Komponenten unterliegen ihren jeweiligen Lizenzen.</p>
        </li>
        <li id="kundendaten">
          <h2 className="font-semibold">Kundendaten & Datenschutz</h2>
          <p>Der Kunde bleibt Verantwortlicher im Sinne der DSGVO. Soweit wir Daten im Auftrag verarbeiten, schließen wir einen Auftragsverarbeitungsvertrag (Art. 28 DSGVO). Beide Parteien verpflichten sich zur Geheimhaltung.</p>
        </li>
        <li id="pflichten">
          <h2 className="font-semibold">Pflichten des Kunden</h2>
          <p>Der Kunde nutzt die Plattform nur im Rahmen der gesetzlichen Bestimmungen und sorgt für die Administration seiner Nutzer. Missbrauch ist untersagt.</p>
        </li>
        <li id="haftung">
          <h2 className="font-semibold">Gewährleistung und Haftung</h2>
          <p>Wir haften unbegrenzt für Vorsatz und grobe Fahrlässigkeit sowie für Schäden an Leben, Körper oder Gesundheit. Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten ist die Haftung auf den vertragstypischen vorhersehbaren Schaden begrenzt. Im Übrigen ist die Haftung ausgeschlossen. Die Haftung nach dem Produkthaftungsgesetz bleibt unberührt.</p>
        </li>
        <li id="hoehereGewalt">
          <h2 className="font-semibold">Höhere Gewalt</h2>
          <p>Bei Ereignissen höherer Gewalt sind beide Parteien für deren Dauer von ihren Leistungspflichten befreit. Dauert der Zustand länger als 30 Tage an, sind beide Parteien zur Kündigung berechtigt.</p>
        </li>
        <li id="aenderungenAgb">
          <h2 className="font-semibold">Änderungen der AGB</h2>
          <p>Wir können diese AGB mit Wirkung für die Zukunft ändern. Über Änderungen informieren wir mindestens 30 Tage im Voraus. Widerspricht der Kunde nicht, gelten die Änderungen als akzeptiert.</p>
        </li>
        <li id="schlussbestimmungen">
          <h2 className="font-semibold">Schlussbestimmungen</h2>
          <p>Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand ist, soweit zulässig, der Sitz von {legal.company.name}. Vertragssprache ist Deutsch. Sollte eine Bestimmung unwirksam sein, bleibt der Vertrag im Übrigen wirksam.</p>
        </li>
      </ol>
      <p className="text-sm text-muted-foreground">Stand: {legal.lastUpdated}</p>
      <p className="text-xs italic text-muted-foreground">Diese Mustertexte ersetzen keine Rechtsberatung. Bitte lassen Sie die Inhalte final anwaltlich prüfen.</p>
    </div>
  );
}
