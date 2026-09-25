# popover

2026-09-25, golden pair via CLI with customized class replay, migrated to Base UI.

## Changed

- `packages/ui/src/components/popover.tsx`: replaced Radix Content with Base UI Portal/Positioner/Popup and forwarded all positioning props to Positioner.
- Replaced the primitive title/description implementations with Base UI parts and preserved the existing wrapper exports.
- Updated `apps/web/components/post-engagement-bar.tsx` to use `render` and `initialFocus={false}`.
- `PopoverAnchor` is retained as an inert compatibility span because Base UI has no equivalent anchor part.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui"` finds no matches in the component and consumer files.

## Left alone

- Emoji picker internals remain unchanged; only the surrounding popover composition changed.

## Behavior changes

- `onOpenAutoFocus` is replaced at the current call site with `initialFocus={false}`. Base UI owns focus details rather than exposing Radix's cancellable event.
- Popover positioning is handled by Positioner and uses Base UI CSS variables.

## Verify by hand

Open the emoji popover from the composer, confirm it opens above the trigger, does not steal focus from the input, dismisses on Escape/outside click, and restores focus to the trigger.
