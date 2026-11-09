---
title: "Non-Functional Requirements Specification"
document_id: "DOC-FND-005"
category: "Project Foundation"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/hooks/useAddaRoom.ts"
  - "api/db.php"
dependencies:
  - "DOC-FND-004"
---

# Non-Functional Requirements Specification

## 1. Performance & Latency (NFR-01)
- **NFR-01.1 Real-Time Synchronization**: On GitHub Pages (MQTT mode), state events must deliver within 500ms. On InfinityFree (PHP mode), chat polling must not exceed 1,600ms and room state polling must not exceed 2,000ms.
- **NFR-01.2 Bundle Size Budget**: Production client assets must remain compact (JS bundle under 850 KB uncompressed / 250 KB gzipped; CSS under 50 KB uncompressed).
- **NFR-01.3 Fluid Frame Rate**: Canvas rain and confetti animations must sustain 60 FPS on standard modern desktop and mobile browsers.

## 2. Reliability & Availability (NFR-02)
- **NFR-02.1 Auto-Healing Room Persistence**: In PHP mode, if an active room record is deleted due to database clock drift, the incoming message endpoint must automatically regenerate the room with 2-hour TTL to prevent dropped chat messages.
- **NFR-02.2 Local SQLite Fallback**: If the remote MySQL database connection drops or is unreachable during local development, the PHP backend must seamlessly fall back to a local SQLite database (`seu_adda_local.db`).
- **NFR-02.3 Inactivity Grace Period**: The backend participant purge must maintain a 300-second (5-minute) threshold to prevent false participant kickouts during mobile lock screen transitions.

## 3. Usability & Accessibility (NFR-03)
- **NFR-03.1 Zero Scrollbar Drag Navigation**: On mobile screens, users must be able to pan the campus landscape via natural touch dragging without native browser horizontal scrollbars disrupting the UI.
- **NFR-03.2 Responsive Screen Adaptation**: All modal dialogues, controls, and speech bubbles must scale gracefully from small mobile devices (320px width) up to 4K displays.
- **NFR-03.3 Bengali Typography**: All text must render with clean, readable Bengali fonts with correct conjunct character rendering.

## 4. Security & Data Protection (NFR-04)
- **NFR-04.1 SQL Injection Immunity**: All database queries must use prepared statements with parameterized inputs via PDO.
- **NFR-04.2 Ephemeral Data Minimization**: Chat messages and participant entries must be permanently expunged upon room expiration (maximum 2 hours retention).

