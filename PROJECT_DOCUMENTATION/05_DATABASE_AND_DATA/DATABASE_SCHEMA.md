---
title: "Database DDL Schema Definition"
document_id: "DOC-DATA-002"
category: "Database & Data Architecture"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/schema.sql"
dependencies:
  - "DOC-DATA-001"
---

# Database DDL Schema Definition

The canonical relational database schema for SEU Adda is defined in `api/schema.sql`:

```sql
-- 1. Private Adda Rooms Table (2-Hour Ephemeral Lifespan)
CREATE TABLE IF NOT EXISTS `rooms` (
  `id` VARCHAR(16) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `host_id` VARCHAR(64) NOT NULL,
  `host_name` VARCHAR(64) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` DATETIME NOT NULL,
  `current_song_title` VARCHAR(128) NULL,
  `current_song_author` VARCHAR(64) NULL,
  `current_song_source` VARCHAR(255) NULL,
  `current_song_played_by` VARCHAR(64) NULL,
  INDEX `idx_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Room Participants Table (Who holds which character avatar)
CREATE TABLE IF NOT EXISTS `participants` (
  `id` VARCHAR(64) NOT NULL,
  `room_id` VARCHAR(16) NOT NULL,
  `name` VARCHAR(64) NOT NULL,
  `dept` VARCHAR(64) NOT NULL DEFAULT 'CSE',
  `gender` ENUM('male', 'female') NOT NULL DEFAULT 'male',
  `character_id` VARCHAR(64) NOT NULL,
  `joined_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_seen` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`, `room_id`),
  INDEX `idx_part_room` (`room_id`),
  INDEX `idx_part_char` (`room_id`, `character_id`),
  CONSTRAINT `fk_part_room` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Room Messages Table (Chat history & speech bubbles)
CREATE TABLE IF NOT EXISTS `messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `msg_uid` VARCHAR(64) NOT NULL,
  `room_id` VARCHAR(16) NOT NULL,
  `sender_id` VARCHAR(64) NOT NULL,
  `sender_name` VARCHAR(64) NOT NULL,
  `sender_dept` VARCHAR(64) NULL,
  `character_id` VARCHAR(64) NOT NULL,
  `text` TEXT NOT NULL,
  `is_system` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_msg_poll` (`room_id`, `id`),
  CONSTRAINT `fk_msg_room` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Global Campus Confessions Wall Table
CREATE TABLE IF NOT EXISTS `confessions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `author` VARCHAR(64) NOT NULL,
  `dept` VARCHAR(64) NOT NULL,
  `batch` VARCHAR(64) NOT NULL,
  `text` TEXT NOT NULL,
  `likes` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Global Campus Statistics & Cheers Counter Table
CREATE TABLE IF NOT EXISTS `campus_stats` (
  `id` INT NOT NULL PRIMARY KEY DEFAULT 1,
  `cheers_count` INT NOT NULL DEFAULT 420,
  `mood_general` INT NOT NULL DEFAULT 50,
  `mood_heartbreak` INT NOT NULL DEFAULT 15,
  `mood_exams` INT NOT NULL DEFAULT 30,
  `mood_canteen` INT NOT NULL DEFAULT 65,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

