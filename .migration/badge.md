# badge

2026-09-25, golden pair via CLI with customized class replay, migrated to Base UI.

## Changed

- `packages/ui/src/components/badge.tsx`: replaced `radix-ui` Slot with Base UI `useRender` and `mergeProps`, keeping the ProPet badge variants and classes.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui"` finds no matches in the component file.

## Left alone

- No current app consumer uses the polymorphic badge path.

## Behavior changes

- `asChild` is replaced by `render`. Base UI merges handlers and class names through `useRender`.

## Verify by hand

Render default, secondary, destructive, outline, ghost, and link badges. Exercise a badge rendered as an anchor and verify its class names, keyboard focus, and click behavior.
