---
title: "Project Architectural Changelog & History"
document_id: "DOC-ROOT-006"
category: "Root Documentation"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "git log"
dependencies:
  - "DOC-ROOT-001"
---

# Project Architectural Changelog & History

This changelog records major technical decisions, architectural evolutions, bug fixes, and milestones of the SEU Adda project.

---

### [Unreleased / Production-Ready] — 2026-11-10
#### Fixed
- **InfinityFree Real-Time Chat Failure**:
  - Root Cause: Host timezone discrepancies caused early room record deletion via `purgeExpiredRooms`. `messages.php` subsequently failed with `404 Room not found`.
  - Fix: Implemented auto-healing room recreation in `messages.php` upon incoming message receipt, ensuring zero message drops.
- **Duplicate Character Collision in Rooms**:
  - Root Cause: Guest join modal lacked live awareness of taken characters across network devices.
  - Fix: Added live polling of taken characters in `PrivateRoomModal.tsx`, locking taken avatars with `🔒 [Name]` badges and disabling selection. Implemented automatic reassignment in `rooms.php` (`wasReassigned = true`) and strict client deduplication in `useAddaRoom.ts`.
- **False Inactivity Kickouts**:
  - Increased participant inactivity threshold from 30 seconds to 300 seconds (5 minutes) in `db.php` and `rooms.php`, preventing false drops during mobile screen lock.
- **Music Sync Latency**:
  - Eliminated artificial 1.2-second setTimeout delay in `useYouTubePlayer.ts` and enabled immediate video ID broadcast on player state 3 (Buffering).
- **POSIX Zip Extraction Bug**:
  - Replaced Windows-style backslashes in `seu_adda_infinityfree.zip` with POSIX forward slashes (`/`), resolving directory extraction failures on Linux-based InfinityFree Monsta FTP.

---

### [v1.0.0] — Initial Dual-Deployment Release
#### Added
- Full React 19 + TypeScript + Vite SPA on GitHub Pages.
- Interactive Campus Scene with 18 clickable character hotspots and dynamic Bengali speech bubbles.
- 4 dialogue mood states (`adda`, `heartbreak`, `exams`, `canteen`).
- Headless YouTube background radio player with curated campus playlists.
- 2-hour ephemeral private Adda rooms with QR/ID sharing.
- EMQX MQTT WebSocket cloud integration for real-time pub/sub.
- PHP 8.x + MySQL 8.x backend with local SQLite 3 automatic fallback for InfinityFree hosting.
- Campus confession wall with atomic like counters.
- Developer profile card for Fahim Shahir with integrated bKash alumni support fund.

