# SafeHer — Personal Safety Web App (Frontend Demo)

React + Vite + TypeScript + Tailwind CSS + React Router + Leaflet/OpenStreetMap + Lucide. All data lives in `localStorage`.
**DEMO ONLY: no SMS, calls, police, or app users are ever contacted.**

## Run
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # serve the build locally
```
Geolocation needs `localhost` or HTTPS.

## Deploy
Static site. Vercel / Netlify / Cloudflare Pages: build command `npm run build`, output `dist`. `public/_redirects` handles SPA routing on Netlify.

## Structure
```
src/components/{layout,sos,location,ui}  Layout + nav, SOS button/countdown, Leaflet map, UI primitives
src/pages/        Dashboard, SosActive, LocationPage, ContactsPage, ProfilePage, HistoryPage
src/hooks/        useApp (state context: profile, contacts, events, location, toasts)
src/services/     storage (localStorage wrapper), geolocation
src/types, src/utils
```

## Features
SOS with 5s cancellable countdown → event (ID, timestamp, user, coords, contacts, status) → active screen with map and SIMULATED notification list → resolve/cancel → saved history.
Real Geolocation API with denied/unavailable/timeout handling, permission status, Leaflet marker + accuracy circle, refresh, copy/open link.
Contact CRUD with validation (BD mobile format), duplicate-number detection, primary contact, delete confirmation, empty state.
Profile editing with validation and preferences. History list/detail/clear. Toasts, DEMO MODE badge, responsive sidebar/bottom nav.

## Limitations
- Notifications are simulated; a real product needs a backend plus SMS/push providers.
- Data is per-browser; there are no accounts or sync.
- Map tiles need internet (OpenStreetMap). Sample profile/contacts are placeholders.
- UI primitives are hand-written (shadcn-style) rather than generated via the shadcn CLI; Radix is not used.
- Tested by type-check and production build only; no automated or in-browser tests were run.
