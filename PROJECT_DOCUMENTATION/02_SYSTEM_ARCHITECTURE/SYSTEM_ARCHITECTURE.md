---
title: "System Architecture & Dual-Deployment Model"
document_id: "DOC-ARCH-001"
category: "System Architecture"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/App.tsx"
  - "src/hooks/useAddaRoom.ts"
  - "api/rooms.php"
  - "api/messages.php"
dependencies:
  - "DOC-ROOT-001"
---

# System Architecture & Dual-Deployment Model

## 1. Architectural Pattern: Hybrid Dual-Deployment

SEU Adda employs an innovative **Hybrid Dual-Deployment Pattern** designed to run without code branching across two vastly different hosting platforms:

```mermaid
flowchart TB
    subgraph BrowserRuntime["Browser Client Runtime"]
        ReactTree["React 19 Virtual DOM"]
        Hooks["Custom Hooks: useAddaRoom, useYouTubePlayer, usePresence"]
        StateEngine["State Sync Engine"]
    end

    subgraph PlatformDetection["Host Detection & Dual Engine Route"]
        HostCheck{"window.location.hostname"}
        HostCheck -->|"Contains 'github.io'"| ModeA["Mode A: Serverless Cloud Broker"]
        HostCheck -->|"Contains 'free.nf' or 'localhost'"| ModeB["Mode B: Dynamic PHP-MySQL Stack"]
    end

    subgraph ModeA_Infra["Mode A: GitHub Pages Infrastructure"]
        GHCDN["GitHub Global Edge CDN"]
        EMQXCloud["EMQX Cloud MQTT Broker (wss://broker.emqx.io:8084/mqtt)"]
        MQTTTopics["Topics:
        • seu-adda/rooms/{id}/state (Retained)
        • seu-adda/rooms/{id}/events
        • seu-adda/rooms/{id}/chat"]
    end

    subgraph ModeB_Infra["Mode B: InfinityFree Infrastructure"]
        ApacheRewrite[".htaccess URL Rewriter"]
        PHPEngine["PHP 8.x Procedural REST API"]
        RemoteMySQL[("Remote MySQL 8.x (sql104.infinityfree.com)")]
        LocalSQLite[("SQLite 3 Fallback (seu_adda_local.db)")]
    end

    ReactTree --> Hooks
    Hooks --> StateEngine
    StateEngine --> PlatformDetection
    ModeA --> EMQXCloud
    EMQXCloud --> MQTTTopics
    ModeB --> ApacheRewrite
    ApacheRewrite --> PHPEngine
    PHPEngine --> RemoteMySQL
    PHPEngine -.->|"DB Connect Fail"| LocalSQLite
```

---

## 2. Mode A: GitHub Pages (Serverless Cloud MQTT)

- **Target Domain**: `https://fahimshahir.github.io/seu-adda/`
- **Hosting**: Static file delivery via GitHub Pages Edge CDN.
- **Backend**: Zero server-side code execution.
- **Real-Time Layer**: Direct browser-to-broker WebSocket connection using **MQTT.js** over TLS (`wss://broker.emqx.io:8084/mqtt`).
- **State Storage**:
  - Room state is stored on the broker as an **MQTT Retained Message** on `seu-adda/rooms/{roomId}/state`. When a guest connects, the broker immediately transmits the retained state.
  - Ephemeral user events (speech bubbles, song changes, transfers) stream on `seu-adda/rooms/{roomId}/events` with QoS 0.
  - Cross-tab synchronization in the same browser runs via `BroadcastChannel('seu_adda_room_bus')`.

---

## 3. Mode B: InfinityFree (Dynamic PHP 8.x + MySQL 8.x)

- **Target Domain**: `https://seuadda.free.nf/`
- **Hosting**: Apache webserver on InfinityFree with `.htaccess` mod_rewrite.
- **Backend API**:
  - `/api/rooms.php`: Room creation, joining, live querying, character transfer, heartbeat, song change.
  - `/api/messages.php`: 1.6-second polling and message dispatch with auto-healing.
  - `/api/confessions.php`: Campus confession submission, pagination, atomic likes.
  - `/api/stats.php`: Campus cheers counter and mood distribution.
- **Database Engine**:
  - Primary: Remote MySQL 8.x (`sql104.infinityfree.com`, `if0_43397321_seu_adda`) via PDO with UTF8MB4.
  - Fallback: Local SQLite 3 (`seu_adda_local.db`) initialized automatically if MySQL is unreachable during local testing.
- **Real-Time Layer**:
  - High-frequency HTTP polling: 1.6s for incoming chat messages; 2.0s for room state & song updates.
  - Heartbeat updates: Every 5s to keep participant `last_seen` timestamps fresh.

