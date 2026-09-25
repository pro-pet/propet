# select

2026-09-25, golden pair via CLI with Hugeicons and class replay, migrated to Base UI.

## Changed

- `packages/ui/src/components/select.tsx`: mapped Select Content/Viewport/Scroll buttons to Base UI Positioner/Popup/List/ScrollUpArrow/ScrollDownArrow.
- Replaced `asChild` icon composition with `render`, and exposed `alignItemWithTrigger` in place of Radix `position`.
- Preserved the project's Hugeicons, item checkmark, scrolling, sizing, and visual classes.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui"` finds no matches in the component file.

## Left alone

- There are no current app call sites using the removed Radix `position` prop.

## Behavior changes

- Consumers that used `position="popper"` would now pass `alignItemWithTrigger={false}`; `item-aligned` is the default.

## Verify by hand

Open the select, use typeahead and Arrow/Home/End navigation, choose an item, test grouped labels and separators, and verify long lists scroll with both scroll arrows.
