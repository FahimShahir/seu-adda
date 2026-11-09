---
title: "UI Component Catalog & Responsibilities"
document_id: "DOC-FE-002"
category: "Frontend & UI Architecture"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/components/"
dependencies:
  - "DOC-FE-001"
---

# UI Component Catalog & Responsibilities

| Component | Path | Key Props | Primary Responsibility |
|---|---|---|---|
| `HeaderBar` | `src/components/UI/HeaderBar.tsx` | `onlineCount, cheersCount, dhakaTime, weather, isNight, isRain, currentMood, activeRoom, timeRemaining` | Top navigation bar with live stats, time, mood pills, and modal open buttons. |
| `CampusScene` | `src/components/Scene/CampusScene.tsx` | `isNight, isRain, activeRoom, currentUserId, currentMood, activeSpeechBubbles, onHotspotClick, onCheers` | Renders campus backdrop, 18 hotspots, drag-to-scroll container, and speech bubbles. |
| `PlayerControls` | `src/components/Audio/PlayerControls.tsx` | `playerState, activeRoom, onTogglePlay, onNext, onPrev, onSetVolume, onOpenPlaylist` | Bottom player dock showing active song, play controls, and room sync badge. |
| `FloatingRoomChatBar` | `src/components/Room/FloatingRoomChatBar.tsx` | `activeRoom, currentUser, onSendMessage, onOpenRoomModal` | Compact floating chat input bar active during private room sessions. |
| `PrivateRoomModal` | `src/components/Room/PrivateRoomModal.tsx` | `isOpen, onClose, activeRoom, timeRemaining, currentUser, onCreateRoom, onJoinRoom, onLeaveRoom` | Room management window with live taken character locking and room sharing. |
| `ConfessionModal` | `src/components/Community/ConfessionModal.tsx` | `isOpen, onClose, confessions, onAddConfession, onLikeConfession` | Campus confession submission drawer with like interaction. |
| `PhotoCardModal` | `src/components/Community/PhotoCardModal.tsx` | `isOpen, onClose, campusStats` | Interactive canvas photo card generator with download button. |
| `DeveloperModal` | `src/components/Community/DeveloperModal.tsx` | `isOpen, onClose` | Developer bio, social links, and bKash micro-treat copy actions. |

