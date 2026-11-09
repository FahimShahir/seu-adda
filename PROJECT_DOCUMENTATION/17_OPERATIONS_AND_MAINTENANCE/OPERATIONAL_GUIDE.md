---
title: "Operational Guide & System Maintenance"
document_id: "DOC-OPS-101"
category: "Operations & Maintenance"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/db.php"
dependencies:
  - "DOC-ARCH-001"
---

# Operational Guide & System Maintenance

## 1. Routine Operational Tasks

- **Monthly Archive Verification**: Ensure `seu_adda_source_code.zip` is updated whenever major milestones are deployed.
- **Database Index Health**: MySQL indexes (`idx_expires`, `idx_msg_poll`) automatically keep table seek times under 2ms.
- **API Status Checks**: Access `https://seuadda.free.nf/api/rooms.php?action=test` periodically to verify PHP runtime status.

