---
title: "Backend Services & Business Logic Implementation"
document_id: "DOC-BE-004"
category: "Backend System"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/rooms.php"
  - "api/messages.php"
dependencies:
  - "DOC-BE-003"
---

# Backend Services & Business Logic Implementation

## 1. Character Reassignment Algorithm (`rooms.php`)

```mermaid
flowchart TD
    JoinReq["action=join: User requests desired Character ID"] --> CheckTaken{"Is characterId in takenCharacters?"}
    CheckTaken -->|"No (Available)"| AssignRequested["Assign requested characterId"]
    CheckTaken -->|"Yes (Taken)"| FindGenderFree{"Is there a free character of same gender?"}
    FindGenderFree -->|"Yes"| AssignGenderFree["Assign free character of same gender (wasReassigned = true)"]
    FindGenderFree -->|"No"| FindAnyFree{"Is there ANY free character in the room?"}
    FindAnyFree -->|"Yes"| AssignAnyFree["Assign free character (wasReassigned = true)"]
    FindAnyFree -->|"No (Room Full 18/18)"| Reject["Return HTTP 409: রুম সম্পূর্ণ পূর্ণ!"]
    
    AssignRequested --> SaveParticipant["INSERT / REPLACE INTO participants"]
    AssignGenderFree --> SaveParticipant
    AssignAnyFree --> SaveParticipant
    SaveParticipant --> ReturnSuccess["Return JSON with assigned characterId"]
```

## 2. Auto-Healing Room Restoration (`messages.php`)

```php
// Check if room exists
$stmt = $pdo->prepare("SELECT id FROM rooms WHERE id = :id");
$stmt->execute([':id' => $roomId]);
if (!$stmt->fetch()) {
    // Room was prematurely purged by timezone mismatch or host crash!
    // Auto-heal the room record with fresh 2-hour TTL
    $nowUtc = gmdate('Y-m-d H:i:s');
    $expiresUtc = gmdate('Y-m-d H:i:s', time() + 7200);
    $healStmt = $pdo->prepare("
        INSERT IGNORE INTO rooms (id, name, host_id, host_name, created_at, expires_at)
        VALUES (:id, :name, :host_id, :host_name, :created_at, :expires_at)
    ");
    $healStmt->execute([ ... ]);
}
// Message insertion proceeds without failure!
```

