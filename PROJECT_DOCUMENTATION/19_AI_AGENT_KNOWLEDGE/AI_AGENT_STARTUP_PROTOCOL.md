---
title: "AI Agent Startup Protocol & Operating Instructions"
document_id: "DOC-AGT-001"
category: "AI Agent Knowledge"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "PROJECT_DOCUMENTATION/README.md"
  - "PROJECT_DOCUMENTATION/AI_AGENT_START_HERE.md"
dependencies:
  - "DOC-ROOT-001"
---

# AI Agent Startup Protocol & Operating Instructions

> [!IMPORTANT]
> **DIRECTIVE FOR ANY SUBSEQUENT AI AGENT TAKING OVER THIS WORKSPACE**:
> This document governs your startup sequence. Do not jump straight to modifying code without completing these 7 mandatory steps.

---

## 1. The 7-Step Agent Startup Protocol

1. **Step 1: Check Working Tree & Health**:
   - Run `git status` to ensure working tree is clean.
   - Run `npx tsc --noEmit` to verify type safety.
2. **Step 2: Read Foundation & Invariant Rules**:
   - Read [`19_AI_AGENT_KNOWLEDGE/CRITICAL_IMPLEMENTATION_RULES.md`](./CRITICAL_IMPLEMENTATION_RULES.md).
   - Read [`19_AI_AGENT_KNOWLEDGE/DO_NOT_MODIFY_LIST.md`](./DO_NOT_MODIFY_LIST.md).
3. **Step 3: Understand the Dual-Deployment Switch**:
   - The application runs concurrently on GitHub Pages (MQTT Mode) and InfinityFree (PHP MySQL Mode). Any modification to room logic, music synchronization, or chat messaging **MUST** be implemented and tested for BOTH modes.
4. **Step 4: Respect Cultural Tone & Bengali Text**:
   - All client dialogues, character names, tooltips, buttons, error notices, and toast alerts are written in natural Bengali. Never convert Bengali text into generic English.
5. **Step 5: Enforce Character Exclusivity**:
   - The rule that *"no two users in the same room can hold the same character"* is a non-negotiable invariant. Always preserve the live UI lock, hotspot guard, and server auto-reassignment logic.
6. **Step 6: Follow the Build & POSIX Zip Rule**:
   - Always run `npm run build` after editing frontend files.
   - When generating `seu_adda_infinityfree.zip`, use Python's `zipfile` with `.replace('\\', '/')` to guarantee POSIX forward slashes.
7. **Step 7: Keep Documentation Synchronized**:
   - Any architectural modification must be updated in `PROJECT_DOCUMENTATION/` and recorded in `CHANGELOG.md`.

