---
title: "Monitoring, Telemetry & Logging Architecture"
document_id: "DOC-OPS-009"
category: "Infrastructure & Deployment"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/rooms.php"
  - "src/hooks/useAddaRoom.ts"
dependencies:
  - "DOC-OPS-008"
---

# Monitoring, Telemetry & Logging Architecture

## 1. Client-Side Telemetry & Log Separation

- **Informational Warnings**: YouTube iframe origin warning (`postMessage DOMWindow target origin`) is standard browser behavior and harmless.
- **Critical Diagnostics**: Network failures in `useAddaRoom.ts` log warning traces (`console.warn('EMQX MQTT warning:', err)`), allowing maintainers to inspect network health via browser DevTools.

## 2. Server-Side Error Logging
- Backend errors trigger standard PHP `error_log()`, viewable via InfinityFree's vPanel error log explorer.

