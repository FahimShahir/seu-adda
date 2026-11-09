---
title: "Verified Technology Inventory"
document_id: "DOC-TECH-001"
category: "Technology Stack"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "package.json"
  - "api/config.php"
dependencies:
  - "DOC-ROOT-001"
---

# Verified Technology Inventory

| Layer | Technology | Version | Purpose in SEU Adda | Source Manifest |
|---|---|---|---|---|
| **Frontend Framework** | React | `^19.0.0` | Declarative UI rendering and virtual DOM management | `package.json` |
| **DOM Renderer** | ReactDOM | `^19.0.0` | Browser DOM reconciliation | `package.json` |
| **Type System** | TypeScript | `~5.7.2` | Static type checking and domain model definitions | `package.json`, `tsconfig.json` |
| **Build Tooling** | Vite | `^6.2.0` | Fast ESM development server and production bundler | `package.json`, `vite.config.ts` |
| **CSS Framework** | Tailwind CSS | `^3.4.17` | Utility-first responsive styling and glassmorphism | `package.json`, `tailwind.config.js` |
| **CSS Processor** | PostCSS + Autoprefixer | `^8.5.3` / `^10.4.20` | Vendor prefixing and CSS transformation | `package.json`, `postcss.config.js` |
| **Iconography** | Lucide React | `^1.16.0` | Clean SVG icon components | `package.json` |
| **Visual Effects** | Canvas Confetti | `^1.9.4` | Celebratory confetti particle animations | `package.json` |
| **Real-Time Client** | MQTT.js | `^5.16.1` | Browser WebSocket client for MQTT pub/sub | `package.json` |
| **Server Engine** | PHP | `8.x` | Procedural backend REST API endpoints | `api/*.php` |
| **Database Engine** | MySQL | `8.x` | Primary relational database storage | `api/db.php`, `api/schema.sql` |
| **Fallback DB** | SQLite | `3.x` | Zero-config local development and fallback database | `api/db.php` |
| **Media Engine** | YouTube IFrame API | `v3` | Headless background audio streaming | `src/hooks/useYouTubePlayer.ts` |
| **Deployment** | GitHub Pages & InfinityFree | Production | Dual hosting targets | `.github/workflows/deploy.yml` |

