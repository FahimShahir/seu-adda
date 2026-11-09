---
title: "Common Development Mistakes & Anti-Patterns"
document_id: "DOC-DEV-005"
category: "Development Guidelines"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/hooks/useAddaRoom.ts"
dependencies:
  - "DOC-DEV-004"
---

# Common Development Mistakes & Anti-Patterns

## 1. Top 5 Pitfalls to Avoid

1. **Using Windows Backslashes in Zip Files**:
   - *Mistake*: Generating `seu_adda_infinityfree.zip` with PowerShell `Compress-Archive`.
   - *Impact*: Linux-based InfinityFree Monsta FTP creates literal filenames with backslashes (`api\rooms.php`), completely breaking HTTP routing.
   - *Fix*: Always package using POSIX forward slashes (`/`).
2. **Hardcoding Non-UTC Timezones in PHP**:
   - *Mistake*: Using `date('Y-m-d H:i:s')` without `date_default_timezone_set('UTC')`.
   - *Impact*: Server timezone offset (e.g. UTC-5) causes rooms to be marked expired immediately on creation!
   - *Fix*: Always use UTC everywhere.
3. **Bundling SQLite `.db` Files to InfinityFree**:
   - *Mistake*: Uploading local testing `seu_adda_local.db` to production.
   - *Impact*: Overwrites or interferes with remote MySQL connection.
   - *Fix*: Always exclude `*.db` and `*.sqlite` files from production archives.
4. **Bypassing Character Exclusivity Locks**:
   - *Mistake*: Allowing a user to force an occupied character ID in join requests.
   - *Impact*: Two users end up on the same avatar coordinates on screen.
   - *Fix*: Enforce live UI lock and server reassignment.
5. **Replacing Bengali UI Strings with Generic English**:
   - *Mistake*: Changing Bengali buttons to English.
   - *Impact*: Destroys the cultural and emotional essence of the platform.

