# Product Requirements Document (PRD)
# Calm Ride Booking - Krankentransport-Buchungssystem

**Version:** 1.0  
**Datum:** Januar 2025  
**Autor:** Entwicklungsteam  
**Status:** Entwurf  

---

## 1. Übersicht

### 1.1 Produktbeschreibung
Calm Ride Booking ist eine SaaS-Plattform für die digitale Verwaltung und Buchung von Krankentransporten. Das System ermöglicht es Krankentransport-Unternehmen, ihre Partnernetzwerke (Krankenhäuser, Arztpraxen, Pflegeheime) zu verwalten und diesen eine benutzerfreundliche Buchungsschnittstelle bereitzustellen.

### 1.2 Hauptfunktionen
- **Multi-Tenant-Architektur** für verschiedene Krankentransport-Unternehmen
- **Partner-Management** mit individuellen Buchungsseiten
- **Zeitslot-basierte Buchungen** mit automatischer Verfügbarkeitsprüfung
- **Patientendaten-Erfassung** mit speziellen medizinischen Anforderungen
- **Admin-Dashboard** für Buchungsverwaltung und Reporting
- **White-Label-Lösung** mit anpassbaren Unternehmens-Brandings

### 1.3 Zielgruppen
- **Primär:** Krankentransport-Unternehmen (B2B-Kunden)
- **Sekundär:** Medizinische Einrichtungen (Partner der Krankentransport-Unternehmen)
- **Tertiär:** Patienten (indirekte Nutzer über Partner)

---

## 2. Ziele

### 2.1 Geschäftsziele
- **Digitalisierung** des Krankentransport-Buchungsprozesses
- **Effizienzsteigerung** durch automatisierte Terminvergabe
- **Skalierbare SaaS-Lösung** für den deutschen Gesundheitsmarkt
- **Reduzierung** von Telefonanrufen und manueller Koordination um 80%
- **Verbesserung** der Kundenzufriedenheit durch transparente Buchungsprozesse

### 2.2 Technische Ziele
- **Hochverfügbarkeit** (99.9% Uptime)
- **Skalierbarkeit** für bis zu 1000 Unternehmen und 10.000 Partner
- **DSGVO-Konformität** für sensible Patientendaten
- **Mobile-First Design** für optimale Nutzung auf allen Geräten
- **Real-time Updates** für Buchungsstatus und Verfügbarkeiten

### 2.3 Nutzerziele
- **Einfache Buchung** in unter 3 Minuten
- **Transparente Verfügbarkeiten** in Echtzeit
- **Automatische Bestätigungen** und Erinnerungen
- **Zentrale Verwaltung** aller Buchungen und Partner

---

## 3. Anforderungen

### 3.1 Funktionale Anforderungen

#### 3.1.1 Unternehmensverwaltung
- **F001:** Registrierung und Onboarding neuer Krankentransport-Unternehmen
- **F002:** Konfiguration von Arbeitszeiten (Start/Ende, Wochentage)
- **F003:** Einstellung von Karenzzeiten zwischen Buchungen (Standard: 15 Min)
- **F004:** Verwaltung von Unternehmens-Slugs für individuelle URLs
- **F005:** Upload und Verwaltung von Firmenlogos und Branding

#### 3.1.2 Partner-Management
- **F006:** Anlegen und Verwalten von Partnern (Krankenhäuser, Praxen)
- **F007:** Generierung individueller Buchungs-URLs (/{company}/{partner})
- **F008:** Aktivierung/Deaktivierung von Partnern
- **F009:** Partner-spezifische E-Mail-Konfiguration
- **F010:** Zugriffsberechtigung und Authentifizierung für Partner

#### 3.1.3 Buchungssystem
- **F011:** Kalenderbasierte Terminauswahl mit Zeitslots
- **F012:** Automatische Verfügbarkeitsprüfung basierend auf Arbeitszeiten
- **F013:** Erfassung von Patientenstammdaten (Name, Geburtsdatum, Fallnummer)
- **F014:** Eingabe von Abhol- und Zieladressen
- **F015:** Auswahl spezieller Anforderungen (Rollstuhl, Adipositas, Infektiosität)
- **F016:** Freitextfeld für zusätzliche Informationen
- **F017:** Automatische Buchungsbestätigung per E-Mail
- **F018:** Stornierung und Umbuchung von Terminen

#### 3.1.4 Admin-Dashboard
- **F019:** Übersicht aller Buchungen mit Filterfunktionen
- **F020:** Export von Buchungsdaten (CSV, PDF)
- **F021:** Statistiken und Reporting (Auslastung, Partner-Performance)
- **F022:** Verwaltung von Benutzern und Berechtigungen
- **F023:** System-Konfiguration und Einstellungen

### 3.2 Nicht-funktionale Anforderungen

#### 3.2.1 Performance
- **NF001:** Seitenladezeiten unter 2 Sekunden
- **NF002:** Buchungsvorgang in unter 30 Sekunden abschließbar
- **NF003:** Unterstützung von 1000 gleichzeitigen Nutzern
- **NF004:** Datenbankabfragen unter 100ms

#### 3.2.2 Sicherheit
- **NF005:** HTTPS-Verschlüsselung für alle Datenübertragungen
- **NF006:** DSGVO-konforme Datenspeicherung und -verarbeitung
- **NF007:** Rollenbasierte Zugriffskontrolle (RBAC)
- **NF008:** Audit-Logs für alle kritischen Aktionen
- **NF009:** Regelmäßige Sicherheits-Updates und Patches

#### 3.2.3 Usability
- **NF010:** Responsive Design für Desktop, Tablet und Mobile
- **NF011:** Barrierefreie Bedienung (WCAG 2.1 AA)
- **NF012:** Intuitive Benutzerführung ohne Schulungsbedarf
- **NF013:** Mehrsprachigkeit (Deutsch, Englisch)

#### 3.2.4 Verfügbarkeit
- **NF014:** 99.9% Uptime (max. 8.76 Stunden Ausfall/Jahr)
- **NF015:** Automatische Backups alle 6 Stunden
- **NF016:** Disaster Recovery Plan mit RTO < 4 Stunden

---

## 4. Systemarchitektur

### 4.1 Hochlevel-Architektur

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React SPA)   │◄──►│   (Supabase)    │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│   CDN/Hosting   │◄─────────────┘
                        │   (Vercel)      │
                        └─────────────────┘
```

### 4.2 Technologie-Stack

#### 4.2.1 Frontend
- **Framework:** React 18 mit TypeScript
- **Build Tool:** Vite
- **UI Library:** Shadcn/ui + Tailwind CSS
- **State Management:** TanStack Query (React Query)
- **Routing:** React Router v6
- **Forms:** React Hook Form + Zod Validation

#### 4.2.2 Backend
- **BaaS:** Supabase (PostgreSQL + Auth + Real-time + Storage)
- **API:** Auto-generierte REST API + GraphQL
- **Authentication:** Supabase Auth (JWT-basiert)
- **File Storage:** Supabase Storage

#### 4.2.3 Infrastructure
- **Hosting:** Vercel (Frontend) + Supabase Cloud (Backend)
- **CDN:** Vercel Edge Network
- **Monitoring:** Supabase Analytics + Vercel Analytics
- **CI/CD:** GitHub Actions

### 4.3 Datenmodell

#### 4.3.1 Hauptentitäten
- **Organizations (Unternehmen)**
  - id, name, slug, arbeitszeiten_start, arbeitszeiten_end, karenzzeit
- **Partners**
  - id, company_id, name, email, slug, active
- **Bookings**
  - id, company_id, partner_id, patient_data, pickup_address, destination_address, booking_date, time_slot, special_requirements
- **Users**
  - id, email, role, organization_id

---

## 5. Implementierungsplan

### 5.1 Phase 1: Foundation (Wochen 1-4)

#### 5.1.1 Ziele
- Grundlegende Projektstruktur etablieren
- Entwicklungsumgebung einrichten
- Basis-Authentifizierung implementieren

#### 5.1.2 Detaillierte Schritte
1. **Woche 1: Projekt-Setup**
   - Repository-Struktur finalisieren
   - Supabase-Projekt konfigurieren
   - CI/CD-Pipeline einrichten
   - Entwicklungsstandards definieren

2. **Woche 2: Datenbankschema**
   - Migrationen für alle Haupttabellen
   - Row Level Security (RLS) Policies
   - Seed-Daten für Entwicklung
   - API-Tests implementieren

3. **Woche 3: Basis-UI**
   - Design System mit Shadcn/ui
   - Responsive Layout-Komponenten
   - Navigation und Routing
   - Error Boundaries und Loading States

4. **Woche 4: Authentifizierung**
   - Supabase Auth Integration
   - Login/Logout Funktionalität
   - Rollenbasierte Zugriffskontrolle
   - Protected Routes

#### 5.1.3 Deliverables
- ✅ Funktionsfähige Entwicklungsumgebung
- ✅ Vollständiges Datenbankschema
- ✅ Basis-UI mit Authentifizierung
- ✅ Automatisierte Tests (Unit + Integration)

### 5.2 Phase 2: Core Booking System (Wochen 5-8)

#### 5.2.1 Ziele
- Buchungsformular implementieren
- Zeitslot-Management entwickeln
- Partner-spezifische URLs einrichten

#### 5.2.2 Detaillierte Schritte
1. **Woche 5: Buchungsformular**
   - Multi-Step Form mit Validierung
   - Patientendaten-Erfassung
   - Adress-Eingabe mit Autocomplete
   - Spezielle Anforderungen UI

2. **Woche 6: Zeitslot-System**
   - Kalender-Komponente
   - Verfügbarkeitslogik
   - Arbeitszeiten-Integration
   - Karenzzeiten-Berechnung

3. **Woche 7: Partner-URLs**
   - Dynamic Routing für /{company}/{partner}
   - Partner-spezifische Konfiguration
   - White-Label Branding
   - SEO-Optimierung

4. **Woche 8: Buchungsbestätigung**
   - E-Mail-Templates
   - Automatische Benachrichtigungen
   - Buchungsübersicht
   - PDF-Generierung

#### 5.2.3 Deliverables
- ✅ Vollständiges Buchungssystem
- ✅ Partner-spezifische Buchungsseiten
- ✅ Automatische E-Mail-Benachrichtigungen
- ✅ Mobile-optimierte Benutzeroberfläche

### 5.3 Phase 3: Admin Dashboard (Wochen 9-12)

#### 5.3.1 Ziele
- Umfassendes Admin-Panel entwickeln
- Buchungsverwaltung implementieren
- Reporting und Analytics

#### 5.3.2 Detaillierte Schritte
1. **Woche 9: Dashboard-Layout**
   - Admin-Navigation
   - Dashboard-Widgets
   - Responsive Admin-UI
   - Datenvisualisierung

2. **Woche 10: Buchungsverwaltung**
   - Buchungsübersicht mit Filtern
   - Bearbeitung und Stornierung
   - Bulk-Operationen
   - Export-Funktionen

3. **Woche 11: Partner-Management**
   - Partner-CRUD-Operationen
   - Benutzerrechte-Verwaltung
   - Aktivierung/Deaktivierung
   - Partner-Analytics

4. **Woche 12: Reporting**
   - Auslastungsstatistiken
   - Partner-Performance
   - Umsatz-Tracking
   - Custom Reports

#### 5.3.3 Deliverables
- ✅ Vollständiges Admin-Dashboard
- ✅ Buchungs- und Partner-Management
- ✅ Reporting und Analytics
- ✅ Benutzerrechte-System

### 5.4 Phase 4: Advanced Features (Wochen 13-16)

#### 5.4.1 Ziele
- Erweiterte Funktionen implementieren
- Performance-Optimierung
- Sicherheits-Härtung

#### 5.4.2 Detaillierte Schritte
1. **Woche 13: Erweiterte Buchungsfeatures**
   - Wiederkehrende Termine
   - Buchungsvorlagen
   - Wartelisten-Management
   - Automatische Erinnerungen

2. **Woche 14: Integration & APIs**
   - Kalender-Integration (Outlook, Google)
   - SMS-Benachrichtigungen
   - Webhook-System
   - Third-Party APIs

3. **Woche 15: Performance & Security**
   - Caching-Strategien
   - Database-Optimierung
   - Security Audit
   - Penetration Testing

4. **Woche 16: Testing & Documentation**
   - End-to-End Tests
   - Load Testing
   - API-Dokumentation
   - User Documentation

#### 5.4.3 Deliverables
- ✅ Erweiterte Buchungsfeatures
- ✅ Externe Integrationen
- ✅ Performance-optimierte Anwendung
- ✅ Vollständige Dokumentation

### 5.5 Phase 5: Launch Preparation (Wochen 17-20)

#### 5.5.1 Ziele
- Produktionsreife sicherstellen
- Go-Live vorbereiten
- Support-Strukturen etablieren

#### 5.5.2 Detaillierte Schritte
1. **Woche 17: Beta Testing**
   - Closed Beta mit ausgewählten Kunden
   - Bug Fixes und Optimierungen
   - User Feedback Integration
   - Performance Monitoring

2. **Woche 18: Production Setup**
   - Produktionsumgebung konfigurieren
   - Monitoring und Alerting
   - Backup-Strategien
   - Disaster Recovery Testing

3. **Woche 19: Training & Support**
   - Schulungsunterlagen erstellen
   - Support-Team trainieren
   - Onboarding-Prozess definieren
   - FAQ und Troubleshooting

4. **Woche 20: Go-Live**
   - Soft Launch mit ersten Kunden
   - Monitoring und Support
   - Marketing-Aktivitäten
   - Feedback-Sammlung

#### 5.5.3 Deliverables
- ✅ Produktionsreife Anwendung
- ✅ Vollständige Monitoring-Suite
- ✅ Trainierte Support-Teams
- ✅ Erfolgreicher Soft Launch

---

## 6. Meilensteine

### 6.1 Kritische Meilensteine

| Meilenstein | Woche | Datum | Beschreibung | Erfolgskriterien |
|-------------|-------|-------|--------------|------------------|
| **M1: Foundation Complete** | 4 | Ende Januar | Basis-Infrastruktur steht | ✅ Auth funktioniert<br>✅ DB-Schema deployed<br>✅ CI/CD läuft |
| **M2: MVP Booking System** | 8 | Ende Februar | Grundlegende Buchung möglich | ✅ Buchung funktioniert<br>✅ E-Mails werden versendet<br>✅ Mobile-optimiert |
| **M3: Admin Dashboard** | 12 | Ende März | Vollständige Verwaltung | ✅ Buchungen verwaltbar<br>✅ Partner-Management<br>✅ Basic Reporting |
| **M4: Feature Complete** | 16 | Ende April | Alle Features implementiert | ✅ Erweiterte Features<br>✅ Performance-optimiert<br>✅ Security-gehärtet |
| **M5: Production Ready** | 20 | Ende Mai | Go-Live bereit | ✅ Beta-Tests bestanden<br>✅ Monitoring aktiv<br>✅ Support-Team bereit |

### 6.2 Zwischenmeilensteine

- **Woche 2:** Datenbankschema finalisiert
- **Woche 6:** Zeitslot-System funktionsfähig
- **Woche 10:** Buchungsverwaltung implementiert
- **Woche 14:** Externe Integrationen abgeschlossen
- **Woche 18:** Produktionsumgebung bereit

---

## 7. Risikoanalyse

### 7.1 Technische Risiken

#### 7.1.1 Hohes Risiko
| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| **Supabase Vendor Lock-in** | Mittel | Hoch | Database-Abstraction Layer implementieren |
| **DSGVO-Compliance Probleme** | Niedrig | Sehr Hoch | Frühzeitige Rechtsberatung, Privacy by Design |
| **Performance bei Skalierung** | Mittel | Hoch | Load Testing, Database-Optimierung |

#### 7.1.2 Mittleres Risiko
| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| **Komplexität Zeitslot-Management** | Hoch | Mittel | Prototyping, externe Libraries evaluieren |
| **Mobile Performance** | Mittel | Mittel | Progressive Web App, Code Splitting |
| **Third-Party API Ausfälle** | Mittel | Mittel | Fallback-Mechanismen, Circuit Breaker |

### 7.2 Geschäftsrisiken

#### 7.2.1 Marktrisiken
- **Konkurrenz:** Etablierte Anbieter könnten ähnliche Lösungen entwickeln
  - *Mitigation:* Schnelle Markteinführung, Differenzierung durch UX
- **Regulatorische Änderungen:** Neue Gesetze im Gesundheitswesen
  - *Mitigation:* Flexible Architektur, enge Zusammenarbeit mit Rechtsberatung

#### 7.2.2 Operative Risiken
- **Ressourcen-Engpässe:** Entwickler-Kapazitäten überlastet
  - *Mitigation:* Agile Priorisierung, externe Unterstützung
- **Kunden-Onboarding:** Komplexer als erwartet
  - *Mitigation:* Vereinfachter Onboarding-Prozess, Schulungen

### 7.3 Kontingenzmassnahmen

1. **Technische Schulden:** Wöchentliche Code Reviews, Refactoring-Sprints
2. **Zeitverzögerungen:** Buffer-Zeit in kritischen Phasen, Scope-Reduktion möglich
3. **Qualitätsprobleme:** Automatisierte Tests, kontinuierliche Integration
4. **Sicherheitslücken:** Security-First Approach, regelmäßige Audits

---

## 8. Erfolgskriterien

### 8.1 Quantitative Metriken

#### 8.1.1 Technische KPIs
- **Performance:**
  - Seitenladezeit < 2 Sekunden (95. Perzentil)
  - API Response Time < 100ms (Median)
  - Uptime > 99.9%
  - Mobile PageSpeed Score > 90

- **Skalierbarkeit:**
  - 1000+ gleichzeitige Nutzer unterstützt
  - 10.000+ Buchungen pro Tag verarbeitbar
  - 100+ Unternehmen onboardbar

#### 8.1.2 Business KPIs
- **Adoption:**
  - 10+ Pilot-Kunden in ersten 3 Monaten
  - 50+ Partner-Registrierungen
  - 1000+ Buchungen im ersten Quartal

- **Effizienz:**
  - 80% Reduktion der Telefonanrufe
  - 60% Zeitersparnis bei Buchungsprozess
  - 95% automatische Buchungsbestätigungen

### 8.2 Qualitative Metriken

#### 8.2.1 User Experience
- **Usability Score:** > 4.5/5 (SUS-Score > 80)
- **Net Promoter Score:** > 50
- **Support-Tickets:** < 5% der Buchungen
- **Onboarding-Erfolg:** > 90% Complete Rate

#### 8.2.2 Compliance & Security
- **DSGVO-Compliance:** 100% (Audit bestanden)
- **Security-Score:** A-Rating (SSL Labs)
- **Penetration Test:** Keine kritischen Vulnerabilities
- **Data Breach:** 0 Incidents

### 8.3 Meilenstein-Kriterien

#### 8.3.1 MVP-Kriterien (Woche 8)
- ✅ Buchung in < 3 Minuten möglich
- ✅ Automatische E-Mail-Bestätigung
- ✅ Mobile-responsive Design
- ✅ Partner-spezifische URLs funktional
- ✅ Grundlegende Admin-Funktionen

#### 8.3.2 Launch-Kriterien (Woche 20)
- ✅ Alle funktionalen Anforderungen erfüllt
- ✅ Performance-Ziele erreicht
- ✅ Security-Audit bestanden
- ✅ 5+ Pilot-Kunden erfolgreich onboardet
- ✅ Support-Dokumentation vollständig

### 8.4 Langfristige Erfolgsmessung

#### 8.4.1 6-Monats-Ziele
- **Kunden:** 25+ aktive Unternehmen
- **Revenue:** €50k+ MRR
- **Churn Rate:** < 5% monatlich
- **Feature Adoption:** > 80% der Kernfeatures genutzt

#### 8.4.2 12-Monats-Vision
- **Marktposition:** Top 3 Anbieter in DACH-Region
- **Skalierung:** 100+ Unternehmen, 1000+ Partner
- **Expansion:** Zusätzliche Vertikale (Taxi, Logistik)
- **Profitabilität:** Break-even erreicht

---

## 9. Anhang

### 9.1 Glossar
- **Partner:** Medizinische Einrichtungen, die Krankentransporte buchen
- **Karenzzeit:** Pufferzeit zwischen Buchungen für Fahrzeugwechsel
- **Zeitslot:** Verfügbares Zeitfenster für Buchungen
- **Multi-Tenant:** Mehrere Kunden nutzen dieselbe Anwendungsinstanz
- **White-Label:** Anpassbare Lösung ohne sichtbare Herstellermarke

### 9.2 Referenzen
- Supabase Dokumentation: https://supabase.com/docs
- React Best Practices: https://react.dev/learn
- DSGVO Guidelines: https://gdpr.eu/
- Accessibility Guidelines: https://www.w3.org/WAI/WCAG21/

### 9.3 Änderungshistorie
| Version | Datum | Autor | Änderungen |
|---------|-------|-------|------------|
| 1.0 | Januar 2025 | Entwicklungsteam | Initiale Version |

---

**Dokumentstatus:** ✅ Review erforderlich  
**Nächste Überprüfung:** Februar 2025  
**Genehmigung:** Ausstehend