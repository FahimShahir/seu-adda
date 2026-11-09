---
title: "Configuration Files & Naming Conventions"
document_id: "DOC-STR-005"
category: "Project Structure"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "vite.config.ts"
  - "tailwind.config.js"
  - "tsconfig.json"
dependencies:
  - "DOC-STR-001"
---

# Configuration Files & Naming Conventions

## 1. Tooling & Server Configuration Files

- **`vite.config.ts`**: Configures `@vitejs/plugin-react` and sets `base: './'` for seamless relative asset resolution on both GitHub Pages subpaths and root domains.
- **`tailwind.config.js`**: Configures content scanning paths (`./index.html`, `./src/**/*.{js,ts,jsx,tsx}`) and defines custom font families (`Hind Siliguri`), animations (rain, steam, pulse, float), and glassmorphism styling.
- **`tsconfig.json`**: TypeScript compiler configuration enforcing `strict: true`, modern module resolution (`Bundler`), and DOM lib inclusion.
- **`public/.htaccess`**: Apache configuration configuring URL rewriting to `index.html` for single-page routing, enabling GZIP compression, and adding CORS access headers.

---

## 2. Established Naming Conventions

- **React Components**: PascalCase (e.g., `CampusScene.tsx`, `PrivateRoomModal.tsx`).
- **Custom React Hooks**: camelCase starting with `use` (e.g., `useAddaRoom.ts`, `useYouTubePlayer.ts`).
- **Data & Type Files**: camelCase (e.g., `dialogues.ts`, `playlists.ts`, `room.ts`).
- **PHP Endpoints**: lowercase nouns representing resources (e.g., `rooms.php`, `messages.php`, `stats.php`).
- **Database Tables**: lowercase snake_case plural nouns (e.g., `rooms`, `participants`, `messages`, `campus_stats`).
- **CSS / Tailwind Classes**: kebab-case standard Tailwind classes augmented with custom opacity and border shades (e.g., `bg-slate-900/95`, `border-[#E2136E]/50`).

