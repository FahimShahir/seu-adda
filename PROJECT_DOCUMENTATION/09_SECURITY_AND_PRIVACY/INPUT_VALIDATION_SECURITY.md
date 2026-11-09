---
title: "Input Validation, Data Protection & Risk Assessment"
document_id: "DOC-SEC-004"
category: "Security & Privacy"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/db.php"
  - "api/messages.php"
dependencies:
  - "DOC-SEC-001"
---

# Input Validation, Data Protection & Risk Assessment

## 1. Input Sanitization Safeguards

- **Prepared Statements**: All database operations in `rooms.php`, `messages.php`, `confessions.php`, and `stats.php` pass user values strictly through PDO parameter bindings.
- **HTML Injection Defense**: User chat strings are never passed to raw HTML sinks (`innerHTML`). React JSX renders text as text nodes, neutralizing `<script>` tags, event handlers (`onerror`), or CSS injection.

## 2. Data Protection & Privacy Guarantees

- **No Personally Identifiable Information (PII)**: No student ID numbers, emails, passwords, or phone numbers are ever requested or stored.
- **Physical Expiration**: Expired rooms, participant logs, and chat messages are permanently deleted via SQL `DELETE` queries, leaving no historical traces.

## 3. Security Findings & Recommendations

| Finding ID | Severity | Affected Area | Description & Remediation |
|---|---|---|---|
| **SEC-001** | `LOW` | `api/config.php` | Remote database credentials reside in PHP source. *Remediation*: Use environment variables (`getenv('DB_PASS')`) in production where available. |
| **SEC-002** | `INFORMATIONAL`| MQTT Broker | Public EMQX broker is open. Anyone with the room ID can listen. *Status*: Mitigated by random room code entropy and ephemerality. |

