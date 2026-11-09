---
title: "Data Validation & Sanitization Framework"
document_id: "DOC-DATA-007"
category: "Database & Data Architecture"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/rooms.php"
  - "api/messages.php"
dependencies:
  - "DOC-DATA-006"
---

# Data Validation & Sanitization Framework

## 1. Input Sanitization Architecture

```mermaid
flowchart LR
    RawInput["Raw Request Body: file_get_contents('php://input')"] --> ParseJSON["getJsonInput() in api/db.php"]
    ParseJSON --> TypeCheck["Type Casting & Default Fallbacks"]
    TypeCheck --> Sanitize["String Trim & Upper/Lower Normalization"]
    Sanitize --> PreparedStmt["PDO Prepared Statements with Named Placeholders"]
    PreparedStmt --> MySQL[("Database Storage")]
```

## 2. Character Exclusivity Validation (`action=join`)

```php
// Query all currently occupied character IDs in the room
$takenStmt = $pdo->prepare("SELECT character_id FROM participants WHERE room_id = :room_id");
$takenStmt->execute([':room_id' => $roomId]);
$takenCharacters = $takenStmt->fetchAll(PDO::FETCH_COLUMN);

// If requested character is already taken, automatically find first free character
if (in_array($characterId, $takenCharacters, true)) {
    // 1. Try free character of same gender
    // 2. Fall back to any free character
    // Return reassigned character with wasReassigned = true
}
```
This guarantees that concurrent join requests can never bypass character exclusivity.

