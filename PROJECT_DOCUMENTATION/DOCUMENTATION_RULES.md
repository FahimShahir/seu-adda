---
title: "Documentation Maintenance Rules & Authoring Standards"
document_id: "DOC-ROOT-005"
category: "Root Documentation"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified"
created_at: "2026-11-10"
last_verified: "2026-11-10"
source_files:
  - "PROJECT_DOCUMENTATION/"
dependencies:
  - "DOC-ROOT-001"
---

# Documentation Maintenance Rules & Authoring Standards

To maintain the accuracy, professionalism, and machine-readability of this knowledge base, all future documentation updates by engineers or AI agents must strictly comply with these rules.

---

## 1. Document Structure & YAML Frontmatter

Every new or modified document inside `PROJECT_DOCUMENTATION/` must begin with standard YAML metadata:

```yaml
---
title: "Descriptive Document Title"
document_id: "DOC-CAT-NUM"
category: "Document Category"
project: "SEU Adda (সাউথইস্ট বিশ্ববিদ্যালয় আড্ডাখানা)"
status: "verified" # Options: verified | partially_verified | inferred | planned | not_implemented | deprecated | not_applicable
created_at: "YYYY-MM-DD"
last_verified: "YYYY-MM-DD"
source_files:
  - "actual/path/to/source/file.ts"
dependencies:
  - "DOC-REF-001"
---
```

---

## 2. Mandatory Section Format

Whenever applicable to the document's subject matter, include these core sections:
1. **Purpose**: Plain-language description of what this component or system is and why it exists.
2. **Scope**: What is covered, and explicit boundaries of what is excluded.
3. **Technical Overview**: Architecture description, algorithms, and models.
4. **Current Implementation**: Direct references to source files, classes, methods, endpoints, or hooks.
5. **Execution or Data Flow**: Sequence or lifecycle walkthrough, supplemented by Mermaid diagrams where helpful.
6. **Dependencies & Interactions**: Upstream and downstream connections.
7. **Failure Scenarios & Resilience**: Failure modes, network loss behaviors, and recovery procedures.
8. **Security & Validation Considerations**: Input sanitization, authorization rules, and edge-case handling.
9. **Modification Guidelines**: Rules and cautions for future maintainers before modifying the code.
10. **Related Documents**: Markdown cross-links to companion documents in the knowledge base.

---

## 3. Strict Authoring Tenets

1. **Zero Fabrication**: Never invent imaginary APIs, fake tables, or hypothetical packages. If something is planned but not written, mark it `PLANNED / NOT IMPLEMENTED`. If a category does not apply (e.g., embedded hardware), mark it `NOT APPLICABLE`.
2. **Real File References**: Use exact repository relative paths (e.g., `src/hooks/useAddaRoom.ts`, `api/rooms.php`).
3. **No Secret Leaks**: Never copy actual production passwords, API secret keys, or private tokens into documentation. Use configuration variables or redacted placeholders (e.g., `DB_PASS = '***'`).
4. **Mermaid Diagram Quality**: Use supported Mermaid diagram types (`flowchart TD`, `sequenceDiagram`, `stateDiagram-v2`, `erDiagram`). Avoid HTML tags inside diagram nodes to prevent syntax errors.
5. **Changelog Synchronization**: Whenever an architectural change is made to the codebase, immediately update the affected documentation and append an entry to [`CHANGELOG.md`](./CHANGELOG.md).

