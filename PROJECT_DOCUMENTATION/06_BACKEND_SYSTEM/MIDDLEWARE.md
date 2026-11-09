---
title: "Backend Middleware, Auth & Error Handling"
document_id: "DOC-BE-005"
category: "Backend System"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/config.php"
  - "api/db.php"
dependencies:
  - "DOC-BE-004"
---

# Backend Middleware, Auth & Error Handling

## 1. CORS & Security Middleware (`config.php`)

```php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(200);
    exit;
}
```
Handles cross-origin requests from both GitHub Pages (`https://fahimshahir.github.io`) and localhost environments.

## 2. Authentication & Identity Architecture

- **No Passwords / No Sessions**: To eliminate user onboarding friction, authentication is completely stateless and ephemeral.
- **Client Tab UID**: Each browser tab creates a persistent unique ID in `sessionStorage.getItem('seu_tab_user_id')`. This ID is sent with API requests as `participantId` or `senderId`.
- **Host Permissions**: The participant who issued `action=create` has their UID saved as `host_id` in the `rooms` table.

## 3. Background Inactivity Garbage Collection (`db.php`)

```php
function purgeExpiredRooms(PDO $pdo): void {
    try {
        $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
        if ($driver === 'sqlite') {
            $pdo->query("DELETE FROM rooms WHERE datetime(expires_at) <= datetime('now')");
            $pdo->query("DELETE FROM participants WHERE datetime(last_seen) <= datetime('now', '-300 seconds')");
        } else {
            $pdo->query("DELETE FROM rooms WHERE expires_at <= NOW()");
            $pdo->query("DELETE FROM participants WHERE last_seen <= DATE_SUB(NOW(), INTERVAL 300 SECOND)");
        }
    } catch (Exception $e) {}
}
```
Executes silently on every database connection, eliminating the need for cron jobs.

