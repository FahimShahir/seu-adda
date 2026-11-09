---
title: "Troubleshooting & Incident Diagnostic Manual"
document_id: "DOC-OPS-102"
category: "Operations & Maintenance"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/db.php"
  - "src/hooks/useAddaRoom.ts"
dependencies:
  - "DOC-OPS-101"
---

# Troubleshooting & Incident Diagnostic Manual

| Symptom | Probable Cause | Diagnostic Command / Step | Resolution Procedure |
|---|---|---|---|
| **Audio does not play on mobile** | Mobile browser blocked autoplay without user gesture | Click audio status pill or play button | Click *"গান শুনুন 🎶"* to trigger user gesture. |
| **Chat fails to deliver on InfinityFree** | Timezone mismatch or dropped room row | Check Network tab for `messages.php?action=send` | Verify auto-healing code in `messages.php`; verify UTC in `config.php`. |
| **Cannot join room (All characters locked)** | Room has reached maximum capacity (18/18) | Inspect participant count in modal | Wait for room expiration or create a new room. |
| **Site shows 404 on InfinityFree** | Missing `.htaccess` file in `htdocs/` | Check Monsta FTP file list | Ensure `.htaccess` is uploaded to `htdocs/`. |
| **GitHub Actions deployment failed with 400** | Concurrent deployment conflict with `npx gh-pages` | Check Actions log for `due to in progress deployment` | Wait 60s and re-trigger workflow or push empty trigger commit. |

