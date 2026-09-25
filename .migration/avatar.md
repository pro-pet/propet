# avatar

2026-09-25, golden pair via CLI with customized fallback replay, migrated to Base UI.

## Changed

- `packages/ui/src/components/avatar.tsx`: replaced Radix Avatar parts with `@base-ui/react/avatar` parts while retaining ProPet's `Avatar` convenience component, generated initials, groups, badges, and custom classes.
- Renamed the fallback timing prop at the primitive boundary from `delayMs` to Base UI's `delay`.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui"` finds no matches in the component file.

## Left alone

- Existing page-level avatar props (`src`, `alt`, `name`, and fallback classes) remain unchanged.

## Behavior changes

- Base UI reports avatar image and fallback state through its transition-aware implementation; fallback delay uses `delay`.

## Verify by hand

Check a valid image, a missing image, and an empty name. Confirm initials, `?` fallback, image failure fallback, `sm`/`default`/`lg` sizes, and badge/group layout.
