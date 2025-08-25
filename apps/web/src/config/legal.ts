export const legal = {
  company: {
    name: "Beispielunternehmen",
    rechtsform: "GmbH",
    anschrift: {
      strasse: "Musterstraße 1",
      plz: "12345",
      ort: "Musterstadt",
      land: "Deutschland",
    },
    kontakt: {
      tel: "+49 (0)000 000000",
      email: "info@example.com",
    },
    vertretungsberechtigte: "Max Mustermann",
    register: {
      gericht: "Amtsgericht Musterstadt",
      nummer: "HRB 00000",
    },
    ustId: "DE000000000",
    wirtschaftsId: null,
    aufsichtsbehoerde: null,
    berufsrecht: null,
    verantwortlicher_iSd_MStV: null,
    dpo: { name: null, email: null },
    eu_os_link: "https://ec.europa.eu/consumers/odr/",
  },
  processors: [
    {
      name: "Firebase / Google Cloud",
      zweck: "Hosting, Auth, Firestore, Functions",
      sitz: "USA / Irland",
      datenschutz_url: "https://policies.google.com/privacy",
      dpa_scc: true,
    },
    {
      name: "Vercel",
      zweck: "Hosting und Deployment",
      sitz: "USA / Deutschland",
      datenschutz_url: "https://vercel.com/legal/privacy-policy",
      dpa_scc: true,
    },
    {
      name: "OpenAI",
      zweck: "CSV/AI-Parsing",
      sitz: "USA",
      datenschutz_url: "https://openai.com/policies/privacy-policy",
      dpa_scc: true,
    },
    {
      name: "Stripe",
      zweck: "Zahlungsabwicklung",
      sitz: "USA / Irland",
      datenschutz_url: "https://stripe.com/privacy",
      dpa_scc: true,
    },
    {
      name: "Cloudflare",
      zweck: "CDN und Sicherheit",
      sitz: "USA / EU",
      datenschutz_url: "https://www.cloudflare.com/privacypolicy/",
      dpa_scc: true,
    },
    {
      name: "Sentry",
      zweck: "Monitoring",
      sitz: "USA / EU",
      datenschutz_url: "https://sentry.io/privacy/",
      dpa_scc: true,
    },
  ],
  cookiesAndTracking: [
    { name: "Google Analytics", zweck: "Reichweitenanalyse" },
    { name: "Google Tag Manager", zweck: "Tag-Verwaltung" },
  ],
  jurisdiction: "Deutschland",
  supervisory_authority_hint: "Berliner Beauftragte für Datenschutz und Informationsfreiheit",
  lastUpdated: new Date().toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' }),
} as const;

export type LegalConfig = typeof legal;
