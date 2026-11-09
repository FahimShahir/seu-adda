---
title: "User Interaction Flows & Behavioral Sequences"
document_id: "DOC-FE-009"
category: "Frontend & UI Architecture"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/App.tsx"
  - "src/components/Scene/CampusScene.tsx"
dependencies:
  - "DOC-FE-008"
---

# User Interaction Flows & Behavioral Sequences

## 1. Campus Character Tap Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Scene as CampusScene
    participant Audio as useAmbientAudio
    participant Bubble as CharacterBubble

    User->>Scene: Taps Character Avatar (e.g., Rahat)
    alt Character is Central Guitarist
        Scene->>Audio: playGuitarStrum()
        Scene->>Scene: Toggles YouTube Radio Playback
    else Character is Normal Student
        Scene->>Scene: Picks random dialogue for character from dialogues[currentMood]
        Scene->>Bubble: Mounts speech bubble over character coordinates
        Bubble->>Bubble: Auto-fades after 6 seconds
    end
```

## 2. Red Tea Cheers Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Scene as CampusScene
    participant Confetti as canvas-confetti
    participant Stats as /api/stats.php

    User->>Scene: Clicks steaming Red Tea Cup
    Scene->>Confetti: Triggers celebratory gold/amber confetti burst
    Scene->>Stats: POST action=cheers (atomic counter increment)
    Stats-->>Scene: Returns new cheers_count
    Scene->>Scene: Updates header cheers badge with count
```

