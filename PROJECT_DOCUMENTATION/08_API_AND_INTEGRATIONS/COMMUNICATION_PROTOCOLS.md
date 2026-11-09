---
title: "Network Protocols & Message Serialization"
document_id: "DOC-API-007"
category: "API & Integrations"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/hooks/useAddaRoom.ts"
dependencies:
  - "DOC-API-006"
---

# Network Protocols & Message Serialization

## 1. MQTT Topic Serialization Hierarchy

```text
seu-adda/
└── rooms/
    └── {roomId}/
        ├── state          # Retained Topic (QoS 1): Full AddaRoom JSON object
        └── events         # Ephemeral Topic (QoS 0): RoomSyncEvent JSON object
```

### Event Payload Schema (`RoomSyncEvent`)
```typescript
interface RoomSyncEvent {
  type: 'ROOM_JOIN' | 'ROOM_LEAVE' | 'ROOM_CHAT_MESSAGE' | 'ROOM_CHARACTER_TRANSFER' | 'ROOM_SONG_CHANGE' | 'ROOM_DESTROYED';
  roomId: string;
  senderId: string;
  timestamp: number;
  payload?: any;
}
```
All event serializations serialize via `JSON.stringify(event)` and deserialize safely inside `try/catch` wrappers.

