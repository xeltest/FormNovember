# Release Type Toggle - Summary

**Added three-way release type toggle (Single/EP/Album) with auto-population for singles and conditional export logic.**

## Accomplishments
- Created `ReleaseTypeToggle` component using shadcn ToggleGroup with icons (Music/Disc/Album)
- Toggle prominently placed at top of Release Info page
- Single selection auto-populates Track 1 when navigating to Tracks page
- Export Title Type respects user selection with EP conditional logic (≤3→Single, ≥4→Album)
- Pitch form URL uses selected release type directly

## Files Created/Modified
- `src/components/ReleaseTypeToggle.tsx` - New toggle component with Single/EP/Album options
- `src/pages/Index.tsx` - Added releaseType to ReleaseData interface, default state, and auto-population logic
- `src/components/ReleaseInfo.tsx` - Added toggle import and placement at top of form
- `src/components/ExportStep.tsx` - Added getExportTitleType() helper, updated CSV/Excel exports, updated pitch form URL builder

## Decisions Made
- Toggle uses existing shadcn ToggleGroup for consistent UI
- EP conditional logic (≤3 tracks = Single, ≥4 tracks = Album) only applies to export metadata, not pitch form
- Pitch form shows "EP" directly when EP is selected

## Issues Encountered
None

## Verification
- Build succeeds without errors
- TypeScript compiles correctly
