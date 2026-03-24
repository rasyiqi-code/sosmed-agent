# Frontend Architecture (Phase 1)

## Tech Stack
- **Framework**: Next.js 16+ (App Router)
- **Styling**: Vanilla CSS (`globals.css`) focusing on CSS variables and native-feeling utility classes (`card-lowest`, `ghost-border`, `btn-primary`).
- **Icons**: `lucide-react` for a consistent, sharp, and premium iconography.
- **Package Manager**: Bun (`bun dev`).

## Directory Structure
- `/src/app/`
  - `layout.tsx`: The master layout defining the 100vh floating mac-style window and importing the continuous sidebar.
  - `globals.css`: Contains all design tokens (colors, typography scales `display-md`, `title-sm`, `label-sm`).
  
- **Core Modules (`/src/app/*`)**
  - `/` -> Command Center (Dashboard & Metrics).
  - `/campaigns` & `/campaigns/new` -> Active campaigns list and deployment builder.
  - `/studio` -> The chat-based manual steering interface.
  - `/chronology` -> The timeline of automated events.
  - `/cortex` -> The raw knowledge ingestion zone (drag-and-drop simulation).
  - `/network` -> Audience intel and CRM tracking view.
  - `/persona` -> The source of truth for the AI's identity, voice, and guardrails.

## UI Data Management
*Currently in Phase 1, all data is mocked using React `useState` hooks directly inside the page components to visualize the layout geometry and component behaviors. The next phase will replace these state hooks with a real database.*
