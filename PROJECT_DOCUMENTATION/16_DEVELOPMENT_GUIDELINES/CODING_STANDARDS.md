---
title: "Coding Standards & Style Guide"
document_id: "DOC-DEV-001"
category: "Development Guidelines"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "tsconfig.json"
dependencies:
  - "DOC-ROOT-001"
---

# Coding Standards & Style Guide

## 1. TypeScript & React 19 Guidelines

1. **Strict Type Safety**: Never use `any` unless interoperating with untyped third-party browser APIs (e.g., `window.YT`). Define domain interfaces in `src/types/room.ts`.
2. **Explicit Dependency Arrays**: In `useEffect` and `useCallback`, list all referenced props and state variables explicitly.
3. **Bengali Language Integrity**: Keep all user-facing strings in warm, colloquial Bengali. Never replace Bengali UI text with generic English.
4. **Clean Tailwind Classes**: Prefer standard Tailwind utility classes. Use `clsx` or `tailwind-merge` when conditionally composing class strings.

---

## 2. PHP Backend Standards

1. **Strict Prepared Statements**: Never concatenate variables into SQL query strings. Always use PDO parameter binding.
2. **Universal UTC Timezone**: Always calculate dates using UTC (`gmdate('Y-m-d H:i:s')`, `NOW()`). Never rely on host server default timezones.
3. **Clean POSIX Slashes**: When creating zip archives for deployment, always normalize directory paths to forward slashes (`/`).

