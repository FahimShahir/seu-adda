---
title: "Runtime Versions & Environment Matrix"
document_id: "DOC-TECH-004"
category: "Technology Stack"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "package.json"
  - ".github/workflows/deploy.yml"
dependencies:
  - "DOC-TECH-003"
---

# Runtime Versions & Environment Matrix

## 1. Build & CI/CD Runtime
- **Node.js Environment**: GitHub Actions runner specifies Node `20` (runs seamlessly on modern Node 20 and 22).
- **Vite Bundler Engine**: Rollup-based production chunking with ES2020 target and gzip compression analysis.
- **TypeScript Compiler**: `tsc` executes in strict mode prior to Vite bundling (`npm run build`).

## 2. Server-Side Execution Environment
- **PHP Version**: Compatible with PHP 8.0, 8.1, 8.2, and 8.3.
- **Required PHP Extensions**:
  - `pdo` (Core database abstraction)
  - `pdo_mysql` (Remote MySQL on InfinityFree)
  - `pdo_sqlite` (Local testing fallback)
  - `json` (REST payload handling)
- **Apache Web Server**:
  - Requires `mod_rewrite` enabled for `.htaccess` URL routing.
  - Requires `mod_headers` for CORS headers.

