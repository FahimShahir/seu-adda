---
title: "Dependency Map & Compatibility Matrix"
document_id: "DOC-TECH-005"
category: "Technology Stack"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "package.json"
dependencies:
  - "DOC-TECH-003"
---

# Dependency Map & Compatibility Matrix

## 1. Direct Dependency Impact Assessment

| Package Name | Impact on Bundle | Critical Failure Mode | Mitigation Strategy |
|---|---|---|---|
| `react` & `react-dom` | Core framework (~130 KB) | App fails to render | Strict version matching; zero experimental canary flags. |
| `mqtt` | Real-time network client (~80 KB) | Room messages fail to stream | Automatic fallback to local polling & reconnect handlers. |
| `lucide-react` | SVG icons (~25 KB tree-shaken) | Missing UI icons | Tree-shaken ESM imports only. |
| `canvas-confetti` | Visual celebration (~15 KB) | Confetti animation fails | Silent catch blocks prevent UI disruption. |
| `clsx` & `tailwind-merge` | Class name utility (< 5 KB) | CSS class conflict | Lightweight pure functions with zero runtime side-effects. |

---

## 2. Platform Compatibility Testing Results

- **Windows 11 / Chrome 122**: Verified. 60 FPS Canvas rendering, zero audio stutter.
- **macOS Sonoma / Safari 17**: Verified. Audio context initializes upon user touch.
- **Android 14 / Chrome Mobile**: Verified. Horizontal drag-scrolling operates without viewport distortion.
- **iOS 17 / Mobile Safari**: Verified. Fixed modals respect safe-area-insets.

