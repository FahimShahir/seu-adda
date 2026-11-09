---
title: "Web Server Configuration & .htaccess Rules"
document_id: "DOC-OPS-006"
category: "Infrastructure & Deployment"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "public/.htaccess"
dependencies:
  - "DOC-OPS-005"
---

# Web Server Configuration & .htaccess Rules

The `public/.htaccess` file contains essential rules for Apache on InfinityFree:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Allow direct access to existing files and directories
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  
  # Exclude api directory from SPA rewrite
  RewriteRule ^api/ - [L]
  
  # Rewrite all other requests to index.html for Single-Page Application
  RewriteRule ^ index.html [L]
</IfModule>

<IfModule mod_headers.c>
  # CORS and Security Headers
  Header set Access-Control-Allow-Origin "*"
  Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
  Header set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
</IfModule>
```
This guarantees that `/api/rooms.php` executes directly via PHP, while virtual frontend routes route to `index.html`.

