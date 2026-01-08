---
phase: spotify-artist-export-part-1
type: execute
---

<objective>
Add "Make Primary on Spotify" toggle functionality to featured artists and remixers at both release and track levels.

Purpose: Enable users to mark specific featured artists or remixers as primary artists for Spotify-specific metadata files, addressing Spotify's unique artist attribution requirements.

Output: Updated data structures and UI with working toggles that persist user selections for featured artists and remixers.
</objective>

<execution_context>
@/Users/tom/.claude/skills/create-plans/workflows/execute-phase.md
@/Users/tom/.claude/skills/create-plans/templates/summary.md
</execution_context>

<context>
@/Users/tom/Desktop/Coding/FormNovember-main07112025/TO-DOS.md
@/Users/tom/Desktop/Coding/FormNovember-main07112025/src/pages/Index.tsx
@/Users/tom/Desktop/Coding/FormNovember-main07112025/src/components/ReleaseInfo.tsx
@/Users/tom/Desktop/Coding/FormNovember-main07112025/src/components/track/TrackArtistsSection.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Update data structures for Spotify primary flag</name>
  <files>src/pages/Index.tsx</files>
  <action>
    Modify the ReleaseData and TrackData interfaces to change featuredArtists and remixers from string[] to object arrays:
    - Change `featuredArtists: string[]` to `featuredArtists: Array<{ name: string; makeSpotifyPrimary?: boolean }>`
    - Change `remixers: string[]` to `remixers: Array<{ name: string; makeSpotifyPrimary?: boolean }>`
    - Do this for BOTH ReleaseData and TrackData interfaces
    - Keep the makeSpotifyPrimary field optional (?) so existing data structures remain valid
    - Do NOT modify the artists field - it remains string[]
  </action>
  <verify>
    Run `npm run build` to check for TypeScript errors. There will be compilation errors in components that reference featuredArtists and remixers - this is expected and will be fixed in subsequent tasks.
  </verify>
  <done>ReleaseData and TrackData interfaces updated with new artist object structure, build runs (with expected errors in other files)</done>
</task>

<task type="auto">
  <name>Task 2: Update ReleaseInfo.tsx for new data structure and add toggles</name>
  <files>src/components/ReleaseInfo.tsx</files>
  <action>
    Update the ReleaseInfo component to work with the new object-based artist structure and add Spotify primary toggles:

    1. Update all array manipulation functions:
       - `updateArtistList` for featuredArtists/remixers: update the `name` property of the object, not the string directly
       - `addArtist` for featuredArtists/remixers: push `{ name: '', makeSpotifyPrimary: false }` instead of empty string
       - `removeArtist`: no changes needed (filter works the same)

    2. Update the rendering logic:
       - When mapping over featuredArtists/remixers, use `artist.name` instead of `artist`
       - Filter checks should use `artist.name` instead of just `artist`

    3. Add Spotify toggle UI for each featured artist and remixer:
       - Import Checkbox from '@/components/ui/checkbox'
       - For each featured artist input, add a checkbox below or beside it with label "Make Primary on Spotify"
       - For each remixer input, add a checkbox below or beside it with label "Make Primary on Spotify"
       - Checkbox should be checked when `artist.makeSpotifyPrimary === true`
       - On checkbox change, update the artist object's makeSpotifyPrimary field
       - Use a helper function `updateArtistSpotifyFlag(listName, index, value)` to handle updates

    4. Initial state handling:
       - Update `showFeaturedArtists` check to use `data.featuredArtists.length > 0`
       - Update `showRemixers` check to use `data.remixers.length > 0`

    IMPORTANT: Maintain existing UI layout and styling. Only add the checkbox controls, don't reorganize existing elements.
  </action>
  <verify>
    1. Run `npm run build` - TypeScript errors in ReleaseInfo.tsx should be resolved
    2. Start dev server with `npm run dev`
    3. Navigate to the release info section
    4. Click "Add Featured Artist" and "Add Remixer" buttons
    5. Verify input fields appear and checkboxes are present with "Make Primary on Spotify" label
    6. Verify checking/unchecking toggles works without errors in browser console
  </verify>
  <done>ReleaseInfo component updated to use new data structure, Spotify primary toggles visible and functional for featured artists and remixers, no TypeScript errors</done>
</task>

<task type="auto">
  <name>Task 3: Update TrackArtistsSection.tsx for new data structure and add toggles</name>
  <files>src/components/track/TrackArtistsSection.tsx</files>
  <action>
    Update the TrackArtistsSection component to work with the new object-based artist structure and add Spotify primary toggles:

    1. Update all array manipulation functions:
       - `updateArtistList` for featuredArtists/remixers: update the `name` property of the object, not the string directly
       - `addArtist` for featuredArtists/remixers: push `{ name: '', makeSpotifyPrimary: false }` instead of empty string
       - `removeArtist`: no changes needed (filter works the same)
       - Initial empty artist in onClick handlers: use `{ name: '', makeSpotifyPrimary: false }` instead of empty string

    2. Update the rendering logic:
       - When mapping over featuredArtists/remixers, use `artist.name` instead of `artist`
       - Filter checks should use `artist.name` instead of just `artist`

    3. Add Spotify toggle UI for each featured artist and remixer:
       - Import Checkbox from '@/components/ui/checkbox'
       - For each featured artist input, add a checkbox below or beside it with label "Make Primary on Spotify"
       - For each remixer input, add a checkbox below or beside it with label "Make Primary on Spotify"
       - Checkbox should be checked when `artist.makeSpotifyPrimary === true`
       - On checkbox change, update the artist object's makeSpotifyPrimary field
       - Use a helper function `updateArtistSpotifyFlag(listName, index, value)` to handle updates

    4. Keep the useEffect hooks that auto-expand sections when data is populated - they should continue to work with length checks

    IMPORTANT: Maintain existing UI layout and styling. Match the checkbox placement used in ReleaseInfo.tsx for consistency.
  </action>
  <verify>
    1. Run `npm run build` - all TypeScript errors should be resolved
    2. Start dev server with `npm run dev`
    3. Navigate to any track's artist section
    4. Click "Add Featured Artist" and "Add Remixer" buttons
    5. Verify input fields appear and checkboxes are present with "Make Primary on Spotify" label
    6. Verify checking/unchecking toggles works without errors in browser console
    7. Test that sections auto-expand when artists are added
  </verify>
  <done>TrackArtistsSection component updated to use new data structure, Spotify primary toggles visible and functional for featured artists and remixers, no TypeScript errors</done>
</task>

<task type="auto">
  <name>Task 4: Fix any remaining TypeScript errors in other files</name>
  <files>src/components/ExportStep.tsx, src/components/CopyTrackModal.tsx, src/components/TrackForm.tsx, and any other files with compilation errors</files>
  <action>
    Search for and fix any remaining TypeScript compilation errors caused by the data structure change:

    1. Run `npm run build` and review all errors
    2. For each file with errors related to featuredArtists or remixers:
       - Update code that expects string[] to work with object arrays
       - When accessing artist names, use `.map(a => a.name)` or access `artist.name` property
       - When joining for display, use `.filter(a => a.name).map(a => a.name).join('|')`
       - When filtering empty values, check `a.name` instead of just `a`

    3. Common patterns to fix:
       - `featuredArtists.join('|')` → `featuredArtists.map(a => a.name).join('|')`
       - `remixers.filter(r => r)` → `remixers.filter(r => r.name)`
       - Direct string access → property access via `.name`

    4. DO NOT modify export logic in ExportStep.tsx beyond fixing compilation errors - Spotify-specific export files will be handled in the next plan

    IMPORTANT: Only fix compilation errors. Don't add new features or modify business logic.
  </action>
  <verify>
    1. Run `npm run build` - should complete with zero errors
    2. Run `npm run dev` and test the full form workflow:
       - Add release-level featured artists and remixers with toggles
       - Add tracks with track-level featured artists and remixers with toggles
       - Use "Copy from Release Info" button on tracks
       - Use "Copy Existing Track" functionality
       - Verify all toggles persist and display correctly
    3. Open browser console - no errors should appear during normal usage
  </verify>
  <done>All TypeScript compilation errors resolved, all existing features work correctly with new data structure, toggles persist throughout form workflows</done>
</task>

</tasks>

<verification>
Before declaring phase complete:
- [ ] `npm run build` completes with zero TypeScript errors
- [ ] Dev server runs without errors: `npm run dev`
- [ ] Release-level featured artists and remixers show Spotify primary toggles
- [ ] Track-level featured artists and remixers show Spotify primary toggles
- [ ] Toggles can be checked/unchecked and state persists
- [ ] Existing features work: Copy from Release Info, Copy Existing Track
- [ ] No console errors during normal form usage
</verification>

<success_criteria>
- All tasks completed
- All verification checks pass
- No TypeScript errors or runtime errors
- Spotify primary toggles functional at both release and track level
- All existing form functionality preserved
- Data structure migration complete and backward compatible
</success_criteria>

<output>
After completion, create `.planning/spotify-primary-toggle-SUMMARY.md`
</output>
