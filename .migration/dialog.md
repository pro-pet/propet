# dialog

2026-09-25, golden pair via CLI with ProPet button/icon replay, migrated to Base UI.

## Changed

- `packages/ui/src/components/dialog.tsx`: mapped Overlay to Backdrop and Content to Popup, and changed Radix `asChild` composition to Base UI `render`.
- Preserved the existing background, spacing, close button, Hugeicons, footer, title, and description styling.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui"` finds no matches in the component file.

## Left alone

- `drawer.tsx` remains Vaul-backed by design; Vaul is outside this Radix migration.

## Behavior changes

- Base UI uses transition state attributes (`data-open`/`data-closed`) and `render` composition. Dialog focus callbacks would need `initialFocus`/`finalFocus` if future consumers use them.

## Verify by hand

Open and close the dialog with mouse, Enter, Space, and Escape. Verify focus returns to the trigger, the backdrop dismisses correctly, the close button is announced, and a hidden or visible `DialogTitle` is present.
