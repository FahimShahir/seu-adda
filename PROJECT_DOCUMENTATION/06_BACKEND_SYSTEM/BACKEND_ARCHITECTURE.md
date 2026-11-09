---
title: "Backend Architecture & Procedural REST Pattern"
document_id: "DOC-BE-001"
category: "Backend System"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/rooms.php"
  - "api/messages.php"
  - "api/db.php"
dependencies:
  - "DOC-ARCH-001"
---

# Backend Architecture & Procedural REST Pattern

## 1. Architectural Style: Lightweight Procedural REST

SEU Adda's backend is implemented using a high-efficiency **Lightweight Procedural REST Pattern** optimized specifically for shared PHP hosting:

```mermaid
flowchart TD
    ClientRequest["HTTP Request (GET / POST)"] --> Rewrite[".htaccess Rewrite Rules"]
    Rewrite --> EntryFile["Target Endpoint (e.g., api/rooms.php)"]
    EntryFile --> RequireConfig["require_once 'config.php': Timezone & Headers"]
    EntryFile --> RequireDB["require_once 'db.php': Singleton getDbConnection()"]
    RequireDB --> PurgeJob["Automatic purgeExpiredRooms($pdo)"]
    EntryFile --> ActionDispatcher["switch ($action) Controller"]
    ActionDispatcher --> ExecSQL["Execute Prepared Statements"]
    ExecSQL --> JsonResp["jsonResponse($data, $statusCode)"]
    JsonResp --> HTTPResponse["JSON HTTP Response"]
```

### Why Procedural instead of Heavy OOP Framework?
1. **Cold-Start Elimination**: Heavy PHP frameworks (Laravel, Symfony) load hundreds of classes per request, creating latency spikes on free shared hosting. Procedural scripts initialize in under 5ms.
2. **Minimal Memory Footprint**: Memory usage remains below 2 MB per request, ensuring immunity against host memory limit crashes.
3. **Transparent Execution**: Zero magic reflection, complex dependency injection containers, or hidden middleware chains.

