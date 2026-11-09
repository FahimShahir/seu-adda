---
title: "Flowcharts, State Machines & Network Topologies"
document_id: "DOC-REF-004"
category: "References & Diagrams"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/hooks/useYouTubePlayer.ts"
  - "src/hooks/useAddaRoom.ts"
dependencies:
  - "DOC-REF-003"
---

# Flowcharts, State Machines & Network Topologies

## 1. YouTube Player State Machine

```mermaid
stateDiagram-v2
    [*] --> UNSTARTED: Load YouTube API
    UNSTARTED --> BUFFERING: Queue Track (Video ID)
    BUFFERING --> PLAYING: Buffering Complete
    PLAYING --> PAUSED: User clicks Pause / Radio Toggle
    PAUSED --> PLAYING: User clicks Play / Radio Toggle
    PLAYING --> ENDED: Track Finishes
    ENDED --> BUFFERING: Auto-advance to Next Track in Playlist
```

## 2. Room Participant Inactivity State Machine

```mermaid
stateDiagram-v2
    [*] --> Active: Join Room (last_seen = NOW)
    Active --> Active: Heartbeat ping every 5s (last_seen refreshed)
    Active --> Stale: Tab blurred or phone screen locked (> 5s)
    Stale --> Active: Tab refocused (Heartbeat resumes)
    Stale --> Expired: Inactive for > 300 seconds (5 minutes)
    Expired --> [*]: purgeExpiredRooms() expunges participant record
```

