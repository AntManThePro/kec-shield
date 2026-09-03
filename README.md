# KEC SHIELD

**TWC Defense & Field Incident Documentation**  
NEXUS ops console by **DoubleA @ AntManThePro**

Neon field tool for logging crew incidents, tracking required documentation, scoring claim-readiness, and exporting a packet before a Texas Workforce Commission claim lands.

This is an operations aid. It is **not legal advice**.

## Why it exists

Field managers lose TWC fights on paperwork, not on what happened. KEC SHIELD forces the record while the facts are still hot:

- Category-aware documentation checklists
- Risk tags (CRITICAL / HIGH / MEDIUM)
- Evidence attach with a 4MB local cap
- Readiness score across the packet
- One-click TWC text report + JSON backup/restore
- PWA icon so it lives on a phone home screen

## Stack

- React 18 + Vite 6
- Tailwind CSS 3
- lucide-react
- Canvas particle field (real animation loop, not CSS fluff)
- localStorage persistence

## Quick start

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

Open `dist/` on any static host. `vite.config.js` uses `base: './'` so GitHub Pages project sites and USB drops both work.

## GitHub Pages

A workflow in `.github/workflows/pages.yml` builds and publishes `dist/` to Pages on every push to `main`.

Repo Settings → Pages → Source: **GitHub Actions**.

## Home screen icon

Custom shield icon lives in `public/icons/`:

| File | Use |
| --- | --- |
| `favicon.svg` | Browser tab |
| `favicon-32.png` | Fallback favicon |
| `apple-touch-icon.png` | iOS home screen |
| `icon-192.png` / `icon-512.png` | PWA / Android |
| `icon-1024.png` | Source / store listing |

`public/manifest.json` is already wired. On mobile Safari/Chrome: Share → Add to Home Screen.

PNG icons ship in the release zip. SVG favicon is in the repo.

## Data model

Incidents persist under `kec_incidents`. Crews under `kec_crews`.

Backup JSON shape:

```json
{
  "version": 1,
  "exportedAt": "ISO-8601",
  "crews": ["Crew A"],
  "incidents": []
}
```

Evidence is stored as data URLs. Do not treat the browser as a records vault — export regularly.

## Project layout

```
kec-shield/
├── public/icons/
├── src/
│   ├── App.jsx
│   ├── components/
│   ├── data/categories.js
│   └── lib/
├── index.html
├── package.json
└── vite.config.js
```

## Security notes

- No backend. No auth. Anyone with the browser profile can read local records.
- Do not log medical details, SSNs, or bank data.
- Evidence files sit in localStorage. Large photos will fail the 4MB guard on purpose.

## License

MIT. Built for field ops, reused as a portfolio system piece.
