---
title: "Scalability Design & Free-Tier Optimization"
document_id: "DOC-ARCH-009"
category: "System Architecture"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/hooks/useAddaRoom.ts"
  - "api/db.php"
dependencies:
  - "DOC-ARCH-001"
---

# Scalability Design & Free-Tier Optimization

## 1. Operating Within Free-Tier Hosting Limits

Deploying a real-time web application on free hosting requires defensive architectural engineering:

```mermaid
flowchart TD
    subgraph Optimizations["Scalability & Free-Tier Optimizations"]
        Opt1["1. Conditional Polling: Only poll when inside activeRoom"]
        Opt2["2. Incremental Cursor: Fetch messages WHERE id > last_seen_id"]
        Opt3["3. Automatic Purge: Purge expired records on every connection"]
        Opt4["4. Static CDN Offloading: GitHub Pages handles all heavy assets"]
        Opt5["5. YouTube Headless Audio: Zero audio server bandwidth"]
    end
```

1. **Zero Wasted Background Polling**:
   - Polling intervals (`msgPollInterval` and `roomPollInterval`) in `useAddaRoom.ts` are mounted ONLY when `activeRoom?.id` is truthy. Inactive visitors generate 0 server requests.
2. **Incremental High-Performance SQL Indexing**:
   - `SELECT ... FROM messages WHERE room_id = :room_id AND id > :after_id` uses the composite index `idx_msg_poll (room_id, id)`. Lookups are `O(log N)` index seeks, never table scans.
3. **Automatic Garbage Collection**:
   - `purgeExpiredRooms($pdo)` runs on every database connection with `O(1)` index lookups on `idx_expires (expires_at)` and cascades deletions to `participants` and `messages`.

