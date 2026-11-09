---
title: "Design System, Glassmorphism & UI Tokens"
document_id: "DOC-FE-007"
category: "Frontend & UI Architecture"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "tailwind.config.js"
  - "src/index.css"
dependencies:
  - "DOC-FE-001"
---

# Design System, Glassmorphism & UI Tokens

## 1. Color Palette Tokens

- **Slate Core**: `bg-slate-950` (Deep nighttime backdrop), `bg-slate-900/95` (Glassmorphism card backgrounds).
- **Amber Glow**: `text-amber-300`, `border-amber-500/50` (Warm tea warmth, acoustic vibes, campus highlights).
- **Emerald Accent**: `bg-emerald-500`, `text-emerald-400` (Online presence, success toasts, verified status).
- **bKash Pink**: `#E2136E` (Alumni Corner card gradient, bKash action buttons, personal support badges).
- **Danger / Locked Red**: `bg-red-500/20`, `text-red-300`, `border-red-500/40` (Locked avatars, leave room warnings).

---

## 2. Glassmorphism Design Pattern

All floating UI elements (header bar, player dock, modal dialogs, speech bubbles) utilize modern glassmorphism styling:
- **Backdrop Filter**: `backdrop-blur-md` or `backdrop-blur-xl`.
- **Translucent Fill**: `bg-slate-900/80` or `bg-slate-950/90`.
- **Delicate Border**: `border border-white/10` or `border-pink-500/30`.
- **Subtle Elevation**: `shadow-2xl shadow-black/50`.
- **Typography**: Google Font **Hind Siliguri** (`'Hind Siliguri', sans-serif`) with fallback to sans-serif.

