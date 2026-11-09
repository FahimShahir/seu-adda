---
title: "Local Development Setup & Environment Initialization"
document_id: "DOC-OPS-003"
category: "Infrastructure & Deployment"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "package.json"
dependencies:
  - "DOC-OPS-002"
---

# Local Development Setup & Environment Initialization

## 1. Prerequisites
- **Node.js**: v20 or v22 LTS
- **PHP**: v8.0+ with `pdo_sqlite` enabled
- **Git**

## 2. Step-by-Step Local Setup

1. **Clone Repository**:
   ```bash
   git clone https://github.com/FahimShahir/seu-adda.git
   cd seu-adda
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Start Frontend Development Server**:
   ```bash
   npm run dev
   ```
   Opens Vite at `http://localhost:5173/`.
4. **Test Full-Stack PHP Backend with SQLite Fallback**:
   ```bash
   npm run build
   php -S localhost:8080 -t dist
   ```
   Opens full-stack PHP environment at `http://localhost:8080/`. The PHP backend automatically creates `dist/api/seu_adda_local.db` if remote MySQL is unavailable.

