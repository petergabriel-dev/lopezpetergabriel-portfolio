# Foundation component specs

All component examples consume semantic tokens from `tokens.css`. Values below are role contracts, not implementation-specific markup.

## 1. EditorShell

**Purpose:** Frame the portfolio as one calm editor window.

**Anatomy:** shell frame, `EditorTabBar`, active `ContentPanel`, persistent `StatusBar`.

**States:** default, keyboard focus within, reduced motion, light theme, dark theme.

**Token contract:** `--color-surface-page`, `--color-surface-panel`, `--color-border-default`, `--radius-shell`, `--space-*`, `--font-family-ui`.

**Behavior:** Use a viewport-locked `100dvh` frame with a `40rem` minimum. Keep header, tab row, active panel, and status bar in one visual frame; the active panel owns scrolling at normal heights, while shorter viewports may scroll the document to keep the footer reachable. Navigation must not duplicate tabs elsewhere.

**Responsive:** Use fluid inline padding from the spacing scale. Preserve shell hierarchy at narrow widths. Let the tab row wrap instead of scrolling horizontally; never introduce a sidebar or fixed-width shell.

**Accessibility:** Use a `main` landmark for active content. Keep contrast between shell, panel, and borders in both themes. Do not rely on editor chrome to communicate current location.

## 2. EditorTabBar and EditorTab

**Purpose:** File-like navigation for four content panels.

**Anatomy:** tab list, four tab buttons, active indicator connected to panel.

**States:** active, inactive, hover, focus-visible, disabled only if a panel is unavailable.

**Token contract:** `--font-family-ui`, `--font-size-body-small`, `--color-content-secondary`, `--color-content-primary`, `--color-surface-raised`, `--color-border-default`, `--color-border-focus`, `--space-3`, `--space-4`.

**Behavior:** Fixed order: `about.md`, `projects.tsx`, `experience.json`, `contact.md`. Clicking or keyboard activation swaps panel in place. Use `role="tablist"`, `role="tab"`, `aria-selected`, and `aria-controls`.

**Responsive:** Tab list wraps onto additional rows on narrow screens. Keep labels intact; do not abbreviate extensions, introduce horizontal scrolling, or convert to a select.

**Accessibility:** Active state must have text/shape distinction, not color alone. Ensure focused tabs remain visible when scrolled into view. Support arrow-key navigation if using roving tabindex.

## 3. ContentPanel and TypingHeadline

**Purpose:** Provide a readable active-file canvas and one deliberate arrival moment.

**Anatomy:** panel heading, body content, optional code-flavored metadata, headline cursor.

**States:** loading headline, settled headline, reduced motion, empty/error only when implementation needs them.

**Token contract:** `--color-surface-panel`, `--color-content-primary`, `--color-content-secondary`, `--font-family-body`, `--font-family-mono`, `--font-size-display`, `--line-height-body`, `--measure-body`, `--space-*`, motion tokens.

**Behavior:** `about.md` headline types once on first page load, then settles. Other panels appear without element-by-element reveal. Panel changes swap instantly with no transition.

**Responsive:** Keep text measure below `--measure-body`; let headings wrap naturally. Use fluid panel padding. Cursor must not force horizontal overflow.

**Accessibility:** Render final headline in the DOM immediately or expose it to assistive tech without waiting for animation. Disable typing under reduced motion. Keep body copy as normal text, not a canvas.

## 4. StatusBar

**Purpose:** Persistent editor footer with branch flavor, availability, and resume action.

**Anatomy:** decorative `⎇ main`, `AvailabilityBadge`, resume download link.

**States:** normal, focus-visible link, narrow-width wrapping, dark theme.

**Token contract:** `--color-status-surface`, `--color-status-content`, `--color-positive`, `--font-family-ui`, `--font-size-label`, `--space-3`, `--space-4`.

**Behavior:** Keep status bar visually attached to shell bottom. Branch label is decorative context, not a control. Resume opens/downloads embedded PDF when implementation is ready.

**Responsive:** Use a fluid flex layout that may wrap. Keep availability text readable; do not truncate it to an icon.

**Accessibility:** Mark decorative branch symbol as hidden from assistive tech if redundant. Give resume link a clear accessible name including file type/action.

## 5. AvailabilityBadge

**Purpose:** Make contract availability explicit and consistent.

**Anatomy:** status dot, text label `available for contract work`.

**States:** available, unavailable/future state, reduced motion, focus only if interactive.

**Token contract:** `--color-positive`, `--color-status-content`, `--font-family-ui`, `--font-size-label`, `--space-2`, `--radius-pill`, motion tokens.

**Behavior:** Green always means availability/success. Optional pulse is subtle and never the sole signal. Repeat in contact panel for emphasis.

**Responsive:** Text can wrap or move below the dot without losing the label. Badge remains content-sized; no fixed width.

**Accessibility:** Include text in DOM. Stop pulse under `prefers-reduced-motion`. If availability changes dynamically, announce only meaningful changes.

## 6. ProjectCard

**Purpose:** Show curated case studies as proof, not as a tool list.

**Anatomy:** project title, client/context, problem → build → outcome paragraph, `TagChip` list, wrapping step chain.

**States:** default, hover, focus-within, reduced motion.

**Token contract:** `--color-surface-raised`, `--color-border-default`, `--color-border-focus`, `--color-content-primary`, `--color-content-secondary`, `--color-surface-inset`, `--color-link`, `--radius-card`, `--radius-control`, `--space-*`, motion tokens.

**Behavior:** Shipped cards are Multi-Agent Branding Guide Generator and Regional Data Warehouse System. Descriptions stay honest; no fabricated screenshots or metrics. Each step chain names every stage in order and uses decorative arrow separators.

**Responsive:** The projects column stacks cards. Step nodes wrap inside the card without a second horizontal scrollbar. Tags wrap. Card content remains readable without hover.

**Accessibility:** Use a heading hierarchy and a text alternative for each step chain. Decorative arrows are hidden from assistive technology. Hover lift must have a focus-visible equivalent.

## 7. RepoList

**Purpose:** Show current public GitHub repositories beside curated project work.

**Anatomy:** linked repository name, optional description, language text, star count, absolute UTC updated date, profile link.

**States:** default, hover, focus-visible, short snapshot.

**Token contract:** `--color-link`, `--color-link-hover`, `--color-border-focus`, `--color-border-subtle`, `--color-content-secondary`, `--font-family-ui`, `--font-size-body-small`, `--font-size-label`, `--space-*`.

**Behavior:** Render committed `content/github.ts` data only. Repository and profile links use `rel="noopener noreferrer"`; an empty repository array renders no shell. Dates are absolute and the visible snapshot sync date identifies staleness.

**Responsive:** Rows remain readable in the narrow GitHub column. Metadata wraps as text; no icon-only language or star indicators.

**Accessibility:** Repository names are `h3` links. Language, stars, dates, and profile action remain real text with visible focus.

## 8. ContributionGrid

**Purpose:** Show one year of public contribution activity without a runtime GitHub request.

**Anatomy:** accessible total, month labels, seven-row day cells, Less/More legend, bounded horizontal viewport.

**States:** light theme, dark theme, narrow viewport, empty only when snapshot validation permits it.

**Token contract:** `--color-contribution-0` through `--color-contribution-4`, `--color-content-primary`, `--color-content-secondary`, `--font-family-ui`, `--font-size-body-small`, `--font-size-label`, `--radius-control`, `--space-*`.

**Behavior:** Render snapshot weeks as static markup in a `role="img"` region named by the real yearly total. The grid owns horizontal overflow; the page and panel do not. The visible sync date belongs to `ProjectsPanel`.

**Responsive:** Keep cells and gaps on spacing tokens. Scroll the grid inside its own viewport when the GitHub column is narrower than one year.

**Accessibility:** The accessible name states the real total. Cells and legend swatches are presentational; Less/More remains visible as a visual supplement.

## 9. TagChip

**Purpose:** Compact, scannable technology/context labels.

**Anatomy:** plain text chip; optional link only when chip represents a real destination.

**States:** default, hover/focus only when interactive.

**Token contract:** `--color-surface-inset`, `--color-content-secondary`, `--color-border-subtle`, `--font-family-ui`, `--font-size-label`, `--space-2`, `--space-3`, `--radius-pill`.

**Behavior:** Use tags from each case study without turning them into a taxonomy or decorative rainbow. Accent meaning stays semantic; neutral chips are preferred.

**Responsive:** Wrap naturally with consistent gaps. Do not horizontally scroll tags separately from their card.

**Accessibility:** Text must remain legible in both themes. If noninteractive, do not add button semantics or misleading click affordance.

## 10. ExperienceRecord

**Purpose:** Present chronology with JSON/editor flavor while staying human-readable.

**Anatomy:** key/value rows, role heading, organization, date range, readable description, education record.

**States:** default, current role emphasis, focus only for links.

**Token contract:** `--color-code-key`, `--color-code-string`, `--color-code-number`, `--color-code-punctuation`, `--color-content-primary`, `--color-content-secondary`, `--font-family-mono`, `--font-family-body`, `--space-*`.

**Behavior:** Show chronological roles: DILG Region VI; Adsome / Stromberg Media AB; Theory of Khaos; Sieitz Innovations OPC; Zenlabs Venture Management; BS Computer Science at Iloilo Science and Technology University. Syntax colors support scanability; prose remains normal text.

**Responsive:** Rows may stack key above value on narrow screens. Dates must not collide with role text. Avoid literal JSON that requires horizontal scrolling.

**Accessibility:** Use headings and lists, not color-coded spans alone. Expose dates as text. Mark punctuation decorative where appropriate.

## 11. ContactAction

**Purpose:** Offer honest, direct contact paths without a fake form.

**Anatomy:** email link, GitHub link, LinkedIn label/placeholder, repeated `AvailabilityBadge`.

**States:** default, visited, hover, focus-visible, unavailable LinkedIn URL.

**Token contract:** `--color-link`, `--color-link-hover`, `--color-border-focus`, `--font-family-body`, `--font-family-ui`, `--space-*`, `--radius-control`.

**Behavior:** Email `lopezpetergabriel@gmail.com`; GitHub `github.com/petergabriel-dev`; LinkedIn remains labeled until actual profile URL is supplied. Never submit contact data to an external service.

**Responsive:** Stack contact actions when inline space is limited. Links must remain comfortably targetable without fixed-width buttons.

**Accessibility:** Use real anchors with descriptive names. Do not render a dead LinkedIn URL as if it were active. Preserve visible focus and sufficient contrast in both themes.
