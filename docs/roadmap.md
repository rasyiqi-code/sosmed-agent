# Development Roadmap

## ✅ Phase 1: Frontend & UX Design (Completed)
- Designed the "Architectural Minimalist" UI.
- Built all 6 core routing modules (`Dashboard`, `Campaigns`, `Studio`, `Chronology`, `Cortex`, `Network`, `Persona`).
- Established the macOS-native floating window layout.

## 🔜 Phase 2: Database & State Management (Up Next)
- **Goal**: Persist the Digital Twin's brain.
- **Tech Choice**: To be decided (Supabase / PostgreSQL + Prisma / SQLite / MongoDB).
- **Action Items**: 
  - Design DB schemas for `User`, `Persona`, `Campaign`, `ContentNode` (Chronology), `KnowledgeAsset` (Cortex), and `AudienceProfile` (Network).
  - Migrate frontend mock data to server actions / API routes.

## 🧠 Phase 3: AI Engine Integration (The "Agent" part)
- **Goal**: Make the AI actually draft, synthesize, and engage.
- **Tech Choice**: To be decided (OpenAI API / Anthropic / Local LLM like Ollama).
- **Action Items**:
  - Build the RAG (Retrieval-Augmented Generation) pipeline for `The Cortex`.
  - Build the prompt templating system that dynamically reads the `Persona Matrix`.

## 🔄 Phase 4: Social Authorization & Background Workers
- **Goal**: The "Set and Forget" execution engine.
- **Tech Choice**: OAuth2 (Twitter, LinkedIn, Instagram) + Background Job Queue (BullMQ / Trigger.dev / Inngest).
- **Action Items**:
  - Implement OAuth log-in to connect real social accounts.
  - Build task queues to autonomously push content to social APIs on schedule.
  - Build polling services to fetch audience interactions for the `Network CRM`.
