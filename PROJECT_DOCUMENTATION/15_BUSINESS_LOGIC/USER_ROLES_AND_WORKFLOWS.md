---
title: "User Journeys, Roles & Monetization Model"
document_id: "DOC-BIZ-002"
category: "Business Logic & Product Rules"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/components/Community/DeveloperModal.tsx"
dependencies:
  - "DOC-BIZ-001"
---

# User Journeys, Roles & Monetization Model

## 1. User Journeys Walkthrough

```mermaid
journey
    title Typical Student Adda Journey
    section Entering Campus
      Visit seuadda.free.nf: 5: Student
      Listen to Campus Song: 5: Student
      Tap campus characters for dialogues: 4: Student
    section Starting Adda Room
      Click "নতুন রুম খুলুন": 5: Host
      Choose Avatar (Rahat): 5: Host
      Copy Room Link & Send on WhatsApp: 5: Host
    section Friends Joining
      Friend clicks link on mobile: 5: Guest
      Joins room with unique avatar: 5: Guest
      Same music starts playing on friend's phone: 5: Guest
      Chat messages float as speech bubbles: 5: Host, Guest
    section Wrapping Up
      Generate Campus Photo Card: 4: Host, Guest
      Click developer bKash to buy tea: 5: Host
```

## 2. Micro-Treat bKash Support Model

The Alumni Corner features 4 distinct coffee micro-treat tiers:
- `চা ২০৳`: Basic campus appreciation.
- `দুধ চা ৫০৳`: Friendly alumni treat.
- `কফি ১০০৳`: Premium coffee treat.
- `স্পনসর ২০০৳+`: Platform server and domain sponsor.
Clicking any tier copies the bKash personal number (`01969091751`) and bursts colorful confetti.

