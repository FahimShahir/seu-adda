---
title: "Coding & Symbol Naming Conventions"
document_id: "DOC-STR-006"
category: "Project Structure"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/types/room.ts"
dependencies:
  - "DOC-STR-005"
---

# Coding & Symbol Naming Conventions

## 1. Domain Model Entities & Attributes

| Entity | Type | Identifier Pattern | Example Value |
|---|---|---|---|
| **Room Code** | String | `SEU-` + 4 alphanumeric uppercase characters | `SEU-TYXJ` |
| **User / Tab ID** | String | `user_` + 7 random alphanumeric characters | `user_7uc36o7` |
| **Message UUID** | String | `msg_` + epoch timestamp + random hex | `msg_1794261158_3ab` |
| **System Message** | String | `sys_` + epoch timestamp | `sys_1794261158` |
| **Character ID** | String | Descriptive snake_case avatar role | `guitarist`, `blue_shirt_friend`, `sajid` |
| **Bengali Moods** | String Enum | `'adda' \| 'heartbreak' \| 'exams' \| 'canteen'` | `adda` |

## 2. Code Organization Standards

- **State Hooks**: Every hook returns an explicit object interface with camelCase state variables and action dispatchers (e.g., `createRoom`, `joinRoom`, `leaveRoom`, `sendChatMessage`).
- **PHP Variables**: camelCase for local variables; uppercase for defined constants (`DB_HOST`, `DB_NAME`). Prepared statement placeholders always use named parameters (e.g., `:room_id`, `:sender_id`).

