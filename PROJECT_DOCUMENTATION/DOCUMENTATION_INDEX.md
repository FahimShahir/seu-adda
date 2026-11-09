---
title: "Master Documentation Index & Architecture Catalog"
document_id: "DOC-ROOT-003"
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

# Master Documentation Index & Architecture Catalog

This master index maps every architectural category and document module in the **`PROJECT_DOCUMENTATION/`** knowledge base.

---

## 🏛️ Root Knowledge Core
- [**`README.md`**](./README.md) — Knowledge base entry point and quick orientation.
- [**`PROJECT_OVERVIEW.md`**](./PROJECT_OVERVIEW.md) — High-level platform architecture and executive summary.
- [**`PROJECT_STATUS.md`**](./PROJECT_STATUS.md) — Current production status, metrics, and deployment verification.
- [**`DOCUMENTATION_INDEX.md`**](./DOCUMENTATION_INDEX.md) — This master document index.
- [**`AI_AGENT_START_HERE.md`**](./AI_AGENT_START_HERE.md) — Mandatory bootstrapping protocol for AI agents.
- [**`DOCUMENTATION_RULES.md`**](./DOCUMENTATION_RULES.md) — Documentation authoring standards and schemas.
- [**`CHANGELOG.md`**](./CHANGELOG.md) — Historical log of architectural changes and milestones.

---

## 📂 Category Modules

### [01. Project Foundation](./01_PROJECT_FOUNDATION/PROJECT_VISION.md)
1. [`PROJECT_VISION.md`](./01_PROJECT_FOUNDATION/PROJECT_VISION.md) — University nostalgia and emotional design vision.
2. [`PROJECT_OBJECTIVES.md`](./01_PROJECT_FOUNDATION/PROJECT_OBJECTIVES.md) — Technical and practical objectives.
3. [`SCOPE_AND_REQUIREMENTS.md`](./01_PROJECT_FOUNDATION/SCOPE_AND_REQUIREMENTS.md) — System boundaries and requirements baseline.
4. [`FUNCTIONAL_REQUIREMENTS.md`](./01_PROJECT_FOUNDATION/FUNCTIONAL_REQUIREMENTS.md) — Detailed functional specifications.
5. [`NON_FUNCTIONAL_REQUIREMENTS.md`](./01_PROJECT_FOUNDATION/NON_FUNCTIONAL_REQUIREMENTS.md) — Latency, memory, cross-device responsiveness.
6. [`BUSINESS_REQUIREMENTS.md`](./01_PROJECT_FOUNDATION/BUSINESS_REQUIREMENTS.md) — Community building and bKash alumni support.
7. [`CONSTRAINTS_AND_ASSUMPTIONS.md`](./01_PROJECT_FOUNDATION/CONSTRAINTS_AND_ASSUMPTIONS.md) — Free hosting limits, broker constraints.
8. [`GLOSSARY.md`](./01_PROJECT_FOUNDATION/GLOSSARY.md) — Campus slang, Banglish terms, and technical dictionary.

### [02. System Architecture](./02_SYSTEM_ARCHITECTURE/SYSTEM_ARCHITECTURE.md)
1. [`SYSTEM_ARCHITECTURE.md`](./02_SYSTEM_ARCHITECTURE/SYSTEM_ARCHITECTURE.md) — Dual-deployment hybrid architecture.
2. [`ARCHITECTURE_DECISIONS.md`](./02_SYSTEM_ARCHITECTURE/ARCHITECTURE_DECISIONS.md) — Architecture Decision Records (ADRs).
3. [`COMPONENT_ARCHITECTURE.md`](./02_SYSTEM_ARCHITECTURE/COMPONENT_ARCHITECTURE.md) — React 19 component hierarchy.
4. [`MODULE_DEPENDENCIES.md`](./02_SYSTEM_ARCHITECTURE/MODULE_DEPENDENCIES.md) — Internal module dependency graph.
5. [`DATA_FLOW_ARCHITECTURE.md`](./02_SYSTEM_ARCHITECTURE/DATA_FLOW_ARCHITECTURE.md) — Real-time event and state flow.
6. [`EXECUTION_FLOW.md`](./02_SYSTEM_ARCHITECTURE/EXECUTION_FLOW.md) — Initialization and render lifecycle.
7. [`INTEGRATION_ARCHITECTURE.md`](./02_SYSTEM_ARCHITECTURE/INTEGRATION_ARCHITECTURE.md) — YouTube API and EMQX broker integration.
8. [`COMMUNICATION_ARCHITECTURE.md`](./02_SYSTEM_ARCHITECTURE/COMMUNICATION_ARCHITECTURE.md) — WebSocket, BroadcastChannel, and HTTP.
9. [`SCALABILITY_DESIGN.md`](./02_SYSTEM_ARCHITECTURE/SCALABILITY_DESIGN.md) — Free-tier optimization and scale limits.
10. [`SYSTEM_DIAGRAMS.md`](./02_SYSTEM_ARCHITECTURE/SYSTEM_DIAGRAMS.md) — Comprehensive collection of Mermaid diagrams.

### [03. Technology Stack](./03_TECHNOLOGY_STACK/TECHNOLOGY_INVENTORY.md)
1. [`TECHNOLOGY_INVENTORY.md`](./03_TECHNOLOGY_STACK/TECHNOLOGY_INVENTORY.md) — Comprehensive verified software inventory.
2. [`PROGRAMMING_LANGUAGES.md`](./03_TECHNOLOGY_STACK/PROGRAMMING_LANGUAGES.md) — TypeScript, PHP, SQL, HTML5/CSS3.
3. [`FRAMEWORKS_AND_LIBRARIES.md`](./03_TECHNOLOGY_STACK/FRAMEWORKS_AND_LIBRARIES.md) — React 19, Tailwind CSS, Vite, MQTT.js.
4. [`RUNTIME_AND_VERSIONS.md`](./03_TECHNOLOGY_STACK/RUNTIME_AND_VERSIONS.md) — Node 20+, PHP 8.x, MySQL 8.x.
5. [`DEPENDENCY_MAP.md`](./03_TECHNOLOGY_STACK/DEPENDENCY_MAP.md) — Package dependency hierarchy.
6. [`COMPATIBILITY_MATRIX.md`](./03_TECHNOLOGY_STACK/COMPATIBILITY_MATRIX.md) — Desktop and mobile browser compatibility.

### [04. Project Structure](./04_PROJECT_STRUCTURE/REPOSITORY_STRUCTURE.md)
1. [`REPOSITORY_STRUCTURE.md`](./04_PROJECT_STRUCTURE/REPOSITORY_STRUCTURE.md) — Root and subdirectory file maps.
2. [`FOLDER_PURPOSES.md`](./04_PROJECT_STRUCTURE/FOLDER_PURPOSES.md) — Purpose and responsibility of each folder.
3. [`FILE_RESPONSIBILITIES.md`](./04_PROJECT_STRUCTURE/FILE_RESPONSIBILITIES.md) — Exhaustive map of individual file roles.
4. [`ENTRY_POINTS.md`](./04_PROJECT_STRUCTURE/ENTRY_POINTS.md) — Client and server application entry points.
5. [`CONFIGURATION_FILES.md`](./04_PROJECT_STRUCTURE/CONFIGURATION_FILES.md) — Build, style, typescript, and webserver configs.
6. [`NAMING_CONVENTIONS.md`](./04_PROJECT_STRUCTURE/NAMING_CONVENTIONS.md) — Naming patterns across codebase.

### [05. Database & Data Architecture](./05_DATABASE_AND_DATA/DATABASE_ARCHITECTURE.md)
1. [`DATABASE_ARCHITECTURE.md`](./05_DATABASE_AND_DATA/DATABASE_ARCHITECTURE.md) — Remote MySQL & Local SQLite fallback.
2. [`DATABASE_SCHEMA.md`](./05_DATABASE_AND_DATA/DATABASE_SCHEMA.md) — Complete SQL schema definition.
3. [`ENTITY_RELATIONSHIPS.md`](./05_DATABASE_AND_DATA/ENTITY_RELATIONSHIPS.md) — Rooms, participants, messages ERD.
4. [`TABLE_DOCUMENTATION.md`](./05_DATABASE_AND_DATA/TABLE_DOCUMENTATION.md) — Detailed table and column data dictionary.
5. [`INDEXES_AND_CONSTRAINTS.md`](./05_DATABASE_AND_DATA/INDEXES_AND_CONSTRAINTS.md) — Performance indexes and cascade rules.
6. [`DATA_FLOW.md`](./05_DATABASE_AND_DATA/DATA_FLOW.md) — Mutation, transaction, and query lifecycles.
7. [`DATA_VALIDATION.md`](./05_DATABASE_AND_DATA/DATA_VALIDATION.md) — Sanitization and constraint enforcement.
8. [`DATA_RETENTION.md`](./05_DATABASE_AND_DATA/DATA_RETENTION.md) — 2-hour TTL and automated expiration purge.
9. [`DATABASE_MIGRATIONS.md`](./05_DATABASE_AND_DATA/DATABASE_MIGRATIONS.md) — Schema updates and seeding.

### [06. Backend System](./06_BACKEND_SYSTEM/BACKEND_ARCHITECTURE.md)
1. [`BACKEND_ARCHITECTURE.md`](./06_BACKEND_SYSTEM/BACKEND_ARCHITECTURE.md) — PHP procedural REST engine design.
2. [`ROUTES_AND_ENDPOINTS.md`](./06_BACKEND_SYSTEM/ROUTES_AND_ENDPOINTS.md) — Complete endpoint listing.
3. [`CONTROLLERS.md`](./06_BACKEND_SYSTEM/CONTROLLERS.md) — Switch-case action dispatcher pattern.
4. [`SERVICES_AND_BUSINESS_LOGIC.md`](./06_BACKEND_SYSTEM/SERVICES_AND_BUSINESS_LOGIC.md) — Room lifecycle and character allocation.
5. [`MIDDLEWARE.md`](./06_BACKEND_SYSTEM/MIDDLEWARE.md) — CORS, JSON payload parser, and UTC timezone initializer.
6. [`AUTHENTICATION.md`](./06_BACKEND_SYSTEM/AUTHENTICATION.md) — Ephemeral tab-based ID authentication.
7. [`AUTHORIZATION_AND_PERMISSIONS.md`](./06_BACKEND_SYSTEM/AUTHORIZATION_AND_PERMISSIONS.md) — Room host vs participant permissions.
8. [`BACKGROUND_JOBS.md`](./06_BACKEND_SYSTEM/BACKGROUND_JOBS.md) — On-request garbage collection & room purge.
9. [`ERROR_HANDLING.md`](./06_BACKEND_SYSTEM/ERROR_HANDLING.md) — Self-healing rooms and error responses.
10. [`VALIDATION_RULES.md`](./06_BACKEND_SYSTEM/VALIDATION_RULES.md) — Server-side character and payload guards.

### [07. Frontend & UI](./07_FRONTEND_AND_UI/FRONTEND_ARCHITECTURE.md)
1. [`FRONTEND_ARCHITECTURE.md`](./07_FRONTEND_AND_UI/FRONTEND_ARCHITECTURE.md) — React 19 SPA architecture.
2. [`UI_COMPONENTS.md`](./07_FRONTEND_AND_UI/UI_COMPONENTS.md) — Scene, audio, community, and room modals.
3. [`PAGE_AND_SCREEN_MAP.md`](./07_FRONTEND_AND_UI/PAGE_AND_SCREEN_MAP.md) — View states and screen flows.
4. [`STATE_MANAGEMENT.md`](./07_FRONTEND_AND_UI/STATE_MANAGEMENT.md) — Custom hooks and shared state.
5. [`ROUTING_AND_NAVIGATION.md`](./07_FRONTEND_AND_UI/ROUTING_AND_NAVIGATION.md) — Query param routing (`?room=`).
6. [`API_INTEGRATION.md`](./07_FRONTEND_AND_UI/API_INTEGRATION.md) — Fast fetch polling and MQTT subscriptions.
7. [`DESIGN_SYSTEM.md`](./07_FRONTEND_AND_UI/DESIGN_SYSTEM.md) — Glassmorphism, colors, fonts, and icons.
8. [`RESPONSIVE_DESIGN.md`](./07_FRONTEND_AND_UI/RESPONSIVE_DESIGN.md) — Mobile drag-scroll and touch adaptation.
9. [`USER_INTERACTION_FLOWS.md`](./07_FRONTEND_AND_UI/USER_INTERACTION_FLOWS.md) — Hotspot clicks, chat, and room sharing.

### [08. API & Integrations](./08_API_AND_INTEGRATIONS/API_ARCHITECTURE.md)
1. [`API_ARCHITECTURE.md`](./08_API_AND_INTEGRATIONS/API_ARCHITECTURE.md) — Dual REST & MQTT architecture.
2. [`API_REFERENCE.md`](./08_API_AND_INTEGRATIONS/API_REFERENCE.md) — Full API reference with schemas and codes.
3. [`REQUEST_RESPONSE_FORMATS.md`](./08_API_AND_INTEGRATIONS/REQUEST_RESPONSE_FORMATS.md) — JSON payloads and contracts.
4. [`EXTERNAL_SERVICES.md`](./08_API_AND_INTEGRATIONS/EXTERNAL_SERVICES.md) — YouTube API and EMQX broker.
5. [`WEBHOOKS.md`](./08_API_AND_INTEGRATIONS/WEBHOOKS.md) — [NOT APPLICABLE - Formally recorded].
6. [`THIRD_PARTY_INTEGRATIONS.md`](./08_API_AND_INTEGRATIONS/THIRD_PARTY_INTEGRATIONS.md) — Canvas Confetti and YouTube player.
7. [`COMMUNICATION_PROTOCOLS.md`](./08_API_AND_INTEGRATIONS/COMMUNICATION_PROTOCOLS.md) — WebSocket, MQTT, HTTP, BroadcastChannel.

### [09. Security & Privacy](./09_SECURITY_AND_PRIVACY/SECURITY_ARCHITECTURE.md)
1. [`SECURITY_ARCHITECTURE.md`](./09_SECURITY_AND_PRIVACY/SECURITY_ARCHITECTURE.md) — Static security analysis and posture.
2. [`THREAT_MODEL.md`](./09_SECURITY_AND_PRIVACY/THREAT_MODEL.md) — STRIDE threat modeling for campus adda.
3. [`AUTHENTICATION_SECURITY.md`](./09_SECURITY_AND_PRIVACY/AUTHENTICATION_SECURITY.md) — Ephemeral tokenless user identity.
4. [`AUTHORIZATION_SECURITY.md`](./09_SECURITY_AND_PRIVACY/AUTHORIZATION_SECURITY.md) — Host control and participant isolation.
5. [`INPUT_VALIDATION_SECURITY.md`](./09_SECURITY_AND_PRIVACY/INPUT_VALIDATION_SECURITY.md) — XSS prevention and SQL injection immunity.
6. [`DATA_PROTECTION.md`](./09_SECURITY_AND_PRIVACY/DATA_PROTECTION.md) — Anonymity and data minimization.
7. [`SESSION_AND_TOKEN_SECURITY.md`](./09_SECURITY_AND_PRIVACY/SESSION_AND_TOKEN_SECURITY.md) — Storage boundaries and security.
8. [`FILE_UPLOAD_SECURITY.md`](./09_SECURITY_AND_PRIVACY/FILE_UPLOAD_SECURITY.md) — [NOT APPLICABLE - Formally recorded].
9. [`AUDIT_LOGGING.md`](./09_SECURITY_AND_PRIVACY/AUDIT_LOGGING.md) — Message logging and error trace handling.
10. [`RATE_LIMITING_AND_ABUSE_PREVENTION.md`](./09_SECURITY_AND_PRIVACY/RATE_LIMITING_AND_ABUSE_PREVENTION.md) — Free-tier flood mitigation.
11. [`SECURITY_RISKS.md`](./09_SECURITY_AND_PRIVACY/SECURITY_RISKS.md) — Static code audit findings and remediations.

### [10. Infrastructure & Deployment](./10_INFRASTRUCTURE_AND_DEPLOYMENT/INFRASTRUCTURE_OVERVIEW.md)
1. [`INFRASTRUCTURE_OVERVIEW.md`](./10_INFRASTRUCTURE_AND_DEPLOYMENT/INFRASTRUCTURE_OVERVIEW.md) — Deployment topology.
2. [`ENVIRONMENT_CONFIGURATION.md`](./10_INFRASTRUCTURE_AND_DEPLOYMENT/ENVIRONMENT_CONFIGURATION.md) — Environment variables and configs.
3. [`LOCAL_DEVELOPMENT_SETUP.md`](./10_INFRASTRUCTURE_AND_DEPLOYMENT/LOCAL_DEVELOPMENT_SETUP.md) — Developer setup instructions.
4. [`BUILD_PROCESS.md`](./10_INFRASTRUCTURE_AND_DEPLOYMENT/BUILD_PROCESS.md) — TypeScript compilation and Vite bundling.
5. [`DEPLOYMENT_GUIDE.md`](./10_INFRASTRUCTURE_AND_DEPLOYMENT/DEPLOYMENT_GUIDE.md) — GitHub Pages and InfinityFree deployment.
6. [`HOSTING_CONFIGURATION.md`](./10_INFRASTRUCTURE_AND_DEPLOYMENT/HOSTING_CONFIGURATION.md) — `.htaccess` configuration and rewrites.
7. [`SERVER_REQUIREMENTS.md`](./10_INFRASTRUCTURE_AND_DEPLOYMENT/SERVER_REQUIREMENTS.md) — PHP extensions and Apache modules.
8. [`BACKUP_AND_RESTORE.md`](./10_INFRASTRUCTURE_AND_DEPLOYMENT/BACKUP_AND_RESTORE.md) — Source zip and database dump guides.
9. [`MONITORING_AND_LOGGING.md`](./10_INFRASTRUCTURE_AND_DEPLOYMENT/MONITORING_AND_LOGGING.md) — Console logging and telemetry.
10. [`ROLLBACK_PROCEDURE.md`](./10_INFRASTRUCTURE_AND_DEPLOYMENT/ROLLBACK_PROCEDURE.md) — Safe rollbacks via Git and archive zips.

### [11. Testing & Quality](./11_TESTING_AND_QUALITY/TESTING_ARCHITECTURE.md)
1. [`TESTING_ARCHITECTURE.md`](./11_TESTING_AND_QUALITY/TESTING_ARCHITECTURE.md) — Quality assurance framework.
2. [`TESTING_STRATEGY.md`](./11_TESTING_AND_QUALITY/TESTING_STRATEGY.md) — Manual, automated, and multi-tab testing.
3. [`UNIT_TESTS.md`](./11_TESTING_AND_QUALITY/UNIT_TESTS.md) — TypeScript compiler unit verification.
4. [`INTEGRATION_TESTS.md`](./11_TESTING_AND_QUALITY/INTEGRATION_TESTS.md) — Multi-client synchronization testing.
5. [`END_TO_END_TESTS.md`](./11_TESTING_AND_QUALITY/END_TO_END_TESTS.md) — Complete user journeys.
6. [`PERFORMANCE_TESTING.md`](./11_TESTING_AND_QUALITY/PERFORMANCE_TESTING.md) — Polling overhead and FPS validation.
7. [`SECURITY_TESTING.md`](./11_TESTING_AND_QUALITY/SECURITY_TESTING.md) — SQL injection and payload fuzzing.
8. [`TEST_COVERAGE.md`](./11_TESTING_AND_QUALITY/TEST_COVERAGE.md) — Test surface analysis.
9. [`KNOWN_BUGS_AND_ISSUES.md`](./11_TESTING_AND_QUALITY/KNOWN_BUGS_AND_ISSUES.md) — Solved bugs and active watchpoints.

### [12. Performance & Reliability](./12_PERFORMANCE_AND_RELIABILITY/PERFORMANCE_ARCHITECTURE.md)
1. [`PERFORMANCE_ARCHITECTURE.md`](./12_PERFORMANCE_AND_RELIABILITY/PERFORMANCE_ARCHITECTURE.md) — Asset loading and responsiveness.
2. [`RESOURCE_UTILIZATION.md`](./12_PERFORMANCE_AND_RELIABILITY/RESOURCE_UTILIZATION.md) — Memory and CPU footprint.
3. [`CACHING_STRATEGY.md`](./12_PERFORMANCE_AND_RELIABILITY/CACHING_STRATEGY.md) — Static hashing and HTTP cache control.
4. [`DATABASE_OPTIMIZATION.md`](./12_PERFORMANCE_AND_RELIABILITY/DATABASE_OPTIMIZATION.md) — Indexed lookups and purge queries.
5. [`FAILURE_HANDLING.md`](./12_PERFORMANCE_AND_RELIABILITY/FAILURE_HANDLING.md) — SQLite fallback and auto-healing rooms.
6. [`HIGH_AVAILABILITY.md`](./12_PERFORMANCE_AND_RELIABILITY/HIGH_AVAILABILITY.md) — Dual platform availability.
7. [`BOTTLENECK_ANALYSIS.md`](./12_PERFORMANCE_AND_RELIABILITY/BOTTLENECK_ANALYSIS.md) — Free-tier IOPS and broker limits.

### [13. Hardware & Embedded Systems](./13_HARDWARE_AND_EMBEDDED/HARDWARE_NOT_APPLICABLE.md)
- [`HARDWARE_NOT_APPLICABLE.md`](./13_HARDWARE_AND_EMBEDDED/HARDWARE_NOT_APPLICABLE.md) — **NOT APPLICABLE** (Software-only project).

### [14. AI & Data Science](./14_AI_AND_DATA_SCIENCE/AI_NOT_APPLICABLE.md)
- [`AI_NOT_APPLICABLE.md`](./14_AI_AND_DATA_SCIENCE/AI_NOT_APPLICABLE.md) — **NOT APPLICABLE** (No machine learning models).

### [15. Business Logic & Product Rules](./15_BUSINESS_LOGIC/BUSINESS_RULES.md)
1. [`BUSINESS_RULES.md`](./15_BUSINESS_LOGIC/BUSINESS_RULES.md) — Room lifecycle, character exclusivity, mood filters.
2. [`USER_ROLES_AND_WORKFLOWS.md`](./15_BUSINESS_LOGIC/USER_ROLES_AND_WORKFLOWS.md) — Host, Member, Guest permissions.
3. [`USER_JOURNEYS.md`](./15_BUSINESS_LOGIC/USER_JOURNEYS.md) — Hangout, music listening, and chat journeys.
4. [`PRICING_AND_MONETIZATION.md`](./15_BUSINESS_LOGIC/PRICING_AND_MONETIZATION.md) — Free campus platform, bKash coffee treat.
5. [`TRANSACTION_LIFECYCLE.md`](./15_BUSINESS_LOGIC/TRANSACTION_LIFECYCLE.md) — Donation support flow.
6. [`NOTIFICATION_RULES.md`](./15_BUSINESS_LOGIC/NOTIFICATION_RULES.md) — Speech bubbles and room events.

### [16. Development Guidelines](./16_DEVELOPMENT_GUIDELINES/CODING_STANDARDS.md)
1. [`CODING_STANDARDS.md`](./16_DEVELOPMENT_GUIDELINES/CODING_STANDARDS.md) — React 19, TypeScript, and clean code principles.
2. [`DEVELOPMENT_WORKFLOW.md`](./16_DEVELOPMENT_GUIDELINES/DEVELOPMENT_WORKFLOW.md) — Feature workflow and build process.
3. [`GIT_AND_BRANCHING_STRATEGY.md`](./16_DEVELOPMENT_GUIDELINES/GIT_AND_BRANCHING_STRATEGY.md) — Main branch and GitHub Pages releases.
4. [`CODE_REVIEW_GUIDELINES.md`](./16_DEVELOPMENT_GUIDELINES/CODE_REVIEW_GUIDELINES.md) — Review checklist.
5. [`MODULE_EXTENSION_GUIDE.md`](./16_DEVELOPMENT_GUIDELINES/MODULE_EXTENSION_GUIDE.md) — Adding characters, playlists, and dialogues.
6. [`DEBUGGING_GUIDE.md`](./16_DEVELOPMENT_GUIDELINES/DEBUGGING_GUIDE.md) — Debugging MQTT and PHP polling.
7. [`COMMON_DEVELOPMENT_MISTAKES.md`](./16_DEVELOPMENT_GUIDELINES/COMMON_DEVELOPMENT_MISTAKES.md) — Critical pitfalls to avoid.

### [17. Operations & Maintenance](./17_OPERATIONS_AND_MAINTENANCE/OPERATIONAL_GUIDE.md)
1. [`OPERATIONAL_GUIDE.md`](./17_OPERATIONS_AND_MAINTENANCE/OPERATIONAL_GUIDE.md) — Day-to-day maintenance guide.
2. [`TROUBLESHOOTING.md`](./17_OPERATIONS_AND_MAINTENANCE/TROUBLESHOOTING.md) — Step-by-step diagnostic procedures.
3. [`MAINTENANCE_PROCEDURES.md`](./17_OPERATIONS_AND_MAINTENANCE/MAINTENANCE_PROCEDURES.md) — Regular database and archive maintenance.
4. [`INCIDENT_RESPONSE.md`](./17_OPERATIONS_AND_MAINTENANCE/INCIDENT_RESPONSE.md) — Broker outage and InfinityFree downtime handling.
5. [`DISASTER_RECOVERY.md`](./17_OPERATIONS_AND_MAINTENANCE/DISASTER_RECOVERY.md) — Full disaster recovery procedure.
6. [`SUPPORT_GUIDE.md`](./17_OPERATIONS_AND_MAINTENANCE/SUPPORT_GUIDE.md) — Developer contact and bug report escalation.

### [18. Project Roadmap](./18_PROJECT_ROADMAP/CURRENT_CAPABILITIES.md)
1. [`CURRENT_CAPABILITIES.md`](./18_PROJECT_ROADMAP/CURRENT_CAPABILITIES.md) — Feature capabilities baseline.
2. [`COMPLETED_FEATURES.md`](./18_PROJECT_ROADMAP/COMPLETED_FEATURES.md) — Milestone accomplishments.
3. [`PENDING_FEATURES.md`](./18_PROJECT_ROADMAP/PENDING_FEATURES.md) — Potential feature enhancements.
4. [`KNOWN_LIMITATIONS.md`](./18_PROJECT_ROADMAP/KNOWN_LIMITATIONS.md) — Architectural and platform boundaries.
5. [`TECHNICAL_DEBT.md`](./18_PROJECT_ROADMAP/TECHNICAL_DEBT.md) — Technical debt registry.
6. [`FUTURE_IMPROVEMENTS.md`](./18_PROJECT_ROADMAP/FUTURE_IMPROVEMENTS.md) — Long-term architectural vision.

### [19. AI Agent Knowledge & Protocol](./19_AI_AGENT_KNOWLEDGE/AI_AGENT_STARTUP_PROTOCOL.md)
1. [`AI_AGENT_STARTUP_PROTOCOL.md`](./19_AI_AGENT_KNOWLEDGE/AI_AGENT_STARTUP_PROTOCOL.md) — Mandatory protocol for subsequent AI agents.
2. [`PROJECT_CONTEXT.md`](./19_AI_AGENT_KNOWLEDGE/PROJECT_CONTEXT.md) — Contextual background and architecture history.
3. [`CRITICAL_IMPLEMENTATION_RULES.md`](./19_AI_AGENT_KNOWLEDGE/CRITICAL_IMPLEMENTATION_RULES.md) — Inviolable system invariants.
4. [`DO_NOT_MODIFY_LIST.md`](./19_AI_AGENT_KNOWLEDGE/DO_NOT_MODIFY_LIST.md) — Files and components with strict modification restrictions.
5. [`SAFE_MODIFICATION_GUIDE.md`](./19_AI_AGENT_KNOWLEDGE/SAFE_MODIFICATION_GUIDE.md) — How to safely modify UI and backend code.
6. [`FEATURE_IMPLEMENTATION_WORKFLOW.md`](./19_AI_AGENT_KNOWLEDGE/FEATURE_IMPLEMENTATION_WORKFLOW.md) — Prescribed workflow for new tasks.
7. [`REGRESSION_PREVENTION.md`](./19_AI_AGENT_KNOWLEDGE/REGRESSION_PREVENTION.md) — Regression prevention checklist.
8. [`CURRENT_TASK_CONTEXT.md`](./19_AI_AGENT_KNOWLEDGE/CURRENT_TASK_CONTEXT.md) — Snapshot of current task history.
9. [`AGENT_HANDOVER.md`](./19_AI_AGENT_KNOWLEDGE/AGENT_HANDOVER.md) — Official handover document for next agent.

### [20. References & Diagrams](./20_REFERENCES_AND_DIAGRAMS/ARCHITECTURE_DIAGRAMS.md)
1. [`ARCHITECTURE_DIAGRAMS.md`](./20_REFERENCES_AND_DIAGRAMS/ARCHITECTURE_DIAGRAMS.md) — High & low-level architecture diagrams.
2. [`DATABASE_DIAGRAMS.md`](./20_REFERENCES_AND_DIAGRAMS/DATABASE_DIAGRAMS.md) — Entity Relationship Diagrams.
3. [`SEQUENCE_DIAGRAMS.md`](./20_REFERENCES_AND_DIAGRAMS/SEQUENCE_DIAGRAMS.md) — Room lifecycle and song sync sequence diagrams.
4. [`FLOWCHARTS.md`](./20_REFERENCES_AND_DIAGRAMS/FLOWCHARTS.md) — User decision and state flowcharts.
5. [`STATE_DIAGRAMS.md`](./20_REFERENCES_AND_DIAGRAMS/STATE_DIAGRAMS.md) — YouTube player and room sync state machines.
6. [`NETWORK_DIAGRAMS.md`](./20_REFERENCES_AND_DIAGRAMS/NETWORK_DIAGRAMS.md) — Traffic flow and dual-broker topology.
7. [`REFERENCES.md`](./20_REFERENCES_AND_DIAGRAMS/REFERENCES.md) — External documentation and resources.

### [99. Audit & Validation](./99_AUDIT_AND_VALIDATION/DOCUMENTATION_AUDIT.md)
1. [`DOCUMENTATION_AUDIT.md`](./99_AUDIT_AND_VALIDATION/DOCUMENTATION_AUDIT.md) — Completeness and link integrity audit.
2. [`REPOSITORY_COVERAGE.md`](./99_AUDIT_AND_VALIDATION/REPOSITORY_COVERAGE.md) — Source code file coverage report.
3. [`VERIFICATION_REPORT.md`](./99_AUDIT_AND_VALIDATION/VERIFICATION_REPORT.md) — Technical accuracy verification report.
4. [`DOCUMENTATION_GAPS.md`](./99_AUDIT_AND_VALIDATION/DOCUMENTATION_GAPS.md) — Knowledge gaps and monitoring plan.
5. [`FINAL_COMPLETION_REPORT.md`](./99_AUDIT_AND_VALIDATION/FINAL_COMPLETION_REPORT.md) — Final executive sign-off report.

