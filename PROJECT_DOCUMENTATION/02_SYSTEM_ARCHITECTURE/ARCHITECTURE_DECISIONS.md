---
title: "Architecture Decision Records (ADRs)"
document_id: "DOC-ARCH-002"
category: "System Architecture"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/hooks/useAddaRoom.ts"
  - "api/db.php"
dependencies:
  - "DOC-ARCH-001"
---

# Architecture Decision Records (ADRs)

## ADR-001: Adoption of Dual-Deployment Architecture
- **Context**: The project was initially targeted at GitHub Pages for zero cost, but users also required hosting on a custom PHP domain (`seuadda.free.nf`) with persistent database storage.
- **Decision**: Build an adaptive runtime detection layer (`isPhpBackend = Boolean(window.location.hostname.includes('seuadda.free.nf') || window.location.hostname === 'localhost')`).
- **Consequences**: Enables 100% code sharing in the React frontend; automatically routes real-time communications to EMQX MQTT on GitHub Pages and to PHP/MySQL API on InfinityFree.

## ADR-002: Headless YouTube IFrame API for Audio Streaming
- **Context**: Hosting gigabytes of high-quality MP3 audio files on free static hosting incurs severe bandwidth and copyright risks.
- **Decision**: Embed an invisible YouTube IFrame (`w-1 h-1 opacity-0 pointer-events-none`) and control playback exclusively through the JavaScript `YT.Player` API.
- **Consequences**: Zero audio file hosting costs, infinite catalog of campus songs, legal compliance with YouTube content delivery.

## ADR-003: Auto-Healing Database Room Persistence
- **Context**: On shared free PHP hosting, server timezones and client clocks can drift, triggering early room deletion in `purgeExpiredRooms`. If a room record disappeared, subsequent chat messages failed with 404.
- **Decision**: In `messages.php`, if a message arrives for a non-existent room ID, the endpoint automatically executes an `INSERT IGNORE` with a fresh 2-hour UTC expiration window.
- **Consequences**: Zero message drop, self-recovering rooms, total chat resilience across intermittent database cleanups.

## ADR-004: Strict 1-to-1 Character Assignment & Locking
- **Context**: When multiple users joined a room simultaneously, they could pick the same avatar (e.g., both choosing the guitarist), resulting in confusing duplicate characters on screen.
- **Decision**: Implement live taken-character querying in `PrivateRoomModal.tsx`, locking taken avatars with `🔒 [User Name]` badges and disabling selection. Add server-side auto-reassignment fallback in `rooms.php`.
- **Consequences**: 100% avatar uniqueness in every private room; complete visual clarity in speech bubble attribution.

