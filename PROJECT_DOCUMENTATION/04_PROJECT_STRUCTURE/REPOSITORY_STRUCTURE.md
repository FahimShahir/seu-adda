---
title: "Repository File & Directory Structure"
document_id: "DOC-STR-001"
category: "Project Structure"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/"
  - "api/"
dependencies:
  - "DOC-ROOT-001"
---

# Repository File & Directory Structure

```text
d:/seu_adda/
│
├── .github/
│   └── workflows/
│       └── deploy.yml              # Automated GitHub Actions deployment pipeline
│
├── api/                            # Backend PHP source directory
│   ├── config.php                  # Database configuration and CORS headers
│   ├── db.php                      # PDO connection factory, auto-purge, and SQLite fallback
│   ├── rooms.php                   # Ephemeral room lifecycle and participant management
│   ├── messages.php                # Fast chat polling, dispatch, and auto-healing
│   ├── confessions.php             # Campus confession wall REST endpoints
│   ├── stats.php                   # Campus statistics and cheers counter endpoints
│   └── schema.sql                  # MySQL and SQLite DDL schema and initial seeds
│
├── public/                         # Public static assets bundled into build root
│   ├── .htaccess                   # Apache URL rewriting and CORS configuration
│   ├── api/                        # Mirrored PHP backend for web root deployment
│   │   ├── config.php
│   │   ├── db.php
│   │   ├── rooms.php
│   │   ├── messages.php
│   │   ├── confessions.php
│   │   ├── stats.php
│   │   └── schema.sql
│   └── images/                     # Static artwork and developer profile images
│       ├── campus-day.jpg          # Daylight campus illustration
│       ├── campus-night.jpg        # Nighttime campus illustration
│       └── developer.jpg           # Profile photo of Fahim Shahir
│
├── src/                            # Frontend TypeScript & React application source
│   ├── main.tsx                    # React application entrypoint
│   ├── App.tsx                     # Top-level state coordinator and layout
│   ├── index.css                   # Global Tailwind imports and custom animations
│   │
│   ├── types/                      # Domain interfaces and type definitions
│   │   └── room.ts                 # AddaRoom, RoomParticipant, ChatMessage, CampusCharacter
│   │
│   ├── data/                       # Static datasets and dialogue dictionaries
│   │   ├── dialogues.ts            # Hundreds of mood-filtered Bengali campus dialogues
│   │   └── playlists.ts            # Curated campus YouTube playlists and themes
│   │
│   ├── hooks/                      # Custom business logic and state hooks
│   │   ├── useAddaRoom.ts          # Ephemeral private room orchestrator (MQTT & PHP)
│   │   ├── useYouTubePlayer.ts     # Headless YouTube IFrame API controller
│   │   ├── useAmbientAudio.ts      # Web Audio API rain sound and guitar chord strums
│   │   ├── usePresenceAndConfessions.ts # Global presence counter and memory wall
│   │   └── useDhakaClockAndWeather.ts  # Live Dhaka time (UTC+6) and weather status
│   │
│   └── components/                 # Reusable UI component modules
│       ├── UI/
│       │   └── HeaderBar.tsx       # Navigation header, clock, mood selector, room badge
│       ├── Scene/
│       │   ├── CampusScene.tsx     # Interactive canvas container with 18 hotspots
│       │   ├── CharacterBubble.tsx # Local speech bubble for campus dialogues
│       │   ├── LiveRoomSpeechBubble.tsx # Remote speech bubble for live room chat
│       │   └── RainCanvas.tsx      # Procedural HTML5 Canvas rain animation
│       ├── Audio/
│       │   ├── PlayerControls.tsx  # Glassmorphism audio player toolbar
│       │   └── PlaylistModal.tsx   # Playlist drawer and custom song input
│       ├── Room/
│       │   ├── PrivateRoomModal.tsx# Room creation, join form with character lock, and history
│       │   └── FloatingRoomChatBar.tsx # Compact floating bottom chat dock
│       └── Community/
│           ├── ConfessionModal.tsx # Anonymous student confession board
│           ├── PhotoCardModal.tsx  # Social memory photo card generator
│           └── DeveloperModal.tsx  # Developer portfolio & bKash alumni support
│
├── .gitignore                      # Git ignored files and directories
├── .htaccess                       # Root Apache configuration
├── index.html                      # HTML5 single-page application host document
├── package.json                    # Project dependencies and build scripts
├── package-lock.json               # Deterministic dependency lockfile
├── postcss.config.js               # PostCSS transformation configuration
├── tailwind.config.js              # Tailwind CSS utility, color, and keyframe config
├── tsconfig.json                   # TypeScript compiler configuration (App)
├── tsconfig.node.json              # TypeScript compiler configuration (Vite tooling)
├── vite.config.ts                  # Vite bundler configuration
│
├── PROJECT_DOCUMENTATION/          # Complete architectural knowledge base
├── seu_adda_infinityfree.zip       # Ready-to-upload package for InfinityFree Monsta FTP
└── seu_adda_source_code.zip        # Complete source code archive
```

