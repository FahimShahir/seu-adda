---
title: "Individual File Responsibilities Map"
document_id: "DOC-STR-003"
category: "Project Structure"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/App.tsx"
  - "src/hooks/useAddaRoom.ts"
  - "api/rooms.php"
dependencies:
  - "DOC-STR-002"
---

# Individual File Responsibilities Map

## 1. Frontend Core Files (`src/`)

- **`src/main.tsx`**: Bootstraps the React DOM root into `document.getElementById('root')` using `React.StrictMode`.
- **`src/App.tsx`**: The orchestrator of the entire application. Coordinates modals, audio playback sync, day/night lighting, mood filters, cheers celebrations, and room join events.
- **`src/hooks/useAddaRoom.ts`**: The real-time networking engine. Implements MQTT connection, PHP polling, speech bubble timing, character deduplication, and song sync callbacks.
- **`src/hooks/useYouTubePlayer.ts`**: Headless YouTube player controller. Manages IFrame API script loading, video queueing, playback state machine, and volume adjustments.
- **`src/hooks/useAmbientAudio.ts`**: Web Audio API engine for procedural rain white-noise synthesis and guitar chord strum sound effects.
- **`src/hooks/usePresenceAndConfessions.ts`**: Handles global campus cheering counters, active online numbers, and confession lists.
- **`src/hooks/useDhakaClockAndWeather.ts`**: Computes live Dhaka local time (`Asia/Dhaka`, UTC+6) and mock campus weather conditions.
- **`src/types/room.ts`**: Declares canonical data types (`AddaRoom`, `RoomParticipant`, `ChatMessage`, `CampusCharacter`, `RoomSong`) and exports `CAMPUS_CHARACTERS`.

---

## 2. Backend Core Files (`api/`)

- **`api/config.php`**: Sets universal UTC timezone (`date_default_timezone_set('UTC')`), establishes CORS headers, and loads database environment variables.
- **`api/db.php`**: Singleton PDO connection factory with automatic SQLite fallback and connection-time room expiration cleanup (`purgeExpiredRooms`).
- **`api/rooms.php`**: REST controller for creating rooms, querying room state with character occupation maps, joining with auto-reassignment, and song updating.
- **`api/messages.php`**: REST controller for polling chat messages (`action=poll`) and sending messages with auto-healing room recreation (`action=send`).
- **`api/confessions.php`**: REST controller for listing and creating campus confessions and incrementing likes.
- **`api/stats.php`**: REST controller for getting and updating the campus cheers counter and mood distributions.
- **`api/schema.sql`**: Relational database DDL creating `rooms`, `participants`, `messages`, `confessions`, and `campus_stats` tables.

