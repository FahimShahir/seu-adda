---
title: "Third-Party Libraries & Communication Protocols"
document_id: "DOC-API-006"
category: "API & Integrations"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "package.json"
dependencies:
  - "DOC-API-004"
---

# Third-Party Libraries & Communication Protocols

## 1. Canvas Confetti (`canvas-confetti`)
- **Usage**: Invoked when copying bKash number, entering private room, or clicking the steaming red tea cup (*"Cheers!"*).
- **Execution**: Pure client-side GPU-accelerated canvas particle physics. Zero network overhead.

## 2. Lucide React (`lucide-react`)
- **Usage**: Lightweight, tree-shaken SVG icons used throughout the header, player controls, modal dialogs, and character indicators.

## 3. Communication Protocols Summary
1. **HTTP/1.1 & HTTP/2**: REST requests, audio streaming, asset delivery.
2. **WebSocket (WSS)**: Bidirectional MQTT framing on port `8084`.
3. **HTML5 BroadcastChannel**: Cross-tab inter-process message bus.

