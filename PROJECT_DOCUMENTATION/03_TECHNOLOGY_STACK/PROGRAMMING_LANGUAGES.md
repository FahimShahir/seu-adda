---
title: "Programming Languages Breakdown"
document_id: "DOC-TECH-002"
category: "Technology Stack"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "tsconfig.json"
  - "api/config.php"
dependencies:
  - "DOC-TECH-001"
---

# Programming Languages Breakdown

## 1. TypeScript (`~5.7.2`)
- **Role**: Primary language for the entire client application (`src/**/*.ts`, `src/**/*.tsx`).
- **Configuration**:
  - `target: "ES2020"`
  - `module: "ESNext"`
  - `moduleResolution: "Bundler"`
  - `strict: true` (full type safety, strict null checks, no implicit any)
  - `jsx: "react-jsx"` (React 19 modern JSX transform)

## 2. PHP (`8.x`)
- **Role**: Backend API endpoints (`api/*.php`, `public/api/*.php`).
- **Pattern**: Procedural REST controllers utilizing PDO (PHP Data Objects).
- **Core Standard**: Strict UTC timezone (`date_default_timezone_set('UTC')`), native JSON handling via `json_encode()` and `json_decode()`, and prepared SQL statements.

## 3. SQL (MySQL 8 Dialect & SQLite 3 Dialect)
- **Role**: Relational schema definitions (`api/schema.sql`) and dynamic queries.
- **Features**: `utf8mb4` full Bengali & emoji support, `InnoDB` engine, foreign keys with `ON DELETE CASCADE`, composite indexes.

## 4. HTML5 & CSS3
- **Role**: Single-page container (`index.html`), custom font importing (Hind Siliguri), and Canvas rendering.

