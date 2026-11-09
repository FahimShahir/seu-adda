---
title: "Development Workflow & Git Branching Strategy"
document_id: "DOC-DEV-002"
category: "Development Guidelines"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - ".github/workflows/deploy.yml"
dependencies:
  - "DOC-DEV-001"
---

# Development Workflow & Git Branching Strategy

## 1. Git Branching Model

- **`main`**: Production-ready branch. Every push to `main` triggers automated GitHub Actions deployment.
- **`gh-pages`**: Automated deployment target branch managed by `actions/deploy-pages@v4` or `npx gh-pages`. Do not commit directly to this branch.

## 2. Standard Feature Implementation Workflow

```mermaid
flowchart TD
    Task["1. Receive Task / Bug Report"] --> Inspect["2. Inspect Documentation & Source Code"]
    Inspect --> Plan["3. Create Implementation Plan"]
    Plan --> Edit["4. Implement Changes in src/ or api/"]
    Edit --> TypeCheck["5. Verify: npx tsc --noEmit (Must be 0 errors)"]
    TypeCheck --> Build["6. Build: npm run build"]
    Build --> MultiTab["7. Verify across multiple browser tabs"]
    MultiTab --> Package["8. Update seu_adda_infinityfree.zip & source zip"]
    Package --> Commit["9. Git Commit & Push to main"]
    Commit --> UpdateDocs["10. Update PROJECT_DOCUMENTATION/ & CHANGELOG.md"]
```

