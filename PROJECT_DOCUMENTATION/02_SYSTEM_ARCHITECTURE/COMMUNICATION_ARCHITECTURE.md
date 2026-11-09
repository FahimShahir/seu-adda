---
title: "Communication Architecture & Transport Protocols"
document_id: "DOC-ARCH-008"
category: "System Architecture"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/hooks/useAddaRoom.ts"
dependencies:
  - "DOC-ARCH-001"
---

# Communication Architecture & Transport Protocols

## 1. Multi-Transport Real-Time Matrix

SEU Adda employs three complementary communication protocols to guarantee message delivery regardless of browser or network conditions:

| Transport Protocol | Technology | Target Scope | Latency | Reliability Feature |
|---|---|---|---|---|
| **Secure WebSocket (WSS)** | MQTT over WebSockets | GitHub Pages (Mode A) | < 300ms | Exponential backoff auto-reconnect, retain flags |
| **HTTP Short Polling** | REST API (`/api/messages.php`) | InfinityFree (Mode B) | ~1.6s | Incremental `after_id` query, auto-healing recovery |
| **BroadcastChannel API** | Browser IPC (`seu_adda_room_bus`) | Same-Browser Tabs | < 10ms | Instant cross-tab sync without network roundtrip |

---

## 2. In-Browser Tab Synchronization (`BroadcastChannel`)

When a user opens multiple tabs or windows in the same browser session:
- Changes in one tab (e.g., song switch, character change, chat message) are broadcasted immediately via `new BroadcastChannel('seu_adda_room_bus')`.
- All peer tabs handle incoming events locally without making redundant server requests, preventing wasted database hits on shared hosting.

