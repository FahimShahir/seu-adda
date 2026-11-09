---
title: "Business Logic & Campus Rules Engine"
document_id: "DOC-BIZ-001"
category: "Business Logic & Product Rules"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/types/room.ts"
  - "src/hooks/useAddaRoom.ts"
dependencies:
  - "DOC-ARCH-001"
---

# Business Logic & Campus Rules Engine

## 1. Core Inviolable Business Rules

1. **Rule 1: Fixed 2-Hour Room Lifespan**:
   - Every Adda room expires exactly 7,200 seconds after creation. No user can extend a room indefinitely.
2. **Rule 2: Avatar Exclusivity (1-to-1 Mapping)**:
   - Within any active room, no two members can share the same avatar. If a guest attempts to select an occupied avatar, the system locks the UI with `🔒 [Owner Name]` and server-side logic automatically reassigns them to a free avatar.
3. **Rule 3: Ephemeral Chat Retention**:
   - Chat messages exist only as long as the room is active. Upon room expiration, all messages and participant logs are expunged from the database.
4. **Rule 4: Synchronized Group Audio**:
   - In private rooms, the song played by the host or queued by any participant automatically takes precedence and syncs to all connected peers in that room.
5. **Rule 5: Voluntary Alumni Coffee Support**:
   - The platform is free for all users. Support for developer **Fahim Shahir** is entirely voluntary via bKash Personal micro-treats (`01969091751`).

