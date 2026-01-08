# Implementation Plan: Territory Section Tooltips

**Date:** 2026-01-08
**Tasks:** Add tooltips to territory section (Tasks 1 & 2 from TO-DOS.md)

## Overview

Add informative tooltips to the territory selector section to help users understand:
1. What the "Release worldwide" checkbox does
2. How the dual-panel territory system works (included vs excluded territories)

## Context

### Current Implementation
- **Territory Selector:** `src/components/territory/TerritorySelector.tsx`
- **Territory Panel:** `src/components/territory/TerritoryPanel.tsx`
- **Tooltip System:** Uses `FieldTooltip` component from `src/components/ui/FieldTooltip.tsx`
- **Tooltip Content:** Centralized in `src/lib/tooltipContent.ts`

### Existing Patterns
The codebase already has a well-established tooltip system:
- `FieldTooltip` component wraps labels with info icons
- Tooltip content is stored in `tooltipContent.ts` with typed keys
- Tooltips use the shadcn/ui Tooltip components
- Standard pattern: `<FieldTooltip label="..." fieldKey="..." htmlFor="..." />`

## Tasks Breakdown

### Task 1: Add tooltip to "Release worldwide" checkbox header
**Location:** `src/components/territory/TerritorySelector.tsx:233-240`

#### Current Code
```tsx
<div className="flex items-center space-x-2">
  <Checkbox
    id="worldwide"
    checked={data.isWorldwide}
    onCheckedChange={handleWorldwideChange}
  />
  <Label htmlFor="worldwide" className="mb-0">Release worldwide</Label>
</div>
```

#### Implementation Steps
1. **Update `tooltipContent.ts`:**
   - Add new key `releaseWorldwide` to `TooltipFieldKey` type
   - Add tooltip content explaining:
     - When checked: release is available in all territories worldwide
     - When unchecked: enables territory-specific restrictions via dual-panel selector

2. **Modify TerritorySelector.tsx:**
   - Import `FieldTooltip` component
   - Replace the `<Label>` element with `<FieldTooltip>` component
   - Adjust layout/styling to accommodate the info icon

#### Expected Outcome
```tsx
<div className="flex items-center space-x-2">
  <Checkbox
    id="worldwide"
    checked={data.isWorldwide}
    onCheckedChange={handleWorldwideChange}
  />
  <FieldTooltip
    label="Release worldwide"
    fieldKey="releaseWorldwide"
    htmlFor="worldwide"
  />
</div>
```

### Task 2: Add tooltips for included and excluded territory panels
**Location:** `src/components/territory/TerritoryPanel.tsx:27-29`

#### Current Code
```tsx
<div className="flex items-center justify-between mb-3">
  <h3 className="text-sm font-semibold text-foreground">{title}</h3>
  <Badge variant={badgeVariant} className={badgeColor}>
    {count} {count === 1 ? 'territory' : 'territories'}
  </Badge>
</div>
```

#### Implementation Steps
1. **Update `tooltipContent.ts`:**
   - Add new keys:
     - `includedTerritories`: Explains that territories in this panel will receive the release
     - `excludedTerritories`: Explains that territories in this panel will NOT receive the release

2. **Modify TerritoryPanel.tsx:**
   - Add `tooltipKey` prop to `TerritoryPanelProps` interface (in `types.ts`)
   - Import `FieldTooltip` component
   - Conditionally render tooltip with panel title
   - OR use custom tooltip text via tooltipText prop if we want panel-specific messaging

3. **Update TerritorySelector.tsx:**
   - Pass appropriate `tooltipKey` prop to each `TerritoryPanel` component
   - For included panel: `tooltipKey="includedTerritories"`
   - For excluded panel: `tooltipKey="excludedTerritories"`

#### Alternative Approach
Instead of using `FieldTooltip` (which is designed for form field labels), we could:
- Use the raw Tooltip components directly in the panel header
- Keep the h3 styling while adding an info icon next to it
- This preserves the visual hierarchy better than converting h3 to a label

#### Expected Outcome
```tsx
<div className="flex items-center justify-between mb-3">
  <div className="flex items-center gap-1.5">
    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <Info className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p>{tooltipContent[tooltipKey]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
  <Badge variant={badgeVariant} className={badgeColor}>
    {count} {count === 1 ? 'territory' : 'territories'}
  </Badge>
</div>
```

## Proposed Tooltip Content

### releaseWorldwide
```
"Check this box to make your release available in all territories worldwide. Uncheck to specify which territories should or should not receive your release using the panels below."
```

### includedTerritories
```
"Territories in this panel will receive your release. Select or deselect territories to move them between the included and excluded panels."
```

### excludedTerritories
```
"Territories in this panel will NOT receive your release. Select or deselect territories to move them between the included and excluded panels."
```

## Files to Modify

1. **`src/lib/tooltipContent.ts`**
   - Add 3 new keys to `TooltipFieldKey` type
   - Add 3 new entries to `tooltipContent` object

2. **`src/components/territory/TerritorySelector.tsx`**
   - Import `FieldTooltip`
   - Replace Label with FieldTooltip for "Release worldwide" checkbox

3. **`src/components/territory/TerritoryPanel.tsx`**
   - Import Tooltip components and Info icon
   - Add tooltip UI to panel header
   - Accept tooltipKey prop

4. **`src/components/territory/types.ts`**
   - Add `tooltipKey?: TooltipFieldKey` to `TerritoryPanelProps` interface

## Testing Checklist

- [ ] Tooltip appears next to "Release worldwide" checkbox
- [ ] Tooltip content is clear and accurate for worldwide checkbox
- [ ] Tooltip appears next to "Included Territories" header
- [ ] Tooltip appears next to "Excluded Territories" header
- [ ] Tooltip content accurately describes panel behavior
- [ ] Info icons match existing design system patterns
- [ ] Tooltips have appropriate delay and positioning
- [ ] Tooltips work on both desktop and mobile
- [ ] No layout shifts or styling issues introduced
- [ ] TypeScript compilation succeeds with no errors

## Notes

- The territory selector already has smart export logic (uses whichever list is shorter)
- The tooltip should NOT explain this internal logic - focus on user-facing behavior
- Consider whether tooltips need to mention the "smart export" feature or just explain the UI behavior
- The existing tooltip system uses 200ms delay duration
- Tooltips use "max-w-xs" for content width constraint
