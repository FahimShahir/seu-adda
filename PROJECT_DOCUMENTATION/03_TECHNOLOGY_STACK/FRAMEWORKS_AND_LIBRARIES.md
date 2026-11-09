---
title: "Frameworks, Libraries & Runtime Versions"
document_id: "DOC-TECH-003"
category: "Technology Stack"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "package.json"
dependencies:
  - "DOC-TECH-001"
---

# Frameworks, Libraries & Runtime Versions

## 1. Runtime Environment Compatibility

| Component | Minimum Supported Version | Recommended Production Version | Verification Command |
|---|---|---|---|
| **Node.js** | `v20.0.0` | `v22.x LTS` | `node -v` |
| **npm** | `v9.0.0` | `v10.x` | `npm -v` |
| **PHP** | `v8.0.0` | `v8.2+` (with `pdo_mysql`, `pdo_sqlite`) | `php -v` |
| **MySQL** | `v8.0` | `v8.0.35+` (InnoDB, utf8mb4) | `SELECT VERSION();` |
| **SQLite** | `v3.30+` | `v3.40+` | `sqlite3 --version` |

---

## 2. Dependency Tree & Package Roles

```mermaid
graph LR
    Prod["Production Dependencies"]
    Prod --> React["react @ 19.0.0"]
    Prod --> ReactDom["react-dom @ 19.0.0"]
    Prod --> MQTT["mqtt @ 5.16.1"]
    Prod --> Lucide["lucide-react @ 1.16.0"]
    Prod --> Confetti["canvas-confetti @ 1.9.4"]
    Prod --> Clsx["clsx @ 2.1.1"]
    Prod --> TWMerge["tailwind-merge @ 3.0.2"]

    Dev["Development Tooling"]
    Dev --> Vite["vite @ 6.2.0"]
    Dev --> TS["typescript @ ~5.7.2"]
    Dev --> Tailwind["tailwindcss @ 3.4.17"]
    Dev --> Autoprefixer["autoprefixer @ 10.4.20"]
    Dev --> PostCSS["postcss @ 8.5.3"]
    Dev --> GHPages["gh-pages @ 6.3.0"]
```

---

## 3. Browser Compatibility Matrix

| Browser | Minimum Version | Desktop Status | Mobile Status | Key Supported Features |
|---|---|---|---|---|
| **Google Chrome / Chromium** | `90+` | 🟢 Verified | 🟢 Verified | WebSocket, Touch Events, Canvas, Web Audio |
| **Mozilla Firefox** | `88+` | 🟢 Verified | 🟢 Verified | Full CSS Grid, Flexbox, AudioContext |
| **Apple Safari** | `14+` | 🟢 Verified | 🟢 Verified | Touch drag, YouTube IFrame, Bengali rendering |
| **Microsoft Edge** | `90+` | 🟢 Verified | 🟢 Verified | Chromium parity |
| **Samsung Internet** | `15+` | N/A | 🟢 Verified | Mobile drag-scroll, speech bubbles |

