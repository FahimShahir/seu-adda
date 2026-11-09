---
title: "Error Handling & Resilience Architecture"
document_id: "DOC-BE-009"
category: "Backend System"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/db.php"
  - "api/messages.php"
dependencies:
  - "DOC-BE-008"
---

# Error Handling & Resilience Architecture

## 1. Fail-Safe Database Recovery Flow

```mermaid
flowchart TD
    Connect["Connect to MySQL: sql104.infinityfree.com"] --> TestConn{"Connection Successful?"}
    TestConn -->|"Yes"| UseMySQL["Active Driver: pdo_mysql"]
    TestConn -->|"No (Timeout/Error)"| CatchPDO["Catch PDOException"]
    CatchPDO --> FallbackSQLite["Open local file: seu_adda_local.db"]
    FallbackSQLite --> InitTables["initSqliteTables(): Verify table existence"]
    InitTables --> UseSQLite["Active Driver: pdo_sqlite"]
    UseMySQL --> ReturnPDO["Return valid PDO connection"]
    UseSQLite --> ReturnPDO
```

## 2. Auto-Healing Architecture
If a user is inside a room on their client, but the server table lost the room record due to clock anomalies, sending a chat message triggers an immediate auto-healing query in `messages.php`. This guarantees the message is saved and subsequent polling succeeds without 404 drops.

