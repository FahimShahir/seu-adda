---
title: "Execution Flow & Application Lifecycle"
document_id: "DOC-ARCH-006"
category: "System Architecture"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/main.tsx"
  - "src/App.tsx"
dependencies:
  - "DOC-ARCH-001"
---

# Execution Flow & Application Lifecycle

## 1. Application Bootstrap & Mount Lifecycle

```mermaid
flowchart TD
    IndexHTML["index.html: Loads Tailwind fonts & root div"] --> MainTSX["src/main.tsx: ReactDOM.createRoot()"]
    MainTSX --> AppMount["src/App.tsx: Mounts Root Component"]

    subgraph HookInitialization["Concurrent Hook Initialization"]
        H1["useYouTubePlayer(): Injects IFrame API"]
        H2["useDhakaClockAndWeather(): Starts 1s timer"]
        H3["usePresenceAndConfessions(): Connects MQTT / polls stats"]
        H4["useAmbientAudio(): Initializes AudioContext"]
        H5["useAddaRoom(): Checks URL params & loads active room"]
    end

    AppMount --> HookInitialization
    HookInitialization --> URLCheck{"Does URL contain '?room=SEU-XXXX'?"}
    URLCheck -->|"Yes & User NOT joined"| OpenJoinModal["Sets pendingJoinRoomId & opens PrivateRoomModal (Join tab)"]
    URLCheck -->|"Yes & User ALREADY joined"| LoadActiveRoom["Sets activeRoom & mounts FloatingRoomChatBar"]
    URLCheck -->|"No"| RenderDefaultHome["Renders clean interactive campus scene"]
```

---

## 2. Room Join & Character Deduplication Lifecycle

1. **User Enters Code**: User inputs `SEU-TYXJ` into the Join Room input field.
2. **Debounced Query**: After 350ms, `PrivateRoomModal.tsx` queries `./api/rooms.php?action=get&room_id=SEU-TYXJ`.
3. **Map Construction**: Backend returns participants. Frontend builds `takenCharactersMap: Record<string, string>`.
4. **UI Render**: Occupied avatars are marked with red `🔒 [Owner Name]` badges and disabled.
5. **Auto-Selection**: If the guest's currently selected avatar is in the taken map, the system automatically selects the first available avatar of the same gender.
6. **Submission**: Guest clicks *"🚪 রুমে প্রবেশ করুন"*. Frontend dispatches join request to server.
7. **Server Verification**: `rooms.php?action=join` verifies no concurrent collision occurred. If taken, it reassigns to another free character and returns `{ success: true, characterId, wasReassigned: true }`.
8. **State Activation**: Client updates local participant state and starts real-time message polling.

