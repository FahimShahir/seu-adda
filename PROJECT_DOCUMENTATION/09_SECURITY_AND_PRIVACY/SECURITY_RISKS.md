---
title: "Security Risk Register & Remediation History"
document_id: "DOC-SEC-007"
category: "Security & Privacy"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/db.php"
  - "src/components/Scene/CampusScene.tsx"
dependencies:
  - "DOC-SEC-006"
---

# Security Risk Register & Remediation History

## 1. Resolved Vulnerabilities & Remediations

### RISK-01: Character Avatar Takeover (RESOLVED)
- **Problem**: Clicking on another user's avatar on the campus scene sent a character transfer event, letting users hijack other people's avatars.
- **Remediation**: Added ownership verification in `CampusScene.tsx` (`if (owner && owner.id !== currentUserId) return;`) and backend exclusivity checks in `rooms.php`.

### RISK-02: Message Drop due to Desynchronized TTL (RESOLVED)
- **Problem**: Timezone drift caused the room record to be wiped while clients were actively chatting, returning 404 and dropping messages.
- **Remediation**: Added auto-healing room recovery in `messages.php`.

