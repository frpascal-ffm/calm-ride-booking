# Rechtliche Seiten & Konfiguration

## Firmendaten pflegen
Alle juristisch relevanten Stammdaten befinden sich in [`apps/web/src/config/legal.ts`](../apps/web/src/config/legal.ts). Dort können Name, Anschrift, Vertreter, Registerangaben sowie eingesetzte Auftragsverarbeiter zentral angepasst werden. Das Feld `lastUpdated` wird beim Build automatisch mit dem aktuellen Datum befüllt.

## Cookie-Einstellungen
Der Link **Cookie-Einstellungen** im Footer öffnet den Stub-Consent-Manager aus [`apps/web/src/components/CookieSettings.tsx`](../apps/web/src/components/CookieSettings.tsx). Er kann bei Bedarf erweitert oder an ein externes Tool angebunden werden.

## Auftragsverarbeiterliste aktualisieren
Neue Dienstleister werden in `legal.processors` in [`legal.ts`](../apps/web/src/config/legal.ts) ergänzt. Für jeden Dienst bitte Zweck, Sitz, Datenschutzerklärung und ggf. Hinweis auf DPA/SCC angeben.
