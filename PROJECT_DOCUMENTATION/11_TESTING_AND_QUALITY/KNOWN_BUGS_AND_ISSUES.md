---
title: "Known Issues, Regressions & Resolution Registry"
document_id: "DOC-QA-004"
category: "Testing & Quality Assurance"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "CHANGELOG.md"
dependencies:
  - "DOC-QA-003"
---

# Known Issues, Regressions & Resolution Registry

| Issue ID | Status | Root Cause | Implemented Resolution |
|---|---|---|---|
| **BUG-01** | 🟢 **RESOLVED** | Early room purge due to server timezone mismatch in `db.php`. | Harmonized all PHP timestamps and MySQL sessions to strict UTC (`SET time_zone = '+00:00'`). |
| **BUG-02** | 🟢 **RESOLVED** | Duplicate characters permitted in private rooms across multiple devices. | Implemented live taken-character polling with `🔒 [Name]` lock and server-side auto-reassignment. |
| **BUG-03** | 🟢 **RESOLVED** | Participant kickouts when phone screen locked or tab blurred for > 30s. | Increased participant inactivity grace period from 30s to 300s (5 minutes). |
| **BUG-04** | 🟢 **RESOLVED** | Artificial 1.2s delay in YouTube player before playing room songs. | Removed `setTimeout(1200)` and enabled instant broadcast on player buffering state. |
| **BUG-05** | 🟢 **RESOLVED** | Linux extraction failure of zip archive on InfinityFree Monsta FTP. | Converted all zip entry paths to POSIX forward slashes (`/`) using Python `zipfile`. |

