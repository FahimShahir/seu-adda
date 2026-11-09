---
title: "Regression Prevention Checklist & Quality Assurance"
document_id: "DOC-AGT-006"
category: "AI Agent Knowledge"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "package.json"
dependencies:
  - "DOC-AGT-005"
---

# Regression Prevention Checklist & Quality Assurance

Before committing or reporting any task as complete, verify this regression checklist:

- [ ] **Typecheck**: Does `npx tsc --noEmit` pass with 0 errors?
- [ ] **Production Build**: Does `npm run build` succeed and generate `dist/` cleanly?
- [ ] **Character Lock**: In multi-tab mode, is a taken character locked with `🔒` and disabled for the joining user?
- [ ] **Chat Delivery**: Does sending a message trigger a speech bubble on both host and guest tabs?
- [ ] **Room Music**: Does changing a song switch audio on all connected devices?
- [ ] **POSIX Zip**: Does `seu_adda_infinityfree.zip` use standard `/` forward slashes with zero SQLite `.db` files?
- [ ] **Documentation**: Have `PROJECT_DOCUMENTATION/` and `CHANGELOG.md` been updated?

