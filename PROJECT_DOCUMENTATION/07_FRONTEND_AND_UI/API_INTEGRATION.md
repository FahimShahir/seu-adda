---
title: "API Client Integration & Network Layer"
document_id: "DOC-FE-006"
category: "Frontend & UI Architecture"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/hooks/useAddaRoom.ts"
dependencies:
  - "DOC-FE-001"
---

# API Client Integration & Network Layer

## 1. Dual Transport Switching Engine

In `src/hooks/useAddaRoom.ts`, network transport is determined dynamically:

```typescript
const isPhpBackend = typeof window !== 'undefined' && Boolean(
  window.location.hostname.includes('seuadda.free.nf') ||
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
);
```

### Path A: `isPhpBackend = true`
- **Join / State Polling**: Uses standard `fetch()` API with relative URLs (`./api/rooms.php`, `./api/messages.php`).
- **Heartbeat Timer**: Sends heartbeat ping every 5 seconds to prevent participant inactivity timeout.
- **Message Polling Timer**: Dispatches incremental GET queries every 1.6 seconds.

### Path B: `isPhpBackend = false`
- **MQTT Transport**: Instantiates `mqtt.connect('wss://broker.emqx.io:8084/mqtt', ...)`.
- **Subscribed Topics**:
  - `seu-adda/rooms/${roomId}/state`
  - `seu-adda/rooms/${roomId}/events`
- **Publishing**: Dispatches state updates with `retain: true` and QoS 1; sends ephemeral events with QoS 0.

