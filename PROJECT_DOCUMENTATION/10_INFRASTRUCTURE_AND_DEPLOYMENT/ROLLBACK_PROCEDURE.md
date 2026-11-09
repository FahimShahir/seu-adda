---
title: "Step-by-Step Rollback Procedures"
document_id: "DOC-OPS-010"
category: "Infrastructure & Deployment"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - ".github/workflows/deploy.yml"
dependencies:
  - "DOC-OPS-008"
---

# Step-by-Step Rollback Procedures

## 1. Fast Rollback for GitHub Pages

If a deployment introduces a critical regression:
```bash
# 1. Identify previous commit hash
git log -3 --oneline

# 2. Revert the faulty commit
git revert <faulty_commit_hash> -m 1

# 3. Push to trigger automated GitHub Actions build
git push origin main
```
The site automatically updates to the previous working state within 60 seconds.

## 2. Fast Rollback for InfinityFree

If an upload breaks `seuadda.free.nf`:
1. Delete contents of `htdocs/` via Monsta FTP.
2. Upload the previous backup zip file.
3. Extract archive to restore working state.

