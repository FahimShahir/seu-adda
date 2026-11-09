---
title: "Audit Logging, Rate Limiting & Abuse Prevention"
document_id: "DOC-SEC-006"
category: "Security & Privacy"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/messages.php"
  - "api/confessions.php"
dependencies:
  - "DOC-SEC-001"
---

# Audit Logging, Rate Limiting & Abuse Prevention

## 1. Audit Logging Standards

- **Error Logs**: Runtime exceptions in PHP log to server `error_log` cleanly without exposing stack traces to the public API response.
- **Message Timestamping**: Every message receives an exact UTC creation timestamp (`created_at`) from MySQL `CURRENT_TIMESTAMP`.

## 2. Abuse Prevention Safeguards

- **Query Result Capping**: All polling and listing endpoints enforce strict database limits:
  - `messages.php`: `LIMIT 50`
  - `confessions.php`: `LIMIT 50`
- **Client-Side Debouncing**: Join code input queries in `PrivateRoomModal.tsx` debounce with a 350ms timer to prevent flooding the server while typing.

