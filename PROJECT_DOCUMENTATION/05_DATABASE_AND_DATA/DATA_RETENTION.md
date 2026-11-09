---
title: "Data Retention & Database Migrations"
document_id: "DOC-DATA-008"
category: "Database & Data Architecture"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/schema.sql"
dependencies:
  - "DOC-DATA-006"
---

# Data Retention & Database Migrations

## 1. Schema Lifecycle & Migration Guide

Because InfinityFree shared hosting does not provide CLI migration tools (e.g., Flyway, Liquibase, Phinx), schema provisioning uses declarative, idempotent SQL in `api/schema.sql`:

1. **Idempotent DDL**: All table definitions use `CREATE TABLE IF NOT EXISTS`.
2. **Initial Seed Idempotence**: Initial stats use `INSERT IGNORE INTO campus_stats (id, ...) VALUES (1, ...)`.
3. **Applying Updates**:
   - Log in to the InfinityFree Control Panel (vPanel).
   - Open **phpMyAdmin** for database `if0_43397321_seu_adda`.
   - Click **Import** and select `api/schema.sql`, or paste into the SQL query box and execute.

---

## 2. Retention Summary Matrix

| Data Classification | Storage Medium | Maximum Retention Period | Cleanup Mechanism |
|---|---|---|---|
| **Private Room Sessions** | MySQL `rooms` table | Exactly 120 minutes (2 Hours) | `purgeExpiredRooms()` on API connect |
| **Room Participants** | MySQL `participants` table | Max 120m (or 5m after last heartbeat) | Foreign Key Cascade / Heartbeat Purge |
| **Chat Messages** | MySQL `messages` table | Exactly 120 minutes | Foreign Key Cascade upon room deletion |
| **Speech Bubbles** | Client Memory | Exactly 30 seconds | Client JavaScript `setTimeout()` |
| **Campus Confessions** | MySQL `confessions` table | Permanent (Latest 50 fetched) | Persistent Community Wall |
| **Campus Stats** | MySQL `campus_stats` table | Permanent Singleton | Incremented atomically |

