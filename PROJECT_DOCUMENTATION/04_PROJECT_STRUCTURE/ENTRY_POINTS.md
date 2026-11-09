---
title: "Application Entry Points & Execution Paths"
document_id: "DOC-STR-004"
category: "Project Structure"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "index.html"
  - "src/main.tsx"
  - "api/rooms.php"
dependencies:
  - "DOC-STR-003"
---

# Application Entry Points & Execution Paths

| Entry Point | Protocol | Target Environment | Initializing Function / Handler |
|---|---|---|---|
| `index.html` | HTTP / HTTPS | Client Browser | Browser loads HTML DOM, fonts, and references `/src/main.tsx` |
| `src/main.tsx` | ECMAScript | React Virtual DOM | `createRoot(document.getElementById('root')!).render(<App />)` |
| `api/rooms.php` | HTTP GET / POST | InfinityFree Apache | `switch ($action) { case 'create': ... case 'join': ... }` |
| `api/messages.php` | HTTP GET / POST | InfinityFree Apache | `switch ($action) { case 'poll': ... case 'send': ... }` |
| `api/confessions.php` | HTTP GET / POST | InfinityFree Apache | `switch ($action) { case 'list': ... case 'create': ... }` |
| `api/stats.php` | HTTP GET / POST | InfinityFree Apache | `switch ($action) { case 'get': ... case 'cheers': ... }` |
| `.github/workflows/deploy.yml` | Git Push Trigger | GitHub Actions | Ubuntu runner runs `npm ci && npm run build && actions/deploy-pages` |

