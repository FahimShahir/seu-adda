---
title: "Database Indexes, Constraints & Performance Tuning"
document_id: "DOC-DATA-005"
category: "Database & Data Architecture"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/schema.sql"
dependencies:
  - "DOC-DATA-002"
---

# Database Indexes, Constraints & Performance Tuning

## 1. Index Strategy Matrix

| Index Name | Table | Columns | Purpose | Query Optimization |
|---|---|---|---|---|
| `PRIMARY` | `rooms` | `id` | Unique room code lookup | `SELECT * FROM rooms WHERE id = :id` -> `O(1)` |
| `idx_expires` | `rooms` | `expires_at` | Rapid expiration scanning | `DELETE FROM rooms WHERE expires_at <= NOW()` -> `O(log N)` |
| `PRIMARY` | `participants` | `id, room_id` | Member identity in room | Fast heartbeat updating & lookups |
| `idx_part_room`| `participants` | `room_id` | Fetch all members of room | `SELECT * FROM participants WHERE room_id = :id` |
| `idx_part_char`| `participants` | `room_id, character_id` | Unique character check | `SELECT id FROM participants WHERE room_id = :r AND character_id = :c` |
| `PRIMARY` | `messages` | `id` | Auto-increment unique key | Primary row identity |
| `idx_msg_poll` | `messages` | `room_id, id` | **Fast incremental polling** | `SELECT ... WHERE room_id = :r AND id > :after_id` -> Range seek |

---

## 2. Foreign Key Cascade Mechanics

```sql
CONSTRAINT `fk_part_room` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE CASCADE
CONSTRAINT `fk_msg_room` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE CASCADE
```
- **Atomicity**: Deleting a room record atomically expunges every dependent participant and chat record in a single database transaction. No orphan records can linger in `participants` or `messages`.

