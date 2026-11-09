---
title: "Module Dependency Graph & Code Relationships"
document_id: "DOC-ARCH-004"
category: "System Architecture"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/App.tsx"
  - "src/hooks/"
dependencies:
  - "DOC-ARCH-003"
---

# Module Dependency Graph & Code Relationships

```mermaid
graph TD
    App["App.tsx"] --> useAddaRoom["useAddaRoom.ts"]
    App --> useYouTubePlayer["useYouTubePlayer.ts"]
    App --> useAmbientAudio["useAmbientAudio.ts"]
    App --> usePresence["usePresenceAndConfessions.ts"]
    App --> useClock["useDhakaClockAndWeather.ts"]
    App --> dialogues["data/dialogues.ts"]
    App --> playlists["data/playlists.ts"]
    App --> types["types/room.ts"]

    useAddaRoom --> types
    useAddaRoom -.->|"Dual Transport"| MQTT["mqtt.js"]
    useAddaRoom -.->|"Dual Transport"| Fetch["fetch() to /api/"]
    useAddaRoom -.->|"Cross-Tab"| BC["BroadcastChannel"]

    useYouTubePlayer --> playlists
```

---

## 1. Upstream / Downstream Module Dependencies

1. **`src/types/room.ts` (Core Domain Schema)**:
   - Zero dependencies. Exported types (`AddaRoom`, `RoomParticipant`, `ChatMessage`, `CampusCharacter`, `RoomSong`) are consumed by `App.tsx`, `useAddaRoom.ts`, `CampusScene.tsx`, and `PrivateRoomModal.tsx`.
2. **`src/hooks/useAddaRoom.ts` (Real-Time State Orchestrator)**:
   - Primary state hook for private rooms. Manages local state, socket connections, API polling, character reassignment, speech bubble triggering, and audio synchronization callbacks.
3. **`src/hooks/useYouTubePlayer.ts` (Headless Media Controller)**:
   - Injects the YouTube IFrame API script tag dynamically, creates a singleton `YT.Player` instance, and coordinates song switching with `useAddaRoom`.
4. **`src/hooks/usePresenceAndConfessions.ts` (Global Presence & Wall)**:
   - Connects to global MQTT topic `seu_campus_adda/global_confessions_v1` or polls `/api/confessions.php` and `/api/stats.php`.

