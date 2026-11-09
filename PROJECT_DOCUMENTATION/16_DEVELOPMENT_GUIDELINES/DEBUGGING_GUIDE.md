---
title: "Debugging Guide & Diagnostic Playbook"
document_id: "DOC-DEV-004"
category: "Development Guidelines"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/hooks/useAddaRoom.ts"
  - "api/db.php"
dependencies:
  - "DOC-DEV-001"
---

# Debugging Guide & Diagnostic Playbook

## 1. How to Debug MQTT Real-Time Sync (GitHub Pages)

- Open Browser DevTools -> **Console**.
- Filter by `EMQX`.
- If connection drops, MQTT client logs reconnect attempts every 2.5s.
- Inspect incoming messages: In `useAddaRoom.ts`, add temporary logging in `client.on('message', ...)`.

## 2. How to Debug PHP MySQL API (InfinityFree)

- Open Browser DevTools -> **Network**.
- Filter by `Fetch/XHR`.
- Inspect polling requests to `messages.php?action=poll`.
- Look at response payload: If returning 404, check whether room record in `rooms` table expired prematurely.
- Verify backend health: Open `https://seuadda.free.nf/api/rooms.php?action=test` in browser (should return `{"status":"ok","php":true}`).

