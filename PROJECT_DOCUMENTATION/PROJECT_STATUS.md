---
title: "Project Status & Live Deployment Telemetry"
document_id: "DOC-ROOT-002"
category: "Root Documentation"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "package.json"
  - ".github/workflows/deploy.yml"
  - "api/config.php"
dependencies:
  - "DOC-ROOT-001"
---

# Project Status & Live Deployment Telemetry

## 1. Production Health & Deployment Status

| Deployment Target | Primary URL | Architecture Mode | Operational Status | Last Deployment Date |
|---|---|---|---|---|
| **GitHub Pages** | [https://fahimshahir.github.io/seu-adda/](https://fahimshahir.github.io/seu-adda/) | Static SPA + EMQX MQTT Cloud | 🟢 **Healthy & Live** | 2026-11-10 |
| **InfinityFree** | [https://seuadda.free.nf/](https://seuadda.free.nf/) | Full-Stack PHP 8.x + MySQL 8.x | 🟢 **Healthy & Live** | 2026-11-10 |
| **Local Dev Server** | `http://localhost:5173/` | Vite ESM Dev Server | 🟢 **Ready** | On Demand |
| **Local PHP Server** | `http://localhost:8080/` | PHP 8.x Built-in + SQLite Fallback | 🟢 **Ready** | On Demand |

---

## 2. Live Feature Verification Matrix

| Feature | GitHub Pages Mode | InfinityFree Mode | Verification Evidence |
|---|---|---|---|
| **Interactive Campus Artwork** | ✅ Operational | ✅ Operational | 18 non-overlapping hotspots responsive across all screen widths. |
| **Bengali Campus Dialogues** | ✅ Operational | ✅ Operational | 4 dynamic mood states with audio chords & visual speech bubbles. |
| **Headless YouTube Radio** | ✅ Operational | ✅ Operational | Zero-delay audio playback with background buffering broadcast. |
| **Private Room Creation** | ✅ Operational | ✅ Operational | 2-hour ephemeral room ID generation with clipboard sharing. |
| **Strict 1-to-1 Character Lock** | ✅ Operational | ✅ Operational | Occupied characters locked with `🔒 [Name]` badges; duplicates prevented. |
| **Synchronized Room Music** | ✅ Operational (MQTT) | ✅ Operational (MySQL) | Room host/member song change syncs to all devices within 1.5s. |
| **Cross-Device Room Chat** | ✅ Operational (EMQX) | ✅ Operational (PHP/DB) | Chat messages trigger real-time 30-second speech bubbles over avatars. |
| **Auto-Healing Room Recovery** | N/A (Broker-based) | ✅ Operational | If room record is deleted, chat endpoint auto-restores with 2h TTL. |
| **Campus Confession Wall** | ✅ Operational (MQTT/Local) | ✅ Operational (MySQL) | Add confessions and real-time atomic like increments. |
| **Campus Cheers Counter** | ✅ Operational (Local/Sync) | ✅ Operational (MySQL) | Atomic counter update on `campus_stats` table. |
| **Alumni Corner & bKash Support** | ✅ Operational | ✅ Operational | bKash copy action with interactive toast feedback and developer card. |

---

## 3. Deployment Artifacts & Archives

| Artifact Name | Location | Size | Contents & Formatting |
|---|---|---|---|
| **InfinityFree Package** | `d:\seu_adda\seu_adda_infinityfree.zip` | 3.39 MB | Full production bundle (`assets/`, `images/`, `index.html`, `.htaccess`) + PHP API (`api/`) with POSIX `/` forward slashes. Zero SQLite `.db` files bundled. |
| **Full Source Code Backup** | `d:\seu_adda\seu_adda_source_code.zip` | 12.16 MB | Complete project source code excluding `node_modules`, `.git`, `.gemini`. |
| **GitHub Main Commit** | Commit `33df9ae` | Git Tree | Production-ready main branch with automated GitHub Actions CI/CD. |

---

## 4. Current Build Telemetry

```text
> tsc && vite build
✓ 2094 modules transformed.
dist/index.html                   2.12 kB │ gzip:   0.95 kB
dist/assets/index-BDaA3Dsx.css   46.16 kB │ gzip:   8.26 kB
dist/assets/index-bHZs_lpc.js   836.04 kB │ gzip: 241.65 kB
✓ built in 45.38s
```

