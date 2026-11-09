---
title: "Routing, URL Query Params & Navigation"
document_id: "DOC-FE-005"
category: "Frontend & UI Architecture"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/App.tsx"
  - "src/components/Room/PrivateRoomModal.tsx"
dependencies:
  - "DOC-FE-004"
---

# Routing, URL Query Params & Navigation

## 1. Single-Page Query Parameter Routing

SEU Adda intentionally avoids browser hash routing (`#`) or deep push-state paths that break on GitHub Pages and static CDNs. It uses standard **URL Query Parameters**:

- **Target Parameter**: `?room=SEU-XXXX`
- **Example Sharing URL**: `https://seuadda.free.nf/?room=SEU-TYXJ`
- **Detection & Lifecycle**:
  ```typescript
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const r = params.get('room');
      if (r) {
        setPendingJoinRoomId(r.trim().toUpperCase());
        setIsRoomOpen(true);
      }
    } catch (_) {}
  }, []);
  ```
- **Cleanup on Leave**: When a user leaves a room or the room expires, the URL is cleanly sanitized using `window.history.replaceState({}, '', window.location.pathname)` without causing a page reload.

