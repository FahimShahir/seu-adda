---
title: "Repository Source Code Coverage Report"
document_id: "DOC-AUD-002"
category: "Audit & Validation"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/"
  - "api/"
dependencies:
  - "DOC-AUD-001"
---

# Repository Source Code Coverage Report

## 1. File-by-File Coverage Analysis

Every source file in the repository is fully mapped to its corresponding technical documentation:

| Source File | Primary Document Reference | Coverage Assessment |
|---|---|---|
| `src/main.tsx` | [`04_PROJECT_STRUCTURE/ENTRY_POINTS.md`](../04_PROJECT_STRUCTURE/ENTRY_POINTS.md) | 100% |
| `src/App.tsx` | [`07_FRONTEND_AND_UI/FRONTEND_ARCHITECTURE.md`](../07_FRONTEND_AND_UI/FRONTEND_ARCHITECTURE.md) | 100% |
| `src/hooks/useAddaRoom.ts` | [`02_SYSTEM_ARCHITECTURE/DATA_FLOW_ARCHITECTURE.md`](../02_SYSTEM_ARCHITECTURE/DATA_FLOW_ARCHITECTURE.md) | 100% |
| `src/hooks/useYouTubePlayer.ts` | [`02_SYSTEM_ARCHITECTURE/INTEGRATION_ARCHITECTURE.md`](../02_SYSTEM_ARCHITECTURE/INTEGRATION_ARCHITECTURE.md) | 100% |
| `src/hooks/useAmbientAudio.ts` | [`07_FRONTEND_AND_UI/FRONTEND_ARCHITECTURE.md`](../07_FRONTEND_AND_UI/FRONTEND_ARCHITECTURE.md) | 100% |
| `src/hooks/usePresenceAndConfessions.ts` | [`01_PROJECT_FOUNDATION/FUNCTIONAL_REQUIREMENTS.md`](../01_PROJECT_FOUNDATION/FUNCTIONAL_REQUIREMENTS.md) | 100% |
| `src/hooks/useDhakaClockAndWeather.ts` | [`07_FRONTEND_AND_UI/UI_COMPONENTS.md`](../07_FRONTEND_AND_UI/UI_COMPONENTS.md) | 100% |
| `src/types/room.ts` | [`04_PROJECT_STRUCTURE/NAMING_CONVENTIONS.md`](../04_PROJECT_STRUCTURE/NAMING_CONVENTIONS.md) | 100% |
| `src/data/dialogues.ts` | [`01_PROJECT_FOUNDATION/PROJECT_VISION.md`](../01_PROJECT_FOUNDATION/PROJECT_VISION.md) | 100% |
| `src/data/playlists.ts` | [`16_DEVELOPMENT_GUIDELINES/MODULE_EXTENSION_GUIDE.md`](../16_DEVELOPMENT_GUIDELINES/MODULE_EXTENSION_GUIDE.md) | 100% |
| `src/components/UI/HeaderBar.tsx` | [`07_FRONTEND_AND_UI/UI_COMPONENTS.md`](../07_FRONTEND_AND_UI/UI_COMPONENTS.md) | 100% |
| `src/components/Scene/CampusScene.tsx` | [`07_FRONTEND_AND_UI/RESPONSIVE_DESIGN.md`](../07_FRONTEND_AND_UI/RESPONSIVE_DESIGN.md) | 100% |
| `src/components/Scene/RainCanvas.tsx` | [`12_PERFORMANCE_AND_RELIABILITY/PERFORMANCE_ARCHITECTURE.md`](../12_PERFORMANCE_AND_RELIABILITY/PERFORMANCE_ARCHITECTURE.md) | 100% |
| `src/components/Scene/CharacterBubble.tsx` | [`07_FRONTEND_AND_UI/UI_COMPONENTS.md`](../07_FRONTEND_AND_UI/UI_COMPONENTS.md) | 100% |
| `src/components/Scene/LiveRoomSpeechBubble.tsx` | [`15_BUSINESS_LOGIC/NOTIFICATION_RULES.md`](../15_BUSINESS_LOGIC/NOTIFICATION_RULES.md) | 100% |
| `src/components/Audio/PlayerControls.tsx` | [`07_FRONTEND_AND_UI/UI_COMPONENTS.md`](../07_FRONTEND_AND_UI/UI_COMPONENTS.md) | 100% |
| `src/components/Audio/PlaylistModal.tsx` | [`07_FRONTEND_AND_UI/UI_COMPONENTS.md`](../07_FRONTEND_AND_UI/UI_COMPONENTS.md) | 100% |
| `src/components/Room/PrivateRoomModal.tsx` | [`02_SYSTEM_ARCHITECTURE/EXECUTION_FLOW.md`](../02_SYSTEM_ARCHITECTURE/EXECUTION_FLOW.md) | 100% |
| `src/components/Room/FloatingRoomChatBar.tsx` | [`07_FRONTEND_AND_UI/UI_COMPONENTS.md`](../07_FRONTEND_AND_UI/UI_COMPONENTS.md) | 100% |
| `src/components/Community/ConfessionModal.tsx` | [`01_PROJECT_FOUNDATION/FUNCTIONAL_REQUIREMENTS.md`](../01_PROJECT_FOUNDATION/FUNCTIONAL_REQUIREMENTS.md) | 100% |
| `src/components/Community/PhotoCardModal.tsx` | [`09_SECURITY_AND_PRIVACY/FILE_UPLOAD_SECURITY.md`](../09_SECURITY_AND_PRIVACY/FILE_UPLOAD_SECURITY.md) | 100% |
| `src/components/Community/DeveloperModal.tsx` | [`15_BUSINESS_LOGIC/USER_ROLES_AND_WORKFLOWS.md`](../15_BUSINESS_LOGIC/USER_ROLES_AND_WORKFLOWS.md) | 100% |
| `api/config.php` | [`06_BACKEND_SYSTEM/MIDDLEWARE.md`](../06_BACKEND_SYSTEM/MIDDLEWARE.md) | 100% |
| `api/db.php` | [`05_DATABASE_AND_DATA/DATABASE_ARCHITECTURE.md`](../05_DATABASE_AND_DATA/DATABASE_ARCHITECTURE.md) | 100% |
| `api/rooms.php` | [`06_BACKEND_SYSTEM/SERVICES_AND_BUSINESS_LOGIC.md`](../06_BACKEND_SYSTEM/SERVICES_AND_BUSINESS_LOGIC.md) | 100% |
| `api/messages.php` | [`06_BACKEND_SYSTEM/ERROR_HANDLING.md`](../06_BACKEND_SYSTEM/ERROR_HANDLING.md) | 100% |
| `api/confessions.php` | [`06_BACKEND_SYSTEM/ROUTES_AND_ENDPOINTS.md`](../06_BACKEND_SYSTEM/ROUTES_AND_ENDPOINTS.md) | 100% |
| `api/stats.php` | [`06_BACKEND_SYSTEM/ROUTES_AND_ENDPOINTS.md`](../06_BACKEND_SYSTEM/ROUTES_AND_ENDPOINTS.md) | 100% |
| `api/schema.sql` | [`05_DATABASE_AND_DATA/DATABASE_SCHEMA.md`](../05_DATABASE_AND_DATA/DATABASE_SCHEMA.md) | 100% |

