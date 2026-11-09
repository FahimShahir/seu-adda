---
title: "Backup & Restoration Protocol"
document_id: "DOC-OPS-008"
category: "Infrastructure & Deployment"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/schema.sql"
dependencies:
  - "DOC-OPS-007"
---

# Backup & Restoration Protocol

## 1. Automated Python Zip Packaging

Archive packaging is automated using Python (`zipfile`) to guarantee that all archive paths use POSIX forward slashes (`/`), preventing directory path extraction errors on Linux-based InfinityFree servers:

```python
with zipfile.ZipFile('seu_adda_infinityfree.zip', 'w', zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk('infinityfree_package'):
        for file in files:
            if file.endswith('.db') or file.endswith('.sqlite'): continue
            file_path = os.path.join(root, file)
            rel_path = os.path.relpath(file_path, 'infinityfree_package').replace('\\', '/')
            zf.write(file_path, rel_path)
```
SQLite `.db` files are strictly excluded from the production package.

