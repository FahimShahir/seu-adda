---
title: "Server Validation Rules & Parameter Guardrails"
document_id: "DOC-BE-010"
category: "Backend System"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/rooms.php"
  - "api/messages.php"
dependencies:
  - "DOC-BE-009"
---

# Server Validation Rules & Parameter Guardrails

## 1. Request Body Parser (`getJsonInput`)

```php
function getJsonInput(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}
```
Ensures invalid JSON payloads fail safely to empty arrays instead of throwing fatal errors.

## 2. Parameter Validation Rules

- **`roomId`**: Required for all room operations. Sanitized via `strtoupper(trim($roomId))`.
- **`senderId` & `text`**: Required for message dispatch. Checked via `if (!$roomId || !$senderId || !$text) jsonResponse(['error' => '...'], 400);`.
- **`characterId`**: Checked against occupied avatars. Automatically reassigned if collision is detected.

