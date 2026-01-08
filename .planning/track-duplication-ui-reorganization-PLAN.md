# Plan: Reorganize Track Duplication UI

**Date:** 2026-01-08
**Type:** Feature Reorganization
**Scope:** UI/UX improvement - move track duplication controls from top-level to per-track actions

---

## Objective

Reorganize the track management UI to make duplication more intuitive by:
1. Moving the duplicate track functionality from top-level controls to per-track buttons (next to "Copy Release Info Button")
2. Removing the redundant top-level action buttons
3. Relocating the "Add Track" button to the bottom of the tracks section with clearer terminology

**Why:** Current UI has duplicate track functionality at the top level, but it's more intuitive to have this action available directly on each track, similar to how the copy release info button works. Having the add track button at the bottom feels more natural as users scroll through existing tracks.

---

## Context

**Key Files:**
- @src/components/track/TrackDetailsHeader.tsx - Currently contains top-level "Add Blank Track" and "Duplicate Track" buttons (lines 24-42)
- @src/components/track/TrackCardHeader.tsx - Contains per-track "Copy Release Info" button (lines 72-83)
- @src/components/CopyTrackModal.tsx - Modal component for selecting which track to duplicate
- @src/components/TrackDetails.tsx - Parent component managing tracks array and track operations
- @src/components/track/TrackCard.tsx - Individual track card component

**Current Implementation:**
- Top-level buttons in TrackDetailsHeader: "Add Blank Track" and "Duplicate Track" (via CopyTrackModal)
- Per-track button in TrackCardHeader: "Copy Release Info" (blue Copy icon)
- `copyFromTrack(sourceIndex)` function in TrackDetails.tsx handles duplication logic

**Design Reference:**
The "Copy Release Info" button (TrackCardHeader.tsx:72-83) provides the pattern for per-track action buttons:
- Ghost variant, small size
- Icon-only (Copy icon)
- Stops propagation to prevent card collapse
- Positioned in header's right action group

---

## Tasks

### Task 1: Add per-track "Copy Existing Track" button with modal
**Type:** feature
**Files:**
- `src/components/track/TrackCardHeader.tsx`
- `src/components/track/TrackCard.tsx`
- `src/components/TrackDetails.tsx`
- `src/components/CopyTrackModal.tsx`

**Action:**
1. Update `CopyTrackModal.tsx`:
   - Add optional `excludeIndex?: number` prop to interface
   - Filter tracks array to exclude the current track: `tracks.filter((_, i) => excludeIndex === undefined || i !== excludeIndex)`
   - Update Dialog to accept `open` and `onOpenChange` props for external control
   - Remove internal DialogTrigger - component will be controlled externally

2. Update `TrackCardHeader.tsx`:
   - Add new prop `onCopyFromTrack: (sourceIndex: number) => void` to interface
   - Add state for modal: `const [copyModalOpen, setCopyModalOpen] = React.useState(false);`
   - Import CopyTrackModal component
   - Add new button after "Copy Release Info" button (after line 83, before line 85):
     - Button with ghost variant, small size
     - Icon: `<Files className="w-4 h-4" />` (import Files from lucide-react)
     - `onClick` handler that stops propagation and opens modal: `setCopyModalOpen(true)`
     - Text color: `text-green-600 hover:text-green-800` (to differentiate from blue "Copy Release Info")
   - Render CopyTrackModal after the button group:
     - Pass `tracks`, `onCopy={onCopyFromTrack}`, `getTrackDisplayTitle` props
     - Pass `excludeIndex={index}` to filter out current track
     - Pass `open={copyModalOpen}` and `onOpenChange={setCopyModalOpen}` for controlled state

3. Update `TrackCard.tsx`:
   - Add `onCopyFromTrack: (sourceIndex: number) => void` to interface (after line 21)
   - Add `getTrackDisplayTitle` to interface if not already present
   - Pass `onCopyFromTrack` prop to TrackCardHeader component
   - Pass `getTrackDisplayTitle` prop to TrackCardHeader component

4. Update `TrackDetails.tsx`:
   - Pass `onCopyFromTrack={copyFromTrack}` prop to TrackCard component (line ~152)
   - Pass `getTrackDisplayTitle={getTrackDisplayTitle}` if not already passed

**Verify:**
- Each track card has a new green "Copy Existing Track" button (Files icon) next to "Copy Release Info" button (blue Copy icon)
- Clicking the button opens a modal showing all OTHER tracks (excludes current track)
- Selecting a track duplicates it and adds to the end of the tracks list
- Modal closes after selection
- New duplicated track becomes expanded

**Done:** Per-track duplication button functional, positioned next to "Copy Release Info"

---

### Task 2: Remove top-level track action buttons
**Type:** removal
**Files:**
- `src/components/track/TrackDetailsHeader.tsx`
- `src/components/TrackDetails.tsx`

**Action:**
1. Update `TrackDetailsHeader.tsx`:
   - Remove the entire button group (lines 24-42)
   - Keep only the header structure: title on left, no buttons on right
   - Update component to simple structure:
     ```tsx
     return (
       <div>
         <h2 className="text-2xl font-bold text-foreground">Track Details</h2>
       </div>
     );
     ```
   - Remove unused imports: `Plus` from lucide-react, `CopyTrackModal` component
   - Remove unused props from interface: `onAddBlankTrack`, `onCopyFromTrack`, `getTrackDisplayTitle`

2. Update `TrackDetails.tsx`:
   - Update TrackDetailsHeader call (lines 143-148) to remove props:
     - Remove `tracks={tracks}`
     - Remove `onAddBlankTrack={addBlankTrack}`
     - Remove `onCopyFromTrack={copyFromTrack}`
     - Remove `getTrackDisplayTitle={getTrackDisplayTitle}`
   - Keep `addBlankTrack` and `copyFromTrack` functions (they're used elsewhere)

**Verify:**
- Track Details header shows only "Track Details" title
- No "Add Blank Track" button at top
- No "Duplicate Track" button at top
- Per-track buttons (from Task 1) still work correctly

**Done:** Top-level buttons removed, header simplified

---

### Task 3: Add "Add New Track" button at bottom of tracks section
**Type:** feature
**Files:**
- `src/components/TrackDetails.tsx`

**Action:**
1. Update `TrackDetails.tsx`:
   - After the tracks map closing tag (after line 173, before the closing `</div>`), add:
     ```tsx
     <div className="flex justify-center pt-4">
       <Button
         type="button"
         variant="outline"
         onClick={addBlankTrack}
         className="flex items-center"
       >
         <Plus className="w-4 h-4 mr-2" />
         Add New Track
       </Button>
     </div>
     ```
   - Ensure `Plus` icon is imported from lucide-react (should already be imported)
   - Ensure `Button` component is imported from '@/components/ui/button' (should already be imported)

**Verify:**
- "Add New Track" button appears at the bottom of all track cards
- Clicking button adds a new blank track to the end of the list
- New track becomes expanded automatically
- Button is centered and uses outline variant
- Button text is "Add New Track" (not "Add Blank Track")

**Done:** Add track button relocated to bottom with updated terminology

---

## Verification

After completing all tasks, verify:

1. **Per-track duplication works correctly:**
   - Each track has a green Files icon button for duplication
   - Modal shows all tracks except the current one
   - Duplicating a track works and adds to end of list
   - Audio file and ISRC codes are NOT copied (excluded as expected)

2. **Top-level buttons are removed:**
   - Track Details header shows only title, no action buttons
   - No "Add Blank Track" at top
   - No "Duplicate Track" at top

3. **Bottom add button works:**
   - "Add New Track" button appears at bottom
   - Button adds blank track to end of list
   - New track auto-expands

4. **No regressions:**
   - Track expansion/collapse still works
   - Delete track still works (only shown when > 1 track)
   - Copy Release Info button still works
   - Drag-and-drop reordering still works
   - All existing track functionality preserved

---

## Success Criteria

- Per-track "Copy Existing Track" button appears next to "Copy Release Info" button on every track
- Modal for track duplication excludes the current track from selection list
- Top-level "Add Blank Track" and "Duplicate Track" buttons are removed
- "Add New Track" button appears at bottom of tracks section
- All track operations work as expected with no regressions
- UI is more intuitive: duplication is per-track, add is at bottom
- TypeScript compiles without errors
- No console errors in browser

---

## Notes

**Design Decisions:**
- Using Files icon (instead of Copy) for "Copy Existing Track" to differentiate from "Copy Release Info"
- Using green color scheme for duplication button to differentiate from blue "Copy Release Info"
- Controlled modal pattern (external open state) instead of DialogTrigger for better integration
- Excluding current track from modal prevents confusing self-duplication

**Component Changes Summary:**
- CopyTrackModal: Now controlled component, accepts excludeIndex prop
- TrackCardHeader: New per-track duplication button with modal state
- TrackCard: Passes through duplication props
- TrackDetails: Passes copyFromTrack down to cards, adds bottom button
- TrackDetailsHeader: Simplified to title-only

**User Experience Improvements:**
- Duplication action is contextual (available on each track)
- Add track action is positioned where users naturally look for it (bottom)
- Clearer button terminology ("Add New Track" vs "Add Blank Track")
- Visual differentiation between copy-from-release (blue) and copy-from-track (green)

---

## Ready for Execution

This plan is ready to execute. Use `/run-plan` to begin implementation:
```
/run-plan .planning/track-duplication-ui-reorganization-PLAN.md
```
