---
title: "Authorization, Permissions & Validation Engine"
document_id: "DOC-BE-007"
category: "Backend System"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/rooms.php"
  - "api/messages.php"
dependencies:
  - "DOC-BE-006"
---

# Authorization, Permissions & Validation Engine

## 1. Input Validation Rules

- **Message Text Length**: Enforced non-empty, trimmed string. Truncated at 1,000 characters to prevent memory exhaustion.
- **Room Code Format**: Must match regex `/^[A-Z0-9-]{4,16}$/i`.
- **Character Avatar IDs**: Must match one of the 18 registered campus avatars in `CAMPUS_CHARACTERS`.

## 2. Error Response Standards

All API errors return consistent JSON structures with semantic HTTP status codes:
- `400 Bad Request`: `{ "error": "মেসেজ বা প্রেরকের তথ্য খালি" }`
- `404 Not Found`: `{ "error": "রুমটি পাওয়া যায়নি বা মেয়াদ শেষ হয়েছে" }`
- `409 Conflict`: `{ "error": "রুম সম্পূর্ণ পূর্ণ (১৮/১৮)!" }`
- `500 Internal Error`: `{ "error": "ডাটাবেজ সংযোগে ত্রুটি" }`

