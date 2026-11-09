---
title: "Build Pipeline & Deployment Guide"
document_id: "DOC-OPS-004"
category: "Infrastructure & Deployment"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "package.json"
  - ".github/workflows/deploy.yml"
dependencies:
  - "DOC-OPS-003"
---

# Build Pipeline & Deployment Guide

## 1. Production Build Pipeline

```bash
npm run build
```
- **Step 1: TypeScript Typecheck (`tsc`)**: Executes strict static analysis. If any type discrepancy exists, build aborts with code 1.
- **Step 2: Vite Bundle (`vite build`)**: Compiles JSX/TSX into minified ESM chunks in `dist/assets/`, processes Tailwind utility classes, and copies `public/` directory into `dist/`.

---

## 2. Deploying to GitHub Pages

1. **Automated (Preferred)**:
   - Push commit to `main` branch. GitHub Actions `.github/workflows/deploy.yml` builds and publishes automatically within 45 seconds.
2. **Manual CLI**:
   ```bash
   npx gh-pages -d dist
   ```

---

## 3. Deploying to InfinityFree (`seuadda.free.nf`)

1. Build the production package and ensure `seu_adda_infinityfree.zip` is generated using POSIX forward slashes (`/`).
2. Log in to the InfinityFree Control Panel.
3. Open **File Manager** (Monsta FTP).
4. Navigate into the **`htdocs/`** directory.
5. Upload `seu_adda_infinityfree.zip`.
6. Right-click the uploaded zip file and select **Extract**.
7. Delete the uploaded zip file from the server.
8. The site is instantly live at `https://seuadda.free.nf/`!

