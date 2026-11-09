---
title: "Critical Implementation Rules & Non-Negotiable Invariants"
document_id: "DOC-AGT-002"
category: "AI Agent Knowledge"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/hooks/useAddaRoom.ts"
  - "api/db.php"
dependencies:
  - "DOC-AGT-001"
---

# Critical Implementation Rules & Non-Negotiable Invariants

| Invariant Rule | Rationale | Code Location | What Happens If Violated |
|---|---|---|---|
| **Universal UTC Timezone** | Prevents host/client clock drift from prematurely purging rooms. | `api/config.php`, `api/db.php` | Rooms self-destruct immediately on creation; chat drops with 404! |
| **Strict 1-to-1 Character Lock** | Visual clarity; speech bubbles must correspond to unique characters. | `PrivateRoomModal.tsx`, `CampusScene.tsx`, `rooms.php` | Multiple users take same character; bubbles overlap and glitch. |
| **5-Minute Inactivity Threshold** | Mobile users lock screens or switch tabs briefly without wanting to be kicked. | `api/db.php`, `api/rooms.php` | Legitimate mobile participants get kicked from room after 30s. |
| **POSIX Slash Zip Archives** | Linux-based Monsta FTP cannot extract Windows `\` backslashes. | `package_infinityfree.py` / root packaging | Extraction breaks; files fail to load on `seuadda.free.nf`. |
| **Zero SQLite in Production Zip** | Production InfinityFree must use remote MySQL database. | Packaging scripts | SQLite database overrides or causes permission errors. |
| **Auto-Healing Room Recovery** | Ensures zero dropped chat messages if a room row is lost. | `api/messages.php` | Chat messages fail silently or throw 404 errors. |

