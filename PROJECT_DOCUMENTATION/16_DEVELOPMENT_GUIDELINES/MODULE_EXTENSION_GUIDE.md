---
title: "Module Extension Guide: Adding Characters & Playlists"
document_id: "DOC-DEV-003"
category: "Development Guidelines"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/types/room.ts"
  - "src/data/playlists.ts"
  - "src/data/dialogues.ts"
dependencies:
  - "DOC-DEV-001"
---

# Module Extension Guide: Adding Characters & Playlists

## 1. How to Add a New Campus Character

1. Open `src/types/room.ts`.
2. Append a new character object to `CAMPUS_CHARACTERS`:
   ```typescript
   {
     id: 'new_student_avatar',
     name: 'সুমন',
     gender: 'male',
     role: 'নতুন আড্ডাবাজ',
     emoji: '😎',
     zone: 'foreground',
     x: 45, // Horizontal percentage (0-100)
     y: 65  // Vertical percentage (0-100)
   }
   ```
3. Open `src/data/dialogues.ts` and add sample dialogues for the character across all 4 moods (`adda`, `heartbreak`, `exams`, `canteen`).
4. Rebuild the application with `npm run build`.

---

## 2. How to Add a New Campus Playlist

1. Open `src/data/playlists.ts`.
2. Append a new playlist entry to `CAMPUS_PLAYLISTS`:
   ```typescript
   {
     id: 'YOUTUBE_PLAYLIST_OR_VIDEO_ID',
     name: '🎸 নতুন আড্ডা গান',
     description: 'ক্যাম্পাস স্মৃতির সেরা বাংলা গান',
     emoji: '🎸',
     isNightTheme: true
   }
   ```
3. Rebuild the application with `npm run build`.

