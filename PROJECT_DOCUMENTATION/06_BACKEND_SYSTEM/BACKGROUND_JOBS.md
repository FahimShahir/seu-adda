---
title: "Background Jobs, Error Handling & Validation Rules"
document_id: "DOC-BE-008"
category: "Backend System"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/db.php"
  - "api/messages.php"
dependencies:
  - "DOC-BE-007"
---

# Background Jobs, Error Handling & Validation Rules

## 1. On-Demand Background Garbage Collection

Because traditional server cron jobs are disabled or restricted on free hosting tiers, background maintenance runs on an **Opportunistic Interleaved Pattern**:
- Every time any client requests a room or sends a message, `getDbConnection()` executes `purgeExpiredRooms($pdo)`.
- This ensures expired rooms are removed continuously without incurring cron configuration overhead.

## 2. Structured Exception Isolation

All database interactions wrap in `try/catch (PDOException $e)` blocks. If a non-fatal failure occurs (e.g. background purge error), it is caught silently to prevent blocking the primary user request. Fatal connection errors trigger the SQLite fallback seamlessly.

