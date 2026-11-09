---
title: "Request & Response Formats and Schemas"
document_id: "DOC-API-003"
category: "API & Integrations"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/rooms.php"
  - "api/messages.php"
dependencies:
  - "DOC-API-002"
---

# Request & Response Formats and Schemas

## 1. Unified JSON Envelope

All API endpoints return JSON conforming to the following contracts:

### Success Pattern
```json
{
  "success": true,
  "...payload": "relevant data"
}
```

### Error Pattern
```json
{
  "error": "বাংলা ভাষায় লিখিত সুস্পষ্ট ত্রুটির বার্তা"
}
```

## 2. Ephemeral Room State Schema (`AddaRoom`)
```typescript
interface AddaRoom {
  id: string;                    // e.g. "SEU-TYXJ"
  name: string;                  // e.g. "সাউথইস্ট আড্ডা রুম"
  hostId: string;                // e.g. "user_7uc36o7"
  hostName: string;              // e.g. "শাহির"
  createdAt: number;             // Epoch milliseconds UTC
  expiresAt: number;             // Epoch milliseconds UTC
  participants: RoomParticipant[];
  messages: ChatMessage[];
  currentSong?: RoomSong;
}
```

