---
title: "External Services & Third-Party Integrations"
document_id: "DOC-API-004"
category: "API & Integrations"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/hooks/useYouTubePlayer.ts"
  - "src/hooks/useAddaRoom.ts"
dependencies:
  - "DOC-API-001"
---

# External Services & Third-Party Integrations

## 1. YouTube IFrame API
- **Provider**: Google / YouTube (`https://www.youtube.com/iframe_api`)
- **Protocol**: HTTPS / W3C postMessage
- **Purpose**: High-fidelity background campus audio streaming and synchronized playlist controls.
- **Quota & Billing**: 100% Free; client executes via standard embedded IFrame API.

## 2. EMQX Public Cloud MQTT Broker
- **Provider**: EMQ Technologies (`wss://broker.emqx.io:8084/mqtt`)
- **Protocol**: MQTT over Secure WebSockets
- **Purpose**: Real-time pub/sub synchronization on GitHub Pages.
- **Bandwidth**: Public sandbox supporting up to 100,000 concurrent public connections.

## 3. Webhooks & Outbound Integrations
- **Webhooks**: **NOT APPLICABLE** (The platform does not register or consume incoming HTTP webhooks).

