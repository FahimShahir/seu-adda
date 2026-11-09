---
title: "Notification Rules & Speech Bubble Mechanics"
document_id: "DOC-BIZ-003"
category: "Business Logic & Product Rules"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/components/Scene/LiveRoomSpeechBubble.tsx"
dependencies:
  - "DOC-BIZ-002"
---

# Notification Rules & Speech Bubble Mechanics

## 1. Speech Bubble Life Cycle

- **Trigger Event**: Incoming user chat message or room system event (`ROOM_JOIN`, `ROOM_SONG_CHANGE`).
- **Positioning**: Anchored via absolute percentage coordinates directly above the sender's character avatar.
- **Duration**: Persists for exactly **30 seconds** before fading out smoothly.
- **Visual Distinction**:
  - User messages: Amber/slate styling displaying sender name, department, time, and text in quotes.
  - System announcements: Violet/cyan styling with celebratory party popper emoji.

