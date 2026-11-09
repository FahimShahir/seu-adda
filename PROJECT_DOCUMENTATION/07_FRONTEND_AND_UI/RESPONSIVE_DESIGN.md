---
title: "Responsive Design, Mobile Viewports & Touch Handling"
document_id: "DOC-FE-008"
category: "Frontend & UI Architecture"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/components/Scene/CampusScene.tsx"
dependencies:
  - "DOC-FE-007"
---

# Responsive Design, Mobile Viewports & Touch Handling

## 1. Zero-Scrollbar Touch Drag Pan (`CampusScene.tsx`)

To deliver an immersive mobile gaming feel without ugly browser scrollbars:
- The campus artwork renders at `min-w-[1280px]` or scaled aspect ratio.
- The outer viewport applies `overflow-hidden select-none`.
- Touch drag logic tracks touch start and movement deltas:
  ```typescript
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const currentX = e.touches[0].clientX;
    const walk = (currentX - startXRef.current) * 1.5;
    containerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };
  ```
- Result: Users smoothly pan across the campus courtyard with their finger on phones and tablets.

## 2. Modal Viewport Safe Areas
- Modals use `max-h-[90vh]` and `overflow-y-auto` with styled translucent scrollbars (`scrollbar-thin`).
- Floating chat input bar floats `bottom-20 sm:bottom-24` above the player controls so they never occlude one another.

