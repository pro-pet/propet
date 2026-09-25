# dropdown-menu

2026-09-25, golden pair via CLI with Hugeicons and class replay, migrated to Base UI Menu.

## Changed

- `packages/ui/src/components/dropdown-menu.tsx`: mapped DropdownMenu to Base UI Menu, including Portal/Positioner/Popup, GroupLabel, SubmenuRoot/SubmenuTrigger, and separate checkbox/radio indicators.
- Replaced Radix state and CSS variable hooks with Base UI `data-open`, `data-closed`, `data-popup-open`, `--available-height`, `--anchor-width`, and `--transform-origin` hooks.
- Updated `apps/web/app/(main)/mine/page.tsx` to use `render` for the trigger and `onClick` for menu items.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui"` finds no matches in the component and consumer files.

## Left alone

- Menu icon visuals remain Hugeicons.

## Behavior changes

- Radix `asChild` became `render`; Radix `onSelect` call sites became `onClick`.
- Base UI checkbox and radio menu items default to `closeOnClick={false}`. No current checkbox/radio item requires an explicit close, so this difference remains flagged.

## Verify by hand

Open the menu with mouse and keyboard, exercise typeahead and Arrow navigation, open the submenu, switch themes, activate privacy/support actions, and verify outside click and Escape dismissal.
