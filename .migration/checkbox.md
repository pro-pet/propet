# checkbox

2026-09-25, golden pair via CLI with Hugeicons and class replay, migrated to Base UI.

## Changed

- `packages/ui/src/components/checkbox.tsx`: replaced Radix Checkbox with `@base-ui/react/checkbox` and changed disabled selectors to Base UI's `data-disabled` state while retaining Hugeicons and visual classes.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui"` finds no matches in the component file.

## Left alone

- Hugeicons remains the project's icon source.

## Behavior changes

- Base UI renders checkbox state with `data-checked`/`data-disabled` attributes. The wrapper continues to accept the standard checked and indeterminate behavior from Base UI.

## Verify by hand

Toggle with mouse, Space, and keyboard focus. Test checked, unchecked, disabled, invalid, and indeterminate states and verify the indicator and accessible name.
