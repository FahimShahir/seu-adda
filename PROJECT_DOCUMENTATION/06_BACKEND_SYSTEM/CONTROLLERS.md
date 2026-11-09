---
title: "Backend Controllers & Dispatcher Pattern"
document_id: "DOC-BE-003"
category: "Backend System"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/rooms.php"
  - "api/messages.php"
dependencies:
  - "DOC-BE-002"
---

# Backend Controllers & Dispatcher Pattern

## 1. Action Dispatcher Architecture

Each backend file acts as a cohesive resource controller using the **Switch Action Dispatcher Pattern**:

```php
$pdo = getDbConnection();
$action = $_GET['action'] ?? $_POST['action'] ?? '';
$input = getJsonInput();

switch ($action) {
    case 'create':
        // Handle room creation
        break;
    case 'join':
        // Handle room join & character lock
        break;
    case 'get':
        // Handle state fetch
        break;
    default:
        jsonResponse(['error' => 'অজ্ঞাত অ্যাকশন'], 400);
}
```

## 2. Standardized JSON Response Utility

```php
function jsonResponse(mixed $data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
```
Ensures Bengali characters and emojis are never escaped into unreadable Unicode surrogates (`\u0995...`), minimizing JSON payload size.

