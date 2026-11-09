---
title: "Scope Boundaries & Requirements Baseline"
document_id: "DOC-FND-003"
category: "Project Foundation"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/App.tsx"
  - "src/types/room.ts"
dependencies:
  - "DOC-FND-002"
---

# Scope Boundaries & Requirements Baseline

## 1. In-Scope Features & Systems

- **Campus Hotspot Mapping**: 18 interactive character avatars and one central tea stall mama across 3 depth zones.
- **Dynamic Bengali Dialogue Engine**: Mood-filtered dialogues (`adda`, `heartbreak`, `exams`, `canteen`) with dynamic avatar attribution.
- **Headless Audio Radio & Synchronized Playback**: YouTube IFrame radio player with playlists, play/pause, volume control, track skipping, and room song broadcasting.
- **Ambient Weather & Lighting**: Day/night mode toggle, Canvas rain simulation, procedural rain audio, and acoustic guitar strum audio effects.
- **Ephemeral Private Adda Rooms**: 2-hour TTL room creation, room join via short code or URL query parameter (`?room=ID`), live taken character locking, and 30-second speech bubbles.
- **Campus Memory Wall & Stats**: Anonymous confession creation, like counter, and global campus cheering counter.
- **Developer Portfolio & Alumni Coffee Treat**: Developer modal featuring Fahim Shahir and bKash copy integration (`01969091751`).

---

## 2. Explicit Out-of-Scope Boundaries

- **No User Account System**: No user passwords, authentication tokens, JWTs, or email verification.
- **No Permanent File/Image Hosting**: No user-uploaded image hosting on the server (canvas-generated photo cards are downloaded client-side).
- **No Video Streaming**: The platform streams audio only; video rendering is intentionally headless to maintain low bandwidth and respect user privacy.
- **No Permanent Room Archival**: Adda rooms are strictly ephemeral (2 hours lifespan); upon expiration, room records and messages are deleted from the database.

