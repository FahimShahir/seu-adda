---
title: "Frontend State Management Architecture"
document_id: "DOC-FE-004"
category: "Frontend & UI Architecture"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/App.tsx"
  - "src/hooks/useAddaRoom.ts"
dependencies:
  - "DOC-FE-001"
---

# Frontend State Management Architecture

## 1. State Topology: Co-located Custom Hooks

Instead of introducing heavyweight state containers (Redux, Zustand, MobX), SEU Adda uses **Domain-Specific Custom Hooks** co-located with local browser persistence:

| State Domain | Primary Hook | Persistence Mechanism | Cross-Tab / Network Sync |
|---|---|---|---|
| **Private Room & Chat** | `useAddaRoom` | `localStorage ('seu_adda_room_ID')` | MQTT WebSockets / PHP Polling / `BroadcastChannel` |
| **User Identity** | `useAddaRoom` | `sessionStorage ('seu_tab_user_id')` | Local to browser tab session |
| **Audio & Playback** | `useYouTubePlayer` | In-memory `YT.Player` instance | Room song event broadcast |
| **Environmental Toggles** | `App.tsx` | In-memory `useState(isNight, isRain)` | Local client preference |
| **Campus Cheers Counter** | `usePresenceAndConfessions` | `localStorage ('seu_cheers_count')` | Synchronized with MySQL `campus_stats` table |

## 2. Speech Bubble Lifecycle State

```typescript
interface SpeechBubbleState {
  id: string;
  characterId: string;
  senderName: string;
  senderDept?: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}
```
Speech bubbles are appended to `activeSpeechBubbles` array and automatically cleared via individual `setTimeout(..., 30000)` callbacks.

