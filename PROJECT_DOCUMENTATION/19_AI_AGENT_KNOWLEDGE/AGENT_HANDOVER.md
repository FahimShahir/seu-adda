---
title: "Official AI Agent Handover Document"
document_id: "DOC-AGT-008"
category: "AI Agent Knowledge"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "PROJECT_DOCUMENTATION/"
dependencies:
  - "DOC-AGT-007"
---

# Official AI Agent Handover Document

## 1. Executive Handover Summary

To the incoming AI Agent:

You are inheriting **SEU Adda**, a high-performance, culturally resonant, dual-deployment virtual campus platform.

The repository is in a **pristine, fully verified production state**:
1. **GitHub Pages (Static + MQTT)**: Live at `https://fahimshahir.github.io/seu-adda/`.
2. **InfinityFree (PHP + MySQL)**: Live at `https://seuadda.free.nf/` (packaged in `seu_adda_infinityfree.zip`).
3. **Character Exclusivity**: 100% enforced across UI, hotspot clicks, and server reassignments.
4. **Chat Resilience**: Auto-healing database recovery active in `api/messages.php`.
5. **Knowledge Base**: Completely codified in `PROJECT_DOCUMENTATION/`.

---

## 2. Mandatory Rules for the Next Agent

- **Always verify before assuming**: Check `src/` and `api/` directly.
- **Preserve Bengali UI**: Do not change Bengali dialogues or labels to English.
- **Maintain Invariants**: Follow [`19_AI_AGENT_KNOWLEDGE/CRITICAL_IMPLEMENTATION_RULES.md`](./CRITICAL_IMPLEMENTATION_RULES.md) strictly.
- **Keep Documentation Updated**: Whenever modifying architecture, append an entry to `CHANGELOG.md` and update affected docs.

