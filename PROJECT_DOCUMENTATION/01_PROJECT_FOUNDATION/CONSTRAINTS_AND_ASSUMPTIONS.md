---
title: "Technical Constraints & Architectural Assumptions"
document_id: "DOC-FND-007"
category: "Project Foundation"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/config.php"
  - "src/hooks/useAddaRoom.ts"
dependencies:
  - "DOC-FND-003"
---

# Technical Constraints & Architectural Assumptions

## 1. Free-Tier Hosting Constraints

1. **InfinityFree PHP & MySQL Limitations**:
   - **No Node.js / Python daemon process support**: Backend scripts run strictly on traditional Apache PHP-CGI requests. Persistent background daemons or long-lived server processes cannot run.
   - **Connection Timeouts & Execution Limits**: PHP script max execution time is capped at 30 seconds.
   - **No Native WebSocket Support**: True persistent bidirectional WebSockets are impossible on InfinityFree. Real-time communication must rely on high-frequency HTTP polling (`1.6s` for chat, `2s` for room state).
   - **Daily Hit & IOPS Limits**: To prevent hitting account CPU/IOPS limits, polling is paused when the user is outside an active room.
2. **GitHub Pages Static Nature**:
   - GitHub Pages serves static files only and cannot execute server-side code. Real-time pub/sub must rely on external public cloud brokers (EMQX).

---

## 2. YouTube IFrame API Constraints

1. **Mobile Autoplay Restrictions**:
   - Modern mobile operating systems (iOS Safari, Android Chrome) block programmatic audio playback without a direct user gesture (touch/click). The UI provides an explicit *"গান শুনুন 🎶"* (Play Music) button to initialize the audio context.
2. **IFrame Sandbox Constraints**:
   - YouTube embeds can generate origin mismatch notices when communicating over postMessage in certain browser configurations. The app isolates these notices cleanly.

---

## 3. Assumptions

- **Clock Synchronization**: User devices and the server are assumed to have reasonably synchronized clocks (within a few minutes of UTC). Universal UTC timestamps (`gmdate()`, `Date.now()`) are used to minimize drift.
- **Modern Browser Support**: Users access the platform using modern evergreen web browsers (Chrome, Firefox, Safari, Edge) that support HTML5 Canvas, Web Audio API, and modern ECMAScript.

