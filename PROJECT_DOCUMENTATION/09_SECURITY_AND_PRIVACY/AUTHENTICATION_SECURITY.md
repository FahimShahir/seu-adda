---
title: "Authentication & Authorization Security Controls"
document_id: "DOC-SEC-003"
category: "Security & Privacy"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/hooks/useAddaRoom.ts"
  - "api/rooms.php"
dependencies:
  - "DOC-SEC-002"
---

# Authentication & Authorization Security Controls

## 1. Ephemeral Session Isolation

- **Storage Location**: `sessionStorage.getItem('seu_tab_user_id')`.
- **Isolation Scope**: Per-tab scope. Opening a new tab creates an isolated participant ID, allowing the user to test multi-user rooms on the same machine without cookie bleeding.
- **Expiry**: When the tab or browser window is closed, the session ID is destroyed by the browser automatically.

## 2. Character Exclusivity Authorization
When a user attempts to claim an avatar:
1. Client checks `takenCharactersMap`. If another user owns the avatar, selection is blocked.
2. In `CampusScene.tsx`, clicking on an avatar owned by someone else returns immediately:
   ```typescript
   if (owner && owner.id !== currentUserId) {
     return;
   }
   ```
3. Backend `rooms.php` re-evaluates database locks, reassigning if race condition occurred.

