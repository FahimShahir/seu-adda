-- ==============================================================================
-- SEU Adda — সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা
-- InfinityFree MySQL Database Schema (A to Z features support)
-- Full Bengali (বাংলা) & Emoji support via utf8mb4
-- ==============================================================================

-- ১. পার্সোনাল আড্ডা রুম টেবিল (২ ঘণ্টার মেয়াদযুক্ত)
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

-- ২. রুম পার্টিসিপেন্ট টেবিল (কে কোন ক্যারেক্টার নিয়েছে)
CREATE TABLE IF NOT EXISTS `participants` (
  `id` VARCHAR(64) NOT NULL,
  `room_id` VARCHAR(16) NOT NULL,
  `name` VARCHAR(64) NOT NULL,
  `dept` VARCHAR(32) NOT NULL DEFAULT 'CSE',
  `gender` ENUM('male', 'female') NOT NULL DEFAULT 'male',
  `character_id` VARCHAR(64) NOT NULL,
  `joined_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_seen` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`, `room_id`),
  INDEX `idx_part_room` (`room_id`),
  INDEX `idx_part_char` (`room_id`, `character_id`),
  CONSTRAINT `fk_part_room` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ৩. চ্যাট মেসেজ টেবিল (৩০ সেকেন্ড বাবল ও হিস্ট্রি)
CREATE TABLE IF NOT EXISTS `messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `msg_uid` VARCHAR(64) NOT NULL,
  `room_id` VARCHAR(16) NOT NULL,
  `sender_id` VARCHAR(64) NOT NULL,
  `sender_name` VARCHAR(64) NOT NULL,
  `sender_dept` VARCHAR(32) NULL,
  `character_id` VARCHAR(64) NOT NULL,
  `text` TEXT NOT NULL,
  `is_system` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_msg_poll` (`room_id`, `id`),
  CONSTRAINT `fk_msg_room` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ৪. গ্লোবাল কনফেশন ওয়াল টেবিল
CREATE TABLE IF NOT EXISTS `confessions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `author` VARCHAR(64) NOT NULL,
  `dept` VARCHAR(32) NOT NULL,
  `batch` VARCHAR(32) NOT NULL,
  `text` TEXT NOT NULL,
  `likes` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- কিছু প্রারম্ভিক কনফেশন ডাটা (ঐচ্ছিক)
INSERT INTO `confessions` (`author`, `dept`, `batch`, `text`, `likes`) VALUES
('নাম প্রকাশে অনিচ্ছুক', 'CSE', '52nd Batch', 'ক্যাম্পাসের সিঁড়িতে বইসা লাল চা আর গিটারের গানের আড্ডাটা মিস করব সবচেয়ে বেশি। এই আড্ডার কারণেই ভার্সিটি লাইফ এত সুন্দর ছিল!', 42),
('এক জুনিয়র', 'BBA', '58th Batch', 'লাইব্রেরিতে পড়ার চেয়ে ক্যাফেটেরিয়ার কোণায় আড্ডা দেওয়াটাই বেশি পড়াশোনা মনে হতো! ☕', 28),
('চিরন্তন ব্যাকবেঞ্চার', 'EEE', '54th Batch', 'স্যারের ক্লাস বাঙ্ক দিয়ে বৃষ্টির দিনে বন্ধুদের সাথে চা খাওয়ার স্মৃতি কোনোদিন ভুলব না। 🌧️', 35);
