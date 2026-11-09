---
title: "Backend Routes & Endpoint Catalog"
document_id: "DOC-BE-002"
category: "Backend System"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/rooms.php"
  - "api/messages.php"
  - "api/confessions.php"
  - "api/stats.php"
dependencies:
  - "DOC-BE-001"
---

# Backend Routes & Endpoint Catalog

| Endpoint | Method | Query / Action | Purpose | Auth Required |
|---|---|---|---|---|
| `/api/rooms.php` | `GET` | `action=test` | Healthcheck returning `{ status: 'ok', php: true }` | None |
| `/api/rooms.php` | `POST` | `action=create` | Create a new 2-hour private room session | Tab UID |
| `/api/rooms.php` | `GET` / `POST` | `action=get` | Get room state, participants, and taken avatar map | None |
| `/api/rooms.php` | `POST` | `action=join` | Join room with character check & auto-reassignment | Tab UID |
| `/api/rooms.php` | `POST` | `action=transfer` | Switch character avatar within the room | Tab UID |
| `/api/rooms.php` | `POST` | `action=leave` | Leave the room gracefully | Tab UID |
| `/api/rooms.php` | `POST` | `action=song` | Queue / change synchronized room song | Participant |
| `/api/rooms.php` | `POST` | `action=heartbeat` | Update member `last_seen` timestamp | Participant |
| `/api/messages.php`| `POST` | `action=send` | Send chat message with room auto-healing | Tab UID |
| `/api/messages.php`| `GET` | `action=poll` | Fetch new chat messages since `after_id` | Participant |
| `/api/confessions.php`| `GET` | `action=list` | Fetch latest 50 campus confessions | None |
| `/api/confessions.php`| `POST` | `action=create` | Submit a new campus confession | None |
| `/api/confessions.php`| `POST` | `action=like` | Increment like count on a confession | None |
| `/api/stats.php` | `GET` | `action=get` | Fetch cheers counter and mood distributions | None |
| `/api/stats.php` | `POST` | `action=cheers` | Increment global campus tea cheers counter | None |
| `/api/stats.php` | `POST` | `action=mood` | Increment click count for a campus mood | None |

