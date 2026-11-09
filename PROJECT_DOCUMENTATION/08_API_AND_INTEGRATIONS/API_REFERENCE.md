---
title: "Exhaustive API Reference Guide"
document_id: "DOC-API-002"
category: "API & Integrations"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "api/rooms.php"
  - "api/messages.php"
  - "api/confessions.php"
  - "api/stats.php"
dependencies:
  - "DOC-API-001"
---

# Exhaustive API Reference Guide

### 1. `POST /api/rooms.php?action=create`
- **Request Body**:
  ```json
  {
    "id": "SEU-TYXJ",
    "name": "সাউথইস্ট আড্ডা রুম",
    "hostId": "user_7uc36o7",
    "hostName": "শাহির",
    "participant": {
      "id": "user_7uc36o7",
      "name": "শাহির",
      "dept": "CSE",
      "gender": "male",
      "characterId": "guitarist"
    }
  }
  ```
- **Success Response (200 OK)**:
  ```json
  { "success": true, "roomId": "SEU-TYXJ" }
  ```

---

### 2. `GET /api/rooms.php?action=get&room_id=SEU-TYXJ`
- **Success Response (200 OK)**:
  ```json
  {
    "id": "SEU-TYXJ",
    "name": "সাউথইস্ট আড্ডা রুম",
    "hostId": "user_7uc36o7",
    "hostName": "শাহির",
    "createdAt": 1794261158000,
    "expiresAt": 1794268358000,
    "currentSong": null,
    "participants": [
      {
        "id": "user_7uc36o7",
        "name": "শাহির",
        "dept": "CSE",
        "gender": "male",
        "characterId": "guitarist",
        "joinedAt": 1794261158000,
        "lastSeen": 1794261226000
      }
    ]
  }
  ```

---

### 3. `POST /api/rooms.php?action=join`
- **Request Body**:
  ```json
  {
    "roomId": "SEU-TYXJ",
    "participant": {
      "id": "user_9abc123",
      "name": "আবীর",
      "dept": "CSE",
      "gender": "male",
      "characterId": "sajid"
    }
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "roomId": "SEU-TYXJ",
    "characterId": "sajid",
    "wasReassigned": false
  }
  ```
- *Note*: If requested character was taken, `wasReassigned` will be `true` with the newly assigned `characterId`.

---

### 4. `POST /api/messages.php?action=send`
- **Request Body**:
  ```json
  {
    "roomId": "SEU-TYXJ",
    "message": {
      "id": "msg_1794261158_3ab",
      "senderId": "user_9abc123",
      "senderName": "আবীর",
      "senderDept": "CSE",
      "characterId": "sajid",
      "text": "হ্যালো শাহির ভাই!",
      "isSystem": false
    }
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "dbId": 46,
    "msgUid": "msg_1794261158_3ab"
  }
  ```

---

### 5. `GET /api/messages.php?action=poll&room_id=SEU-TYXJ&after_id=45`
- **Success Response (200 OK)**:
  ```json
  {
    "messages": [
      {
        "id": "msg_1794261158_3ab",
        "dbId": 46,
        "senderId": "user_9abc123",
        "senderName": "আবীর",
        "senderDept": "CSE",
        "characterId": "sajid",
        "text": "হ্যালো শাহির ভাই!",
        "timestamp": "09:58 PM",
        "isSystem": false
      }
    ],
    "count": 1
  }
  ```

