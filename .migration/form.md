# form

2026-09-25, transformation engine for the hand-rolled Slot helper, migrated to Base UI render composition.

## Changed

- `packages/ui/src/components/form.tsx`: replaced Radix Slot in `FormControl` with Base UI `useRender` and `mergeProps`, preserving generated IDs, validation attributes, and react-hook-form behavior.
- Updated login, registration, and publish forms to pass their input or textarea through `FormControl render={...}`.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui"` finds no matches in the component and consumer files.

## Left alone

- The surrounding react-hook-form Controller and context implementation remains project-specific and was not replaced with Base UI Field because this component does not use Radix Form primitives.

## Behavior changes

- `FormControl` now uses Base UI's `render` prop instead of accepting a child through Radix Slot. Existing form controls are updated to the new call shape.

## Verify by hand

Submit each auth form with empty and invalid values, confirm labels and error messages point to the right input, then submit the publish form and verify textarea validation and focus behavior.
