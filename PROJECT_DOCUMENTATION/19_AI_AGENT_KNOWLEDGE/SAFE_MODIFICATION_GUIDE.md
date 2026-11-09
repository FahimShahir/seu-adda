---
title: "Safe Modification Guide & Feature Workflow"
document_id: "DOC-AGT-005"
category: "AI Agent Knowledge"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/App.tsx"
dependencies:
  - "DOC-AGT-003"
---

# Safe Modification Guide & Feature Workflow

## 1. How to Safely Modify Frontend Code

1. Before modifying a component, inspect its props and state interactions in `src/App.tsx`.
2. Do not introduce large UI libraries (Material UI, Ant Design, Bootstrap). Keep all styling in Tailwind CSS.
3. Test every UI modification on both Desktop (1920x1080) and Mobile (375x667).
4. Run `npx tsc --noEmit` and `npm run build` after editing.

## 2. How to Safely Modify Backend Code

1. Edit files in BOTH `api/` and `public/api/` (or copy from `public/api/` to `dist/api/`).
2. Always test database queries against prepared statements.
3. Keep response formats aligned with the standard `{ "success": true, ... }` envelope.
4. Verify changes using `php -S localhost:8080 -t dist` or by testing against InfinityFree.

