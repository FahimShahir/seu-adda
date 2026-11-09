---
title: "Database Table & Column Data Dictionary"
document_id: "DOC-DATA-004"
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

# Database Table & Column Data Dictionary

## 1. Table: `rooms`
Primary table storing active private 2-hour Adda room sessions.

| Column Name | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `VARCHAR(16)` | NO | PRIMARY KEY | Unique room code (e.g., `SEU-TYXJ`). |
| `name` | `VARCHAR(100)` | NO | None | Custom room title (e.g., *সাউথইস্ট আড্ডা রুম*). |
| `host_id` | `VARCHAR(64)` | NO | None | Unique tab identifier of the room creator. |
| `host_name` | `VARCHAR(64)` | NO | None | Display name of the room host. |
| `created_at` | `DATETIME` | NO | `CURRENT_TIMESTAMP` | UTC timestamp of room creation. |
| `expires_at` | `DATETIME` | NO | None | UTC timestamp when room self-destructs (Creation + 7200s). |
| `current_song_title` | `VARCHAR(128)` | YES | NULL | Title of the currently synchronized song. |
| `current_song_author`| `VARCHAR(64)` | YES | NULL | Artist/band of the currently synchronized song. |
| `current_song_source`| `VARCHAR(255)` | YES | NULL | YouTube Video ID or custom stream URL. |
| `current_song_played_by`| `VARCHAR(64)`| YES | NULL | Name of the participant who queued the song. |

---

## 2. Table: `participants`
Tracks joined members in each room and enforces strict avatar exclusivity.

| Column Name | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `VARCHAR(64)` | NO | PRIMARY KEY (1) | Unique tab/device ID of the participant. |
| `room_id` | `VARCHAR(16)` | NO | PRIMARY KEY (2) | Target room code. Foreign key to `rooms(id)`. |
| `name` | `VARCHAR(64)` | NO | None | Participant display name. |
| `dept` | `VARCHAR(64)` | NO | `'CSE'` | Academic department (CSE, BBA, EEE, etc.). |
| `gender` | `ENUM('male','female')` | NO | `'male'` | Gender for avatar categorization. |
| `character_id`| `VARCHAR(64)` | NO | None | Unique avatar ID assigned in this room. |
| `joined_at` | `DATETIME` | NO | `CURRENT_TIMESTAMP` | UTC timestamp when member joined. |
| `last_seen` | `DATETIME` | NO | `CURRENT_TIMESTAMP` | UTC timestamp of last heartbeat. |

---

## 3. Table: `messages`
Stores room chat messages and system announcements.

| Column Name | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `INT` | NO | AUTO_INCREMENT PK | Numeric incremental ID for fast cursor polling. |
| `msg_uid` | `VARCHAR(64)` | NO | None | Client-generated UUID for deduplication. |
| `room_id` | `VARCHAR(16)` | NO | None | Target room code. Foreign key to `rooms(id)`. |
| `sender_id` | `VARCHAR(64)` | NO | None | Tab ID of the message sender. |
| `sender_name`| `VARCHAR(64)` | NO | None | Display name of the sender. |
| `sender_dept`| `VARCHAR(64)` | YES | NULL | Department badge of the sender. |
| `character_id`| `VARCHAR(64)`| NO | None | Avatar ID where speech bubble floats. |
| `text` | `TEXT` | NO | None | Chat message content (utf8mb4 text & emojis). |
| `is_system` | `TINYINT(1)` | NO | `0` | Boolean flag (1 = System notification, 0 = User chat). |
| `created_at` | `DATETIME` | NO | `CURRENT_TIMESTAMP` | UTC creation timestamp. |

---

## 4. Table: `confessions`
Public memory board for anonymous campus confessions.

| Column Name | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `INT` | NO | AUTO_INCREMENT PK | Numeric unique confession ID. |
| `author` | `VARCHAR(64)` | NO | None | Display moniker (or *নাম প্রকাশে অনিচ্ছুক*). |
| `dept` | `VARCHAR(64)` | NO | None | Student department. |
| `batch` | `VARCHAR(64)` | NO | None | Batch number (e.g., *52nd Batch*). |
| `text` | `TEXT` | NO | None | Confession text. |
| `likes` | `INT` | NO | `0` | Atomic heart/like counter. |
| `created_at` | `DATETIME` | NO | `CURRENT_TIMESTAMP` | UTC post timestamp. |

---

## 5. Table: `campus_stats`
Singleton row (`id = 1`) tracking global counters.

| Column Name | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `INT` | NO | PRIMARY KEY | Fixed singleton key `1`. |
| `cheers_count` | `INT` | NO | `420` | Cumulative tea cheers clicks (*"চায়ের কাপে চিয়ার্স"*). |
| `mood_general` | `INT` | NO | `50` | Total clicks on General Adda mood. |
| `mood_heartbreak`| `INT` | NO | `15` | Total clicks on Chyakka mood. |
| `mood_exams` | `INT` | NO | `30` | Total clicks on Exams mood. |
| `mood_canteen` | `INT` | NO | `65` | Total clicks on Canteen mood. |
| `updated_at` | `DATETIME` | NO | Auto-update | Last updated timestamp. |

