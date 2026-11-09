---
title: "Frontend Architecture & React 19 Engine"
document_id: "DOC-FE-001"
category: "Frontend & UI Architecture"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/App.tsx"
  - "src/components/"
dependencies:
  - "DOC-ARCH-001"
---

# Frontend Architecture & React 19 Engine

## 1. Declarative Single-Page Architecture

The frontend is constructed with **React 19** using functional components, standard hooks (`useState`, `useEffect`, `useCallback`, `useRef`), and pure TypeScript domain interfaces:

```mermaid
flowchart TD
    App["src/App.tsx (Root Controller)"]
    
    subgraph UI_Components["Presentational Components"]
        HeaderBar["HeaderBar: Clock, Weather, Presence, Moods"]
        CampusScene["CampusScene: 18 Hotspots, RainCanvas, SpeechBubbles"]
        PlayerControls["PlayerControls: Headless Audio Toolbar"]
        ChatBar["FloatingRoomChatBar: Active Room Chat Dock"]
    end

    subgraph Modals["Modal Overlay Windows"]
        PlaylistModal["PlaylistModal: Track Selection"]
        PrivateRoomModal["PrivateRoomModal: Room Management"]
        ConfessionModal["ConfessionModal: Campus Memories"]
        PhotoCardModal["PhotoCardModal: Card Generator"]
        DeveloperModal["DeveloperModal: Profile & bKash Support"]
    end

    subgraph State_Hooks["State & Business Logic Hooks"]
        useAddaRoom["useAddaRoom: Real-Time Sync & Rooms"]
        useYouTubePlayer["useYouTubePlayer: Headless Audio"]
        useAmbientAudio["useAmbientAudio: Rain & Guitar Chords"]
        usePresence["usePresenceAndConfessions: Wall & Stats"]
        useClock["useDhakaClockAndWeather: Dhaka Time"]
    end

    App --> State_Hooks
    App --> UI_Components
    App --> Modals
```

## 2. React 19 Optimizations
- **Automatic Batching**: All state updates in promises, timeouts, and native event listeners batch automatically.
- **Fast Re-render Isolation**: Hotspots and speech bubbles isolate their individual re-renders, preventing the entire campus artwork from re-rendering during chat typing.

