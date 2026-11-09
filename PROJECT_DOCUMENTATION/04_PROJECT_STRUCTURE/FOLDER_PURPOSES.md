---
title: "Directory Roles & Architectural Boundaries"
document_id: "DOC-STR-002"
category: "Project Structure"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/"
  - "api/"
dependencies:
  - "DOC-STR-001"
---

# Directory Roles & Architectural Boundaries

| Directory Path | Architectural Responsibility | Allowed File Types | Key Invariant |
|---|---|---|---|
| `src/components/` | Visual presentations and modal views | `.tsx` | Pure presentations; state managed through hooks. |
| `src/hooks/` | Business logic, network synchronization, and Web APIs | `.ts` | Zero direct DOM manipulation outside refs. |
| `src/data/` | Static content (dialogues, playlists) | `.ts` | Pure data exports; immutable structures. |
| `src/types/` | TypeScript interfaces and type aliases | `.ts` | Pure type declarations; no executable code. |
| `api/` | Master PHP backend scripts | `.php`, `.sql` | Procedural controllers; strict UTC timezone. |
| `public/` | Assets copied directly into `dist/` root | `.php`, `.jpg`, `.htaccess` | Clean paths; no SQLite `.db` binaries committed. |
| `PROJECT_DOCUMENTATION/` | Authoritative knowledge base | `.md` | Accurate, verified, machine-readable documentation. |

