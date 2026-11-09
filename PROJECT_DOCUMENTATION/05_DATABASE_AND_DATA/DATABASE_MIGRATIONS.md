---
title: "Database Migrations & Initial Seeding"
document_id: "DOC-DATA-009"
category: "Database & Data Architecture"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/schema.sql"
dependencies:
  - "DOC-DATA-008"
---

# Database Migrations & Initial Seeding

## 1. Initial Data Seeding

The baseline database setup initializes default records to ensure the platform feels active from first deployment:

```sql
-- Initial Sample Campus Confessions (Bengali nostalgic memories)
INSERT INTO `confessions` (`author`, `dept`, `batch`, `text`, `likes`) VALUES
('নাম প্রকাশে অনিচ্ছুক', 'CSE', '52nd Batch', 'ক্যাম্পাসের সিঁড়িতে বইসা লাল চা আর গিটারের গানের আড্ডাটা মিস করব সবচেয়ে বেশি। এই আড্ডার কারণেই ভার্সিটি লাইফ এত সুন্দর ছিল!', 42),
('এক জুনিয়র', 'BBA', '58th Batch', 'লাইব্রেরিতে পড়ার চেয়ে ক্যাফেটেরিয়ার কোণায় আড্ডা দেওয়াটাই বেশি পড়াশোনা মনে হতো! ☕', 28),
('চিরন্তন ব্যাকবেঞ্চার', 'EEE', '54th Batch', 'স্যারের ক্লাস বাংক দিয়ে বৃষ্টির দিনে বন্ধুদের সাথে চা খাওয়ার স্মৃতি কোনোদিন ভুলব না। 🌧️', 35);

-- Singleton Campus Stats Counters
INSERT IGNORE INTO `campus_stats` (`id`, `cheers_count`, `mood_general`, `mood_heartbreak`, `mood_exams`, `mood_canteen`)
VALUES (1, 420, 50, 15, 30, 65);
```

## 2. Automated SQLite Migration (`initSqliteTables`)

When executing locally without MySQL, `api/db.php` automatically runs `initSqliteTables($pdo)` to create equivalent tables in SQLite3 format, complete with `PRAGMA foreign_keys = ON;`.

