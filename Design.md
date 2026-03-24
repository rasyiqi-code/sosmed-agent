Design System Specification: The Architectural Minimalist
1. Overview & Creative North Star
The "Architectural Minimalist" is our design system’s core philosophy. It moves beyond the generic "SaaS dashboard" by treating the interface as a series of curated, high-end editorial layers. Our North Star is The Digital Gallery: a space that feels expansive yet high-density, authoritative yet breathable.
We break the "template" look by rejecting rigid 1px grids. Instead, we use Intentional Asymmetry—aligning content to a rigorous baseline but allowing secondary information to "float" in generous whitespace. By leveraging subtle tonal shifts and layered surfaces, we create a sense of structural depth that feels more like a physical workspace than a digital screen.

2. Colors & Surface Logic
The palette is rooted in a "cool-clean" spectrum. We utilize the Indigo (#4F46E5) not as a mere highlight, but as a structural anchor.
The "No-Line" Rule
Standard UI relies on #E2E8F0 borders to separate ideas. In this system, 1px solid borders are prohibited for sectioning. Boundaries must be defined through background color shifts. To separate a sidebar from a main content area, place a surface-container-low (#EEF4FC) section against a surface (#F6F9FF) background.
Surface Hierarchy & Nesting
Treat the UI as a series of stacked sheets of fine paper.
·	Base Layer:surface (#F6F9FF)
·	Secondary Containers:surface-container-low (#EEF4FC)
·	Priority Components (Cards):surface-container-lowest (#FFFFFF)
The "Glass & Gradient" Rule
To elevate CTAs from "standard" to "premium," use a subtle linear gradient on primary elements:
·	From:primary (#3525CD)
·	To:primary-container (#4F46E5) at a 135-degree angle.

For floating overlays (modals/popovers), use Glassmorphism: surface_container_lowest at 80% opacity with a 20px backdrop-blur.

3. Typography
We utilize the Inter sans-serif stack to achieve a technical, yet approachable editorial feel. The hierarchy is designed to guide the eye through high-density data without fatigue.
Level	Token	Size	Weight	Tracking	Purpose
Display	display-md	2.75rem	700	-0.02em	Hero stats, key metrics
Headline	headline-sm	1.5rem	600	-0.01em	Section headers
Title	title-sm	1.0rem	600	0.01em	Card titles, navigation
Body	body-md	0.875rem	400	0	Standard text, inputs
Label	label-sm	0.6875rem	500	0.04em	Uppercase tags, captions

Editorial Note: Always pair a display-md metric with a label-sm subtitle to create high-contrast, professional lockups.

4. Elevation & Depth
We eschew traditional "box shadows" in favor of Tonal Layering.
·	The Layering Principle: Depth is achieved by "stacking." A surface-container-lowest card placed on a surface-container-low background creates a natural lift.
·	Ambient Shadows: If a shadow is required for a floating element, use a multi-layered diffusion:
o	0 4px 24px -2px rgba(22, 28, 34, 0.06)
o	0 2px 8px -1px rgba(22, 28, 34, 0.04)
·	The "Ghost Border" Fallback: Where accessibility requires a container edge, use the outline-variant (#C7C4D8) at 15% opacity. Never use a 100% opaque border.

5. Components
Buttons
·	Primary: Gradient fill (primary to primary-container), White text, DEFAULT (8px) radius.
·	Secondary:surface-container-highest background with on-surface text. No border.
·	Tertiary: Pure ghost style. on-surface text, background appears only on hover (surface-container-low).
Input Fields
·	Container:surface-container-lowest background.
·	Border: Use the "Ghost Border" (15% outline-variant). On focus, transition border to primary and add a 2px primary-fixed outer glow.
·	Density: Use spacing-2.5 (0.5rem) for internal vertical padding to maintain a compact, professional feel.
Cards & Lists
Forbid the use of divider lines. To separate list items, use a background toggle: even rows remain surface, odd rows use surface-container-low. Alternatively, use spacing-4 (0.9rem) of vertical white space to let the content breathe.
Floating Chips
·	Selection:secondary-container (#6CF8BB) background with on-secondary-container (#00714D) text.
·	Radius: Always use full (9999px) for chips to contrast against the DEFAULT (8px) corners of the main UI.

6. Do’s and Don’ts
Do:
·	Use "Optical Alignment": Sometimes a center-aligned icon looks heavy. Offset it by 0.5 (0.1rem) to balance the visual weight.
·	Embrace Density: Use spacing-3 and spacing-3.5 for grid gaps. The system thrives on "compact precision."
·	Tint your Grays: All neutrals should have a hint of blue/indigo to maintain the "cool" professional tone.
Don’t:
·	Don't use pure black: Use on-surface (#161C22) for text to avoid harsh optical vibration against white backgrounds.
·	Don't use "Large" or "XL" corners for core UI: Keep the "Architectural" feel by sticking to DEFAULT (8px) or md (12px) for containers.
·	Don't use dividers: If you feel the need to add a line, try adding 0.5rem of whitespace or a subtle background color shift first.
