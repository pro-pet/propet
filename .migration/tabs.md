# tabs

2026-09-25, golden pair via CLI with customized class replay, migrated to Base UI.

## Changed

- `packages/ui/src/components/tabs.tsx`: mapped Root/List/Trigger/Content to Base UI Root/List/Tab/Panel and preserved ProPet variants and classes.
- Updated the active-state implementation to Base UI's `data-active` state.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui"` finds no matches in the component file.

## Left alone

- The separate animated tabs implementation is recorded in `animated-tabs.md`.

## Behavior changes

- Base UI defaults to manual tab activation. This is a deliberate Base UI behavior difference and was not silently patched.

## Verify by hand

Click each tab, use Arrow keys and Home/End, verify the active panel and focus ring, and test horizontal and vertical orientations. Confirm disabled tabs cannot be activated.
