---
title: "Performance Architecture & Resource Budget"
document_id: "DOC-PERF-001"
category: "Performance & Reliability"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "vite.config.ts"
  - "src/index.css"
dependencies:
  - "DOC-ARCH-001"
---

# Performance Architecture & Resource Budget

## 1. Asset & Bandwidth Budget

- **JavaScript Assets**: Single optimized ESM chunk (`index-bHZs_lpc.js` ~241 KB gzip).
- **CSS Assets**: Single unified Tailwind stylesheet (`index-BDaA3Dsx.css` ~8.2 KB gzip).
- **Images**: High-efficiency progressive JPEGs for campus illustrations.
- **Font Delivery**: Embedded Google Font *Hind Siliguri* with `font-display: swap` to prevent FOIT (Flash of Invisible Text).

## 2. Rendering Optimization
- **Canvas Rain**: Executes inside `requestAnimationFrame` loop with particle reuse, sustaining a steady 60 FPS without garbage collection stutter.
- **Audio Decoding**: Web Audio API generates rain ambience using procedural mathematical white-noise oscillators with low-pass biquad filters, consuming zero network bandwidth for audio files.

