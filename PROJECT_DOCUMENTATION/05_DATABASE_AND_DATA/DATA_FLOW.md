---
title: "Database Data Flow, Validation & Retention Policy"
document_id: "DOC-DATA-006"
category: "Database & Data Architecture"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/db.php"
  - "api/rooms.php"
  - "api/messages.php"
dependencies:
  - "DOC-DATA-004"
---

# Database Data Flow, Validation & Retention Policy

## 1. Incremental Cursor Polling (`messages`)

To minimize database bandwidth on shared hosting:
- Client stores `lastMsgDbIdRef.current` (initialized to 0 upon entering a room).
- Client calls `GET ./api/messages.php?action=poll&room_id=SEU-TYXJ&after_id=45`.
- Server executes `SELECT ... WHERE room_id = :room_id AND id > 45 ORDER BY id ASC LIMIT 50`.
- Only *new* messages inserted since `after_id` are returned. If no new messages exist, an empty array is returned.

---

## 2. Server-Side Data Validation Rules

- **Room Code**: Trimmed, stripped of non-alphanumeric symbols, converted to uppercase (e.g., `seu-tyxj` -> `SEU-TYXJ`).
- **Participant Display Name**: Sanitized with `trim()` and defaulted to *"ক্যাম্পাস আড্ডাবাজ"* if empty. Maximum length constrained.
- **Character Avatar Verification**: When joining (`action=join`), if the requested avatar is already present in `participants` for that `room_id`, the server automatically loops through available characters and assigns the first unoccupied avatar.
- **Chat Text**: Enforced non-empty string. HTML special characters are safely escaped upon client rendering.

---

## 3. Data Retention & Automatic Expiration Policy

- **2-Hour Ephemeral Lifespan**: Rooms self-destruct exactly 120 minutes (7,200 seconds) after creation.
- **Connection Purge (`purgeExpiredRooms`)**:
  ```sql
  DELETE FROM rooms WHERE expires_at <= NOW();
  DELETE FROM participants WHERE last_seen <= DATE_SUB(NOW(), INTERVAL 300 SECOND);
  ```
  Every incoming API request triggers an execution of this query, ensuring the database self-cleans without requiring external cron jobs.
- **Permanent Anonymity**: Because expired rooms and messages are physically deleted (`DELETE FROM`), historical chat logs cannot be recovered, safeguarding student privacy.

