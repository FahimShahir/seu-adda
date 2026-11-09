---
title: "Bottleneck Analysis & Scale Ceilings"
document_id: "DOC-PERF-003"
category: "Performance & Reliability"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/messages.php"
dependencies:
  - "DOC-PERF-002"
---

# Bottleneck Analysis & Scale Ceilings

## 1. Hosting Tier Bottlenecks
- **InfinityFree Daily Hits**: Free hosting accounts have daily request quotas. If a room has 18 participants polling every 1.6s, that room consumes approximately 11 requests/sec. To avoid exhaustion, polling automatically deactivates as soon as users leave the room.
- **MySQL Connection Concurrency**: Shared MySQL servers limit concurrent connections to ~30. The application uses transient PDO connections that close immediately upon script execution completion (`exit;`).

## 2. Room Size Ceiling
- Each private room supports up to **18 concurrent participants** (corresponding exactly to the 18 unique campus avatars). When a room reaches 18 members, subsequent join attempts return `409 Conflict: রুম সম্পূর্ণ পূর্ণ!`.

