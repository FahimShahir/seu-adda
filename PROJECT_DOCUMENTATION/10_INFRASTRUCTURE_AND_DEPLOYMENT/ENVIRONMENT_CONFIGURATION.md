---
title: "Environment Variables & Configuration Reference"
document_id: "DOC-OPS-002"
category: "Infrastructure & Deployment"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/config.php"
dependencies:
  - "DOC-OPS-001"
---

# Environment Variables & Configuration Reference

## 1. Backend Environment Variables (`api/config.php`)

| Variable Name | Default Value | Description |
|---|---|---|
| `DB_HOST` | `sql104.infinityfree.com` | Hostname of the InfinityFree MySQL database server. |
| `DB_NAME` | `if0_43397321_seu_adda` | Database schema name. |
| `DB_USER` | `if0_43397321` | Database authentication username. |
| `DB_PASS` | Configured secret | Database authentication password. |
| `DB_PORT` | `3306` | MySQL port. |

## 2. Frontend Build Configuration
- `base: './'` in `vite.config.ts`: Guarantees relative asset URLs, enabling execution on both subpaths (`/seu-adda/`) and domain roots (`/`).

