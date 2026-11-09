---
title: "Deployment Guide & Monsta FTP Workflow"
document_id: "DOC-OPS-005"
category: "Infrastructure & Deployment"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "public/.htaccess"
dependencies:
  - "DOC-OPS-004"
---

# Deployment Guide & Monsta FTP Workflow

## 1. InfinityFree File Structure Invariant

When extracted into InfinityFree's `htdocs/`, the directory must strictly mirror this layout:

```text
htdocs/
├── .htaccess
├── index.html
├── assets/
│   ├── index-*.js
│   └── index-*.css
├── images/
│   ├── campus-day.jpg
│   ├── campus-night.jpg
│   └── developer.jpg
└── api/
    ├── config.php
    ├── db.php
    ├── rooms.php
    ├── messages.php
    ├── confessions.php
    ├── stats.php
    └── schema.sql
```

> [!WARNING]
> Never extract into a subfolder like `htdocs/dist/` or `htdocs/infinityfree_package/`. All files must reside directly in the root of `htdocs/`.

