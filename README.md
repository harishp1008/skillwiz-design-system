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
1. **Button label weight:** type notes say 500, the page renders 700. Both kept as `type.button.weight-notes` and `type.button.weight-rendered` (and `button.font-weight-notes` / `-rendered`). No `button.font-weight` exists until decided.
2. **Near-duplicate blues:** `color.blue.e4f0fe` (Blue tint, documented) and `color.blue.e6f0fd` ("Watching" chip, provisional) are separate until reviewed.
3. **Undocumented colours (provisional):** `#D0D5DD`, `#E4E7EC`, `#F2F4F7`, `#F8FAFC`, `#475467`, `#9EC5F5` (the last is style-guide chrome only).
4. **Retired `#7A271A`:** retired as a Critical card stripe (`color.retired.critical-stripe`, never referenced) but still documented as Danger text (`color.danger.text`, unresolved).
5. **Off-scale spacing:** 14 and 18 (card padding 14x18, card gap 14) are provisional; the axis order of 14x18 is not stated.
6. **Question strip cell radius:** documented 4px, rendered 2px.
7. **Not defined in the style guide, so not tokenised:** line-heights, shadows, elevation, motion beyond the press animation, breakpoints, border widths.

## Token hierarchy (enforced by `npm run tokens`)

- **Primitive**: raw values only; no references.
- **Semantic**: references to primitive tokens only; no raw values.
- **Component**: references to semantic tokens only, or a raw component-specific value with `"$source"`:
  `"documented"` (the style guide specifies it) or `"observed"` (allowed only while the token is flagged `provisional` or `unresolved`).
  Component tokens may never reference primitives directly, and may not mix references with literals.
- **Descriptions** (`$description`) state purpose and usage. They may not contain literal design values (hex, px, ms, %, ratios, weights, sizes); values live in `$value`. Token paths such as `color.blue.e4f0fe` are allowed.
- Statuses (`provisional`, `unresolved`, `retired`) are written only on the directly flagged token; inherited flags are computed by the generator.

Tests: `npm run test:tokens` (included in `npm run check`).
