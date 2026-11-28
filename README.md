# Skillwiz design system

Custom React + TypeScript component library. No third-party component libraries. Styling is CSS Modules driven by design tokens.

## Rules
- Token source of truth: `tokens/primitive.json`, `tokens/semantic.json`, `tokens/component.json`.
- `src/styles/tokens.css` and `src/tokens/tokens.generated.ts` are generated. Never edit them; run `npm run tokens`.
- Components use `var(--sw-*)` tokens only, with no hardcoded colours, sizes or radii.
- Layering: primitive has no references; semantic references primitive; component references semantic or primitive.
- Storybook stories import the real component from `src/components/<Name>/`.

## Commands
- `npm install`, then `npm run dev` (Storybook on :6006)
- `npm run tokens` / `npm run tokens:check`
- `npm run check` (tokens up to date, typecheck, library build)

## Token status
Each token can carry `$description` and `$status` (`provisional`, `unresolved`, `retired`). Status propagates to any token that references a flagged one. Stories show the badge; `npm run tokens` prints the counts.

## Unresolved decisions (open for review)
1. **Retired `#7A271A`:** retired as a Critical card stripe (`color.retired.critical-stripe`, never referenced) but still documented as Danger text (`color.danger.text`, unresolved).
2. **Off-scale spacing:** 14 and 18 (card padding 14x18, card gap 14) are provisional; the axis order of 14x18 is not stated.
3. **Not defined in the style guide, so not tokenised:** line-heights, shadows, elevation, motion beyond the press animation, breakpoints, border widths.

## Resolved decisions
- **Button label weight:** bold (as rendered on the style guide page). `type.button.weight` → `font-weight.bold`; `button.font-weight` → `type.button.weight`.
- **Question strip cell radius:** the documented chip/cell radius. `question-strip.cell.radius` → `radius.chip`.

## Token hierarchy (enforced by `npm run tokens`)

- **Primitive**: raw values only; no references.
- **Semantic**: references to primitive tokens only; no raw values.
- **Component**: references to semantic tokens only, or a raw component-specific value with `"$source"`:
  `"documented"` (the style guide specifies it) or `"observed"` (allowed only while the token is flagged `provisional` or `unresolved`).
  Component tokens may never reference primitives directly, and may not mix references with literals.
- **Descriptions** (`$description`) state purpose and usage. They may not contain literal design values (hex, px, ms, %, ratios, weights, sizes); values live in `$value`. Token paths such as `color.blue.75` are allowed.
- Statuses (`provisional`, `unresolved`, `retired`) are written only on the directly flagged token; inherited flags are computed by the generator.

Tests: `npm run test:tokens` (included in `npm run check`).

## Components

### Button

`src/components/Button` — React + CSS Modules, styled only through `--sw-button-*` component tokens (which reference semantic tokens).

- Variants: `primary`, `secondary` (default), `accent`, `ghost`, `link`, `danger`, `danger-secondary`
- Sizes: `sm` (28), `md` (36), `lg` (44)
- Props: `label`, `icon`, `iconPosition`, `iconOnly` + `ariaLabel`, `pressed` (aria-pressed), `loading` (aria-busy, spinner, clicks blocked), `disabledReason` (aria-disabled + tooltip + aria-describedby; never the `disabled` attribute), `fullWidth`, `live`, `href` (renders `<a>`)
- Notes: line-heights are not tokenised; tooltips are native `title` until a Tooltip component exists; `icon` is a ReactNode until an Icon component exists.

### Top navigation bar

`src/components/TopNav` — React + CSS Modules, styled only through `--sw-top-nav-*` component tokens (which reference semantic tokens, or carry a documented/observed raw value).

- Props: `items` + `currentId`, `contexts` / `contextId` / `contextKind` (fewer than two contexts hides the selector), `mail` / `messages` / `notifications` (`{ count }` or `false`), `initials`, `maxVisible`, callbacks. `mode`, `scrolled`, `forceState`, `defaultOpen` are for documentation.
- Layouts by measured width: ≥1440 (up to `maxVisible` items, rest in More), 1024–1439 (Mail moves into the avatar menu), <1024 (menu button + drawer). Breakpoints are the `TOP_NAV_BREAKPOINTS` constant because media queries cannot read CSS variables.
- Notes: badge is blue as drawn (the PDF token list says red); icon buttons are round and outlined as drawn; shadows, easing and menu width are provisional; tooltips are native `title`; the item-fit calculation is an estimate from label length.

### Chip, tag & badge

Three small labels with one rule: square corners are labels you read, round corners are controls you press.

- `Badge` (tones: neutral, info, success, warning, danger; subtle or solid) and `CountBadge` are read-only.
- `Tag` is read-only, neutral and outlined.
- `Chip`, `ChipGroup` (single or multi select) and `InputChip` are the interactive ones.

Docs: **Components / Chip, tag & badge** in Storybook (Guidelines page plus one playground per part). New tokens: `badge.*`, `tag.*`, `filter-chip.*`, `count-badge.*`, and a semantic `color.feedback.*` family. The older `chip.*` tokens stay until the Live wall screens move to badges.

### Select, dropdown & menu

`Select` (single, multi, searchable) and `Menu` (action menu) share one floating panel. Source: `src/components/Dropdown`; page: **Components / Select, dropdown & menu** in Storybook.

```tsx
import { Select, Menu } from '@skillwiz/design-system';

<Select label="Classroom" options={rooms} value={room} onChange={setRoom} />
<Menu iconLabel="More actions for Achintya Sharma" align="end" entries={rowActions} />
```

Tokens: component groups `dropdown`, `select` and `menu`, built on the new semantic `size.control.*`, `shadow.overlay`, `layer.dropdown` and `type.helper`.

### Tabs

`Tabs` has four variants: underline (large and small), card, vertical list and pill. WAI-ARIA tabs pattern with roving focus and automatic or manual activation. Source: `src/components/Tabs`; page: **Components / Tabs** in Storybook. New tokens: `tabs.*`, `motion.duration.fast`, `motion.easing.standard`.

```tsx
import { Tabs } from '@skillwiz/design-system';

<Tabs label="Student activity" items={[{ id: 'overview', label: 'Overview', panel: <Overview /> }, { id: 'flags', label: 'Flags', count: 3, alert: true, panel: <Flags /> }]} />
```

### Icons

`Icon` is the shared line icon (Lucide shapes, 24 grid, 2 unit line, `currentColor`). Add an icon by pasting its path into `src/components/Icon/icons.ts`. Page: **Icons / Icon set** in Storybook. New tokens: `icon.*`, `size.icon.*`, primitives `size.16`, `size.20`, `size.24`.

```tsx
import { Icon } from '@skillwiz/design-system';

<Icon name="book-open" />
<Icon name="link" size="lg" label="Copy link" />
```

### Avatar

`Avatar` shows a person's photo, or their initials on one of eight paper-cut tones picked from the user ID (same person, same colour). Art from 40px up, flat tone fill at 32px and below. Optional presence dot (proctor screens), muted state, and `AvatarGroup` (four, then +N). Source: `src/components/Avatar`; page: **Components / Avatar** in Storybook. New tokens: `color.avatar.*` (eight tone pairs), `color.border.photo`, `size.avatar.*`, `type.avatar.*`, `avatar.*`.

```tsx
import { Avatar, AvatarGroup } from '@skillwiz/design-system';

<Avatar name="Aarav Nair" userId="AARAV2026" />
<Avatar name="Rohit Das" userId="ROHIT2026" size="sm" status="idle" statusLabel="Idle 2 min" decorative />
```

The tone art in `src/components/Avatar/art/` was taken from the design PDF at 160px. Replace the eight files with the 256px originals when you have them.

### Checkbox

`Checkbox` (native input inside a label) with M 20 and S 16 sizes, description, indeterminate, error and disabled states, an option-card variant for multi-answer questions, and `CheckboxGroup` (fieldset + legend). Source: `src/components/Checkbox`; page: **Components / Checkbox** in Storybook. New tokens: `color.border.input` (3 to 1 on white), `size.checkbox.*`, `checkbox.*`.

```tsx
import { Checkbox, CheckboxGroup } from '@skillwiz/design-system';

<Checkbox label="Send results by email" description="Students get their score when results are published." />
```

The multi-select menu in Select/Dropdown still has its own checkbox look; moving it onto `Checkbox` size S is a separate step.

### Text input

`TextInput`: one-line field with label, optional mark, helper/error text, leading icon, suffix, clear button (`clearable`), password Show/Hide, `trim` on blur, and S 28 / M 36 / L 44 sizes. Source: `src/components/TextInput`; page: **Components / Text input** in Storybook. New tokens: `space.input-padding-*`, `space.field-gap`, `space.input-icon-gap`, `size.input-action`, `text-input.*`.

```tsx
<TextInput label="Student ID" placeholder="e.g. VK3456789" error={error} onChange={setId} />
```

### Toggle

`Toggle`: a switch for a setting that applies at once. M 36 × 20 and S 28 × 16, inline or settings-row layout with On/Off text, description, saving state (spinner + `aria-busy`), disabled. Native checkbox with `role="switch"`. Source: `src/components/Toggle`; page: **Components / Toggle**. New tokens: `color.surface.toggle-off`, `shadow.thumb`, `size.toggle.*`, `space.toggle-gap-*`, `toggle.*`.

```tsx
<Toggle label="On watchlist" description="Alerts for this student ring first" checked={on} onChange={setOn} />
```

### Textarea

`Textarea`: multi-line field that starts at 3 rows and grows to 8, then scrolls. Label, optional mark, helper/error, character `limit` with a count (text is kept past the limit, never cut), disabled, read-only, and a `composer` variant (1 → 6 rows, send button inside, Enter sends). Source: `src/components/Textarea`; page: **Components / Textarea**. New tokens: `space.input-padding-y`, `textarea.*`.

```tsx
<Textarea label="Describe the issue" limit={500} helper="Our team reads every report." onChange={setText} />
```

### Component story convention

Every component has exactly two stories under `Components/<Name>`:

- **Guidelines** — the full documentation page built from the component's PDF. Tagged `guidelines`, `layout: 'fullscreen'`; the addon panel is hidden (`.storybook/manager.ts`).
- **Playground** — the component centred (`layout: 'centered'`) with the addon panel and Controls visible.
