---
title: "API Architecture & Specification Standards"
document_id: "DOC-API-001"
category: "API & Integrations"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/rooms.php"
  - "api/messages.php"
dependencies:
  - "DOC-ARCH-001"
---

# API Architecture & Specification Standards

## 1. RESTful RPC Model

The backend API follows a lightweight **Action-Based REST / RPC Pattern**:
- **Format**: All payloads sent and received must be `application/json; charset=utf-8`.
- **Query / Post Separation**:
  - Read actions (`get`, `poll`, `list`) can accept parameters via query strings (`$_GET`).
  - Mutating actions (`create`, `join`, `send`, `transfer`, `leave`, `song`, `heartbeat`, `cheers`, `like`) consume JSON bodies parsed via `getJsonInput()`.
- **Stateless Operation**: Every request contains all necessary identifiers (`roomId`, `participantId`, `senderId`) without requiring PHP server sessions (`session_start()`).

