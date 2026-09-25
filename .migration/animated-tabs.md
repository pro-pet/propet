# animated-tabs

2026-09-25, transformation engine with Base UI tabs mapping, migrated to Base UI.

## Changed

- `packages/ui/src/components/animate-ui/primitives/base/tabs.tsx`: replaced the Radix Tabs primitive with Base UI Root/List/Tab/Panel while retaining motion, Highlight, AutoHeight, and controlled state behavior.
- Moved the local animated tabs component directory from `animate-ui/.../radix` to `animate-ui/.../base` and updated its imports.
- Mapped `forceMount` behavior to Base UI `keepMounted` and replaced Radix active/disabled selectors with Base UI state selectors.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui"` finds no matches in the animated tabs files.

## Left alone

- The local motion `Slot` and Highlight helpers are not Radix primitives and were intentionally left alone.

## Behavior changes

- Base UI tabs use manual activation by default; the animated wrapper keeps that behavior and now uses `data-active`/`aria-disabled` selectors.

## Verify by hand

If this component is enabled, click and keyboard-navigate tabs, verify the highlight follows the active tab, confirm panel enter/exit motion, and test both `auto-height` and `layout` content modes.
