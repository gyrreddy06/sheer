# SheOra — Privacy-First Women's Health Companion PWA

> **Positioning**: Private cycle tracking, simple health insights, doctor-ready clinical reports, and Indian-language accessibility (Launch focus: Hyderabad / Telangana). Not a generic period tracker.

---

## 🌸 Core Philosophy & Non-Negotiable Rules

1. **Zero Exploitative Data Practices**: No real name required. No third-party analytics trackers, no ad networks, zero data broker sharing.
2. **Strict Medical Safety & Plain Language**:
   - Predictions are **always shown as a range** (e.g. *"expected between Nov 25 and Nov 29"*), never a single false-precise date.
   - Mandatory disclaimer: *"This is an estimate for tracking, not medical advice or contraception"* on predictions, insights, and reports.
   - Non-diagnostic phrasing: e.g. *"a pattern worth discussing with a doctor"*, never *"you have PCOS"*.
3. **Automated Red-Flag Advisory**: Triggers an immediate, calm alert when very heavy bleeding or severe pain (8+/10) is logged, providing direct hotlines (Telangana 108/112, Tele-MANAS 14416, Women Helpline 181).
4. **Under-18 Privacy Gate**: Friendly guardian guidance screen with zero personal data collected.
5. **Transparency**: Every educational article is marked *"Sample, pending medical review"* with explicit editorial and review timestamps.

---

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts
- **PWA**: `vite-plugin-pwa`, Web App Manifest, Service Worker offline caching
- **Backend / Database**: Supabase (PostgreSQL with Row Level Security on every table, Auth, Storage)
- **Internationalization**: `react-i18next` with full English (`en`) and Telugu (`te`) support; structured support ready for Hindi (`hi`), Tamil (`ta`), Kannada (`kn`), and Malayalam (`ml`).
- **Exporting**: `jspdf` for one-click Doctor-Ready clinical PDF exports and JSON data downloads.

---

## 📱 Features & Screens

1. **Welcome Screen**: Calm introduction, privacy badge, language toggle.
2. **Onboarding Flow**:
   - Language choice
   - 18+ Age Verification & bracket selection (with under-18 guardian gate)
   - Granular, **unticked** consent checkboxes (Terms, Privacy, Health Data Processing, Local Storage)
   - Goals selection (Track Periods, Understand PCOS/PCOD, Conceive, General Wellness)
   - Optional Cycle Basics with explicit *"I don't know / It varies"* option
3. **Home Dashboard**: Current cycle day, cycle phase guidance, range estimate for next period, today's check-in shortcut, and daily wellness tip.
4. **Period Calendar**: Interactive month view, flow logging (`spotting`, `light`, `medium`, `heavy`, `very_heavy`), irregular cycle marking, and history timeline.
5. **Daily Check-in (<30 seconds)**: Mood, energy level (1-5), sleep duration (hours), and private notes.
6. **Symptom Tracker**: Cramps, headaches, bloating, acne, breast tenderness, fatigue, discharge, sleep changes with 0-10 intensity sliders and history timeline.
7. **Cycle Insights**: Average cycle length, variability, symptom patterns by phase, energy/sleep correlation charts via Recharts, and non-diagnostic educational observations.
8. **"Ask Her" Health Library**: 6 curated guides (PCOS/PCOD, irregular periods, menstrual hygiene in warm climates, first period, reproductive health, hormonal nutrition). Full text in English & Telugu, search, bookmarking, and offline access.
9. **Doctor-Ready Report**: Configurable date range and category selection, printable summary, "Questions to Ask Your Doctor" section, and client-side PDF export.
10. **Privacy & Security Settings**:
    - **Discreet Mode**: Rebrands app UI as *"S-Notes"* with neutralized wording.
    - **Low-Data Mode**: Optimized for low-connectivity environments.
    - **PIN Lock Screen**: 4-digit security code protection.
    - **Data Export**: Complete JSON backup.
    - **Right to Erasure**: Complete account & personal data wipe.

---

## 🗄️ Database Schema & RLS Audit (`supabase/schema.sql`)

All 13 tables implement strict PostgreSQL Row Level Security (RLS):

| Table | Policy Type | Rule | Notes |
|---|---|---|---|
| `profiles` | RLS | `auth.uid() = id` | Minimum profile, no real names |
| `consents` | RLS | `auth.uid() = user_id` | Granular consent timestamps |
| `cycles` | RLS | `auth.uid() = user_id` | Cycle lengths and irregularity |
| `period_logs` | RLS | `auth.uid() = user_id` | Daily bleeding & flow intensity |
| `daily_checkins` | RLS | `auth.uid() = user_id` | Quick daily logs (<30s) |
| `symptom_types` | Public Read | `USING (true)` | Global symptom catalog |
| `symptom_logs` | RLS | `auth.uid() = user_id` | 0-10 severity ratings |
| `mood_logs` | RLS | `auth.uid() = user_id` | Mood ratings & timestamps |
| `education_articles`| Public Read | `USING (true)` | Read-only curated library |
| `saved_articles` | RLS | `auth.uid() = user_id` | Offline bookmarks |
| `reports` | RLS | `auth.uid() = user_id` | Clinical summary archives |
| `notification_prefs`| RLS | `auth.uid() = user_id` | Discreet notification settings |
| `deletion_requests` | RLS | `auth.uid() = user_id` | Erasure auditing |

---

## 🚀 Running the App Locally

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build for production (compiles PWA and service worker)
npm run build
```
