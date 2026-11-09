---
title: "Server Requirements, Backups & Rollback Procedures"
document_id: "DOC-OPS-007"
category: "Infrastructure & Deployment"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "package.json"
dependencies:
  - "DOC-OPS-006"
---

# Server Requirements, Backups & Rollback Procedures

## 1. Hosting Server Requirements
- **Web Server**: Apache 2.4+ with `mod_rewrite` and `mod_headers`.
- **PHP**: 8.0+ with extensions `pdo`, `pdo_mysql`, `json`, `mbstring`.
- **Database**: MySQL 8.x with `InnoDB` storage engine and `utf8mb4` charset support.

## 2. Backup & Disaster Recovery
- **Source Code Archive**: Persisted in `seu_adda_source_code.zip` (12.16 MB) in repository root. Contains full history.
- **InfinityFree Package**: Persisted in `seu_adda_infinityfree.zip` (3.39 MB).
- **Database Backup**: In phpMyAdmin, export database `if0_43397321_seu_adda` as SQL.

## 3. Rollback Procedures
- **GitHub Pages Rollback**:
  ```bash
  git revert HEAD
  git push origin main
  ```
  GitHub Actions automatically compiles and redeploys the prior commit within 60 seconds.
- **InfinityFree Rollback**: Upload previous known-good `seu_adda_infinityfree.zip` to `htdocs/` and extract.

