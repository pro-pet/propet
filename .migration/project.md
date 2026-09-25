# project

2026-09-25, whole-project Radix-to-Base UI migration completed with registry golden pairs plus targeted transformation for custom Slot and animated tabs wrappers.

## Changed

- Switched `packages/ui/components.json` from `radix-maia` to `base-maia`.
- Added `@base-ui/react` to `packages/ui` and removed `radix-ui` after the final migrated wrapper.
- Migrated avatar, badge, button, checkbox, dialog, dropdown-menu, form Slot helper, popover, scroll-area, select, tabs, and animated tabs.
- Swept app call sites for `asChild`, Radix menu `onSelect`, Radix popover focus callbacks, and form Slot composition.
- The UI source and app source have zero `@radix-ui`/`radix-ui` imports. The only remaining Radix-style state selectors are in the intentionally untouched Vaul Drawer, and no Base UI migration code depends on them.

## Left alone

- `packages/ui/src/components/drawer.tsx`: Vaul is a third-party drawer library, not Radix; the migration skill explicitly requires leaving it alone.
- `packages/ui/src/components/carousel.tsx`: Embla carousel, intentionally untouched.
- `packages/ui/src/components/emoji-picker.tsx`: emoji-mart integration, intentionally untouched.
- `packages/ui/src/components/animate-ui/primitives/effects/*` and custom motion Slot/Highlight helpers: no Radix dependency.

## Behavior changes

- Base UI uses `render` instead of Radix `asChild`.
- Overlay components now use Base UI Positioner/Popup or Backdrop anatomy and Base UI state attributes/CSS variables.
- Base UI Tabs use manual activation by default; menu checkbox/radio items default to `closeOnClick={false}`.
- The existing Web popover's Radix focus callback was replaced with `initialFocus={false}`.

## Verify by hand

- Open dialogs, popovers, and dropdown menus; exercise Escape, outside click, focus return, keyboard navigation, submenu typeahead, and menu actions.
- Check select scrolling, item selection, checkbox state, avatar fallback, and all button/badge variants.
- Verify auth and publish form validation after the FormControl render migration.

## Validation

- Baseline before changes: Web typecheck passed and full `pnpm build` passed. UI lint had three pre-existing errors and ten warnings.
- Final: `pnpm --filter @propet/ui exec tsc --noEmit` passed; `pnpm --filter web typecheck` passed; `pnpm build` passed.
- `pnpm --filter @propet/ui lint` now has no migration errors. It still reports the baseline trailing-space error in `animate-ui/primitives/effects/highlight.tsx` and the baseline warnings in `highlight.tsx` and `carousel.tsx`; these files were intentionally left alone.
- `pnpm --filter @propet/service test --runInBand` passed: 2 suites and 3 tests.
- `pnpm --filter @propet/service test:e2e --runInBand` remains blocked by the pre-existing test environment requirements for `JWT_SECRET` and `DATABASE_URL`; the application code was not changed by this migration.
