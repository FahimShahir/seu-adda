---
title: "Functional Requirements Specification"
document_id: "DOC-FND-004"
category: "Project Foundation"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/App.tsx"
  - "src/hooks/useAddaRoom.ts"
  - "src/components/Room/PrivateRoomModal.tsx"
dependencies:
  - "DOC-FND-003"
---

# Functional Requirements Specification

## 1. Interactive Campus Scene (FR-01)
- **FR-01.1**: The system shall render an illustrative campus scene with 18 distinct interactive student hotspots.
- **FR-01.2**: Clicking any unoccupied character shall display a dialogue speech bubble relevant to the active mood filter.
- **FR-01.3**: Clicking the central acoustic guitarist shall initiate song playback and trigger acoustic guitar chord sound effects.
- **FR-01.4**: Clicking the central red tea cup shall trigger a steam animation and increment the campus cheers counter.

## 2. Headless Audio Player (FR-02)
- **FR-02.1**: The system shall play curated campus playlists via a hidden YouTube IFrame.
- **FR-02.2**: The player shall support Play, Pause, Next Track, Previous Track, Volume adjustment, and Playlist selection.
- **FR-02.3**: The player shall broadcast audio state changes to active room participants in under 2 seconds.

## 3. Ephemeral Private Adda Rooms (FR-03)
- **FR-03.1**: Any user shall be able to create a private room with a generated 8-character ID (e.g., `SEU-TYXJ`).
- **FR-03.2**: A room shall have an exact time-to-live (TTL) of 120 minutes (2 hours) from creation.
- **FR-03.3**: The room creator (Host) shall be able to share the room via direct link (`?room=ID`) or copyable code.
- **FR-03.4**: When a guest joins, the system shall strictly verify character availability and lock taken characters with a red `🔒 [User Name]` badge.
- **FR-03.5**: If a guest requests an occupied character, the system shall automatically reassign them to an available character.
- **FR-03.6**: Chat messages sent in a room shall render as speech bubbles over the sender's character avatar for 30 seconds and be stored in the room's chat history.

## 4. Campus Confessions & Community (FR-04)
- **FR-04.1**: Students shall be able to submit anonymous campus confessions with author nickname, department, batch, and message text.
- **FR-04.2**: Users shall be able to like confessions with immediate atomic counter increment.

## 5. Developer & Alumni Corner (FR-05)
- **FR-05.1**: The system shall display developer details for Fahim Shahir (CSE, SEU) with social links (GitHub, LinkedIn, Facebook, WhatsApp, Email).
- **FR-05.2**: The system shall provide a 1-click bKash Personal number copy button (`01969091751`) with visual toast confirmation.

