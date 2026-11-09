---
title: "Platform Compatibility Matrix"
document_id: "DOC-TECH-006"
category: "Technology Stack"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "package.json"
dependencies:
  - "DOC-TECH-005"
---

# Platform Compatibility Matrix

| Feature | Chrome / Edge | Safari (macOS & iOS) | Firefox | Mobile Android Chrome |
|---|---|---|---|---|
| **Canvas Rain Simulation** | 🟢 60 FPS | 🟢 60 FPS | 🟢 60 FPS | 🟢 60 FPS |
| **Touch Drag Pan** | 🟢 Native pointer | 🟢 Touch events | 🟢 Native pointer | 🟢 Smooth drag |
| **Headless YouTube Radio** | 🟢 Instant | 🟡 User touch required | 🟢 Instant | 🟡 User touch required |
| **WebSocket MQTT Sync** | 🟢 Native WSS | 🟢 Native WSS | 🟢 Native WSS | 🟢 Native WSS |
| **HTTP Message Polling** | 🟢 Fetch API | 🟢 Fetch API | 🟢 Fetch API | 🟢 Fetch API |
| **Bengali Unicode Rendering** | 🟢 Flawless | 🟢 Flawless | 🟢 Flawless | 🟢 Flawless |
| **bKash Clipboard Copy** | 🟢 navigator.clipboard | 🟢 navigator.clipboard | 🟢 navigator.clipboard | 🟢 navigator.clipboard |

