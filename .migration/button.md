# button

2026-09-25, golden pair via CLI with customized class replay, migrated to Base UI.

## Changed

- `packages/ui/components.json`: switched the shadcn base from `radix-maia` to `base-maia`.
- `packages/ui/package.json` and `pnpm-lock.yaml`: added `@base-ui/react` and removed `radix-ui` after the final wrapper migration.
- `packages/ui/src/components/button.tsx`: replaced the Radix Slot/asChild implementation with the real `@base-ui/react/button` primitive, retaining ProPet variants and sizes.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui"` finds no matches in the component file.

## Left alone

- Button consumers that do not use `asChild` kept their existing props and styles.

## Behavior changes

- `asChild` is replaced by Base UI's `render` prop for future custom button elements. Base UI exposes native button state through its own primitive.

## Verify by hand

Render each variant and size, tab to the button, activate it with Enter and Space, and verify disabled and focus-visible states. If using `render`, confirm the composed element receives the click and focus behavior.
