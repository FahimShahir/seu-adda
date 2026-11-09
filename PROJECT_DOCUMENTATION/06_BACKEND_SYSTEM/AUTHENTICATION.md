---
title: "Authentication, Authorization & Role Security"
document_id: "DOC-BE-006"
category: "Backend System"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/hooks/useAddaRoom.ts"
  - "api/rooms.php"
dependencies:
  - "DOC-BE-005"
---

# Authentication, Authorization & Role Security

## 1. Role Capabilities Matrix

| Role | Room Destruction | Song Change | Chat & Speech Bubbles | Character Selection |
|---|---|---|---|---|
| **Room Host** | ✅ Allowed (`isHost = true`) | ✅ Allowed | ✅ Allowed | ✅ Exclusive Avatar |
| **Room Participant** | ❌ Blocked | ✅ Allowed (Collaborative) | ✅ Allowed | ✅ Exclusive Avatar |
| **Campus Guest** | N/A | N/A | ❌ (Must join room) | ❌ Preview only |

## 2. Inviolable Role Rules

1. **Host-Only Room Destruction**: A room can only be explicitly destroyed by the original host UID matching `rooms.host_id` or by expiration of the 2-hour TTL.
2. **Avatar Protection**: A user cannot claim an avatar that has an active participant record whose `last_seen` timestamp is fresher than 300 seconds.

