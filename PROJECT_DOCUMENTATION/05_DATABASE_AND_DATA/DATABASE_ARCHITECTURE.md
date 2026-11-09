---
title: "Database Architecture & Storage Strategy"
document_id: "DOC-DATA-001"
category: "Database & Data Architecture"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/db.php"
  - "api/config.php"
  - "api/schema.sql"
dependencies:
  - "DOC-ARCH-001"
---

# Database Architecture & Storage Strategy

## 1. Dual-Engine Storage Architecture

The database system is engineered to handle both cloud hosting on InfinityFree and offline local testing through a **PDO Dynamic Driver Factory**:

```mermaid
flowchart TD
    Request["Incoming API Request"] --> GetConn["getDbConnection() in api/db.php"]
    GetConn --> TryMySQL["1. Try Connecting to MySQL (sql104.infinityfree.com)"]
    TryMySQL -->|"Success"| ConfigMySQL["Set UTF8MB4 & Force UTC: SET time_zone = '+00:00'"]
    ConfigMySQL --> PurgeMySQL["Run purgeExpiredRooms($pdo) via MySQL NOW()"]
    PurgeMySQL --> ReturnPDO["Return Connected PDO Instance"]

    TryMySQL -->|"PDOException (Timeout / Unreachable)"| FallbackSQLite["2. Catch Exception & Connect to Local SQLite (seu_adda_local.db)"]
    FallbackSQLite --> InitSQLite["Run initSqliteTables($pdo) & PRAGMA foreign_keys = ON"]
    InitSQLite --> PurgeSQLite["Run purgeExpiredRooms($pdo) via SQLite datetime('now')"]
    PurgeSQLite --> ReturnPDO
```

---

## 2. Character Set & Collation Standard

- **Engine**: `InnoDB`
- **Charset**: `utf8mb4`
- **Collation**: `utf8mb4_unicode_ci`
- **Significance**: Complete support for Bengali characters (যুক্তাক্ষর, হসন্ত, চন্দ্রবিন্দু) and emoji characters (☕, 🎸, 💔, 📚, 🔥, 🤣, 🎉) across room names, user names, confessions, and chat text without character corruption or truncation.

---

## 3. Universal UTC Timezone Harmonization

To prevent timezone mismatches between shared PHP servers (which may run in Europe or US timezones) and Bangladeshi client browsers (UTC+6):
1. **PHP Timezone**: `date_default_timezone_set('UTC')` executes on script boot in `api/config.php`.
2. **MySQL Timezone**: `$pdo->exec("SET time_zone = '+00:00'")` executes immediately after establishing every database connection in `api/db.php`.
3. **UTC Queries**: All timestamp comparisons evaluate against UTC (`expires_at <= NOW()` or `expires_at <= gmdate('Y-m-d H:i:s')`).

