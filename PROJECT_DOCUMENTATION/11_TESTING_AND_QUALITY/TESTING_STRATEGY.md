---
title: "Testing Strategy & Multi-Client Verification"
document_id: "DOC-QA-002"
category: "Testing & Quality Assurance"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "src/hooks/useAddaRoom.ts"
dependencies:
  - "DOC-QA-001"
---

# Testing Strategy & Multi-Client Verification

## 1. Concurrency Verification Protocol

To verify character exclusivity and chat delivery:
1. **Tab 1 (Host)**: Open `http://localhost:8080/`. Click *"নতুন রুম খুলুন"*, enter name *"শাহির"*, choose character `rahat` (রাহাত). Click Create. Room code `SEU-TYXJ` generated.
2. **Tab 2 (Guest)**: Open `http://localhost:8080/?room=SEU-TYXJ`. Verify that `rahat` shows red `🔒 শাহির` badge and is unclickable. Select `sajid` (সাজিদ), enter name *"আবীর"*. Click Join.
3. **Chat Test**:
   - Send *"হ্যালো শাহির ভাই!"* from Tab 2.
   - Verify speech bubble appears over Sajid on Tab 1 within 1.6s.
   - Reply *"আরে আবীর স্বাগতম!"* from Tab 1.
   - Verify speech bubble appears over Rahat on Tab 2 within 1.6s.
4. **Result**: 100% verified with zero duplicate character assignment and instantaneous speech bubble synchronization.

