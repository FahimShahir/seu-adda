---
title: "STRIDE Threat Model & Attack Surface"
document_id: "DOC-SEC-002"
category: "Security & Privacy"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/rooms.php"
  - "api/messages.php"
dependencies:
  - "DOC-SEC-001"
---

# STRIDE Threat Model & Attack Surface

| STRIDE Category | Threat Description | Severity | Countermeasure Implemented |
|---|---|---|---|
| **Spoofing** | User claims to be the room host to close room | Medium | Host identity checked against `host_id` in database; false close commands rejected. |
| **Tampering** | User modifies participant list in transit | Low | HTTPS TLS in transit on both GitHub Pages and InfinityFree. |
| **Repudiation** | User denies sending offensive campus message | Informational | System is intentionally anonymous and ephemeral; all data vanishes after 2 hours. |
| **Information Disclosure** | Snooping on private room chat | Medium | Room IDs are 8-character high-entropy codes (`SEU-` + 4 random characters); rooms require the code to join. |
| **Denial of Service** | Flooding chat messages or confessions | Medium | Maximum message lengths enforced; queries limited with `LIMIT 50`. |
| **Elevation of Privilege** | Normal participant stealing another's avatar | High | **Screen Hotspot Guard** (`if (owner && owner.id !== currentUserId) return;`) and **Server Reassignment Engine**. |

