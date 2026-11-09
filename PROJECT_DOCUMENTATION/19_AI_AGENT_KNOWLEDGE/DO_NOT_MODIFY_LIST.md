---
title: "Do Not Modify List & Fragile Component Inventory"
document_id: "DOC-AGT-003"
category: "AI Agent Knowledge"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "public/.htaccess"
  - "api/db.php"
dependencies:
  - "DOC-AGT-002"
---

# Do Not Modify List & Fragile Component Inventory

The following files and logic blocks are critical to system stability and must not be modified or refactored without extreme caution:

1. **`public/.htaccess`**:
   - Contains URL rewriting and CORS headers. Modifying rewrite rules can break API access (`/api/`) or cause infinite SPA redirects on InfinityFree.
2. **`api/db.php` -> `purgeExpiredRooms()`**:
   - The query `DELETE FROM participants WHERE last_seen <= DATE_SUB(NOW(), INTERVAL 300 SECOND)` must never be shortened to less than 300 seconds.
3. **`api/config.php` -> `date_default_timezone_set('UTC')`**:
   - Must never be changed to local time (`Asia/Dhaka`). All server timestamps must stay UTC.
4. **`src/components/Scene/CampusScene.tsx` -> `handleHotspotClick()`**:
   - The guard `if (owner && owner.id !== currentUserId) return;` must never be removed.
5. **`src/hooks/useAddaRoom.ts` -> Active Room Initializer**:
   - Must verify `parsed.participants?.some(p => p.id === myTabId)` before setting `activeRoom`. Removing this check causes visitors to bypass the Join modal.

