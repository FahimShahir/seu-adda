---
title: "Infrastructure Topology & Deployment Overview"
document_id: "DOC-OPS-001"
category: "Infrastructure & Deployment"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - ".github/workflows/deploy.yml"
  - "package.json"
dependencies:
  - "DOC-ARCH-001"
---

# Infrastructure Topology & Deployment Overview

## 1. Multi-Target Infrastructure Topology

```mermaid
flowchart TD
    Repo["GitHub Repository (main branch)"]
    
    subgraph TargetA["Target A: GitHub Pages CDN"]
        GHA["GitHub Actions Runner (Ubuntu Latest)"]
        GHA --> BuildStatic["npm ci && npm run build"]
        BuildStatic --> Artifact["actions/upload-pages-artifact (./dist)"]
        Artifact --> DeployPages["actions/deploy-pages@v4"]
        DeployPages --> LiveGH["https://fahimshahir.github.io/seu-adda/"]
    end

    subgraph TargetB["Target B: InfinityFree Shared Hosting"]
        LocalBuild["npm run build -> dist/"]
        PackageScript["Python POSIX Packaging -> seu_adda_infinityfree.zip"]
        MonstaFTP["InfinityFree Monsta FTP Web Client"]
        LiveIF["https://seuadda.free.nf/ (htdocs/)"]
        RemoteDB[("MySQL Database: sql104.infinityfree.com")]
    end

    Repo --> GHA
    Repo --> LocalBuild
    LocalBuild --> PackageScript
    PackageScript --> MonstaFTP
    MonstaFTP --> LiveIF
    LiveIF --> RemoteDB
```

---

## 2. Infrastructure Environments

1. **GitHub Pages (Production CDN)**:
   - Automated continuous deployment on every push to `main`.
   - Global CDN edge caching for static JavaScript, CSS, images, and fonts.
2. **InfinityFree Hosting (Production Full-Stack)**:
   - Hosted on `seuadda.free.nf`.
   - Apache web server with PHP 8.x CGI runtime and remote MySQL 8 database.
3. **Local Developer Workstation**:
   - Node 20+, Vite dev server on port 5173, and built-in PHP server on port 8080 with SQLite fallback.

