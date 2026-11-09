---
title: "Project Objectives & Strategic Goals"
document_id: "DOC-FND-002"
category: "Project Foundation"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "README.md"
dependencies:
  - "DOC-FND-001"
---

# Project Objectives & Strategic Goals

## 1. Technical Objectives

1. **Dual-Deployment Operational Resilience**:
   - Achieve 100% operational feature parity across two distinct deployment environments:
     - **Static Cloud**: GitHub Pages via MQTT WebSockets.
     - **Dynamic Full-Stack**: InfinityFree via PHP 8.x + MySQL 8.x with local SQLite 3 automatic fallback.
2. **Sub-2-Second State Synchronization**:
   - Deliver room song changes, chat messages, and character state updates across geographically distributed mobile and desktop browsers within 1.6 to 2.0 seconds without requiring paid server infrastructure.
3. **Strict Zero-Collision Character Allocation**:
   - Enforce an invariant where no two users in the same room can select or hold the same campus avatar at any point during a 2-hour session.
4. **Low-Overhead Background Audio Streaming**:
   - Deliver uninterrupted background radio and synced audio using the headless YouTube IFrame API without intrusive video players cluttering the screen.

---

## 2. Practical & Community Objectives

1. **Zero Registration Barrier**:
   - Enable instantaneous access with zero passwords, phone numbers, or email signups.
2. **True Cross-Platform Mobile Experience**:
   - Support fluid touch drag-scrolling on mobile devices without broken horizontal scrollbars or clipped interactive buttons.
3. **Preservation of Campus Heritage**:
   - Immortalize the unique campus slang, departments, and memory spots of Southeast University in digital form.

