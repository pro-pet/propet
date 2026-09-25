# scroll-area

2026-09-25, golden pair via CLI with customized class replay, migrated to Base UI.

## Changed

- `packages/ui/src/components/scroll-area.tsx`: mapped Root/Viewport/Scrollbar/Thumb/Corner to Base UI and retained the existing wrapper classes.
- Renamed `ScrollAreaScrollbar`/`ScrollAreaThumb` to Base UI's `Scrollbar`/`Thumb` parts.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui"` finds no matches in the component file.

## Left alone

- No `type` prop was used by current consumers, so no call-site change was necessary.

## Behavior changes

- Base UI does not expose Radix's `type` prop. Scrollbar orientation and viewport behavior remain available through the wrapper.

## Verify by hand

Place content taller and wider than its viewport. Drag both scrollbars, use wheel and keyboard scrolling, and verify the thumb and focus ring in both orientations.
