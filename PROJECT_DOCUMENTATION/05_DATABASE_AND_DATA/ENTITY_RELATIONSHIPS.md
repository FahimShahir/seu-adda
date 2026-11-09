---
title: "Entity Relationships & Referential Integrity"
document_id: "DOC-DATA-003"
category: "Database & Data Architecture"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/schema.sql"
dependencies:
  - "DOC-DATA-002"
---

# Entity Relationships & Referential Integrity

```mermaid
erDiagram
    rooms ||--o{ participants : "has members"
    rooms ||--o{ messages : "has chats"

    rooms {
        varchar(16) id PK
        varchar(100) name
        varchar(64) host_id
        varchar(64) host_name
        datetime created_at
        datetime expires_at
        varchar(128) current_song_title
        varchar(64) current_song_author
        varchar(255) current_song_source
        varchar(64) current_song_played_by
    }

    participants {
        varchar(64) id PK
        varchar(16) room_id PK,FK
        varchar(64) name
        varchar(64) dept
        enum gender
        varchar(64) character_id
        datetime joined_at
        datetime last_seen
    }

    messages {
        int id PK
        varchar(64) msg_uid
        varchar(16) room_id FK
        varchar(64) sender_id
        varchar(64) sender_name
        varchar(64) sender_dept
        varchar(64) character_id
        text text
        tinyint(1) is_system
        datetime created_at
    }
```

## Cascade Deletion Rules
- **Foreign Key `fk_part_room`**: `participants.room_id` references `rooms.id` with `ON DELETE CASCADE`. When an expired room is deleted, all participant records are automatically removed.
- **Foreign Key `fk_msg_room`**: `messages.room_id` references `rooms.id` with `ON DELETE CASCADE`. When an expired room is deleted, all associated chat records are instantly cleared.

