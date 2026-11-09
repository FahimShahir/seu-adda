---
title: "Caching, Failure Handling & Reliability"
document_id: "DOC-PERF-002"
category: "Performance & Reliability"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "public/.htaccess"
  - "api/db.php"
dependencies:
  - "DOC-PERF-001"
---

# Caching, Failure Handling & Reliability

## 1. Browser & CDN Caching Strategy
- **Immutable Assets (`/assets/index-*.js`, `.css`)**: Vite attaches content hashes to all asset filenames. `.htaccess` and GitHub Pages serve these with long-lived `Cache-Control: max-age=31536000, immutable` headers.
- **Entry Document (`index.html`)**: Served with `Cache-Control: no-cache` to ensure browser always fetches the latest asset hashes.

## 2. High Availability & Failure Recovery
1. **Remote MySQL Unreachable**: Seamlessly degrades to local SQLite 3 database (`seu_adda_local.db`).
2. **EMQX MQTT Network Drop**: Client automatically initiates exponential backoff reconnection (`reconnectPeriod: 2500`).
3. **Premature Room Deletion**: Incoming chat messages auto-heal missing room records with a fresh 2-hour TTL.

