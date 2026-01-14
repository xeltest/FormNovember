<objective>
Modify the "Duplicate Track" button functionality to copy track metadata FROM a selected track TO the current track's form fields, rather than creating a new track. This should work similarly to the existing "Copy From Release Info" button - populating the current track's fields with data from another source.
</objective>

<context>
This is a React application using TypeScript, React Hook Form, and shadcn/ui components. The application manages music release metadata with multiple tracks.

Currently, the "Duplicate Track" button creates a NEW track using the selected track as a template. Users want it to instead populate the CURRENT track's empty fields with metadata from an existing track - making data entry faster when tracks share similar information.

Review the project conventions in CLAUDE.md before starting.

Key files to examine:
- @src/components/CopyTrackModal.tsx - The modal for selecting which track to copy from
- @src/components/TrackForm.tsx - The track form component with all form fields
- @src/pages/Index.tsx - Main page with track management logic and handlers
- Look for the existing "Copy From Release Info" functionality to understand the pattern
</context>

<requirements>
1. **Keep the existing modal UI** - Reuse the current CopyTrackModal component, only change what happens after a track is selected
2. **Copy metadata to current track** - Instead of creating a new track, populate the current track's form fields with the selected track's data
3. **Exclude specific fields** - Copy everything EXCEPT:
   - Audio file references
   - ISRC codes (each track needs unique ISRC)
4. **Include all other fields** - Copy title, artists (primary, featured, remixers), genre, mix/version, explicit content flag, language, lyrics, contributors, and all other metadata
5. **Preserve form state** - Use proper React Hook Form methods to update field values so validation and dirty state work correctly
6. **Match existing patterns** - Follow the same approach used by "Copy From Release Info" for consistency
</requirements>

<implementation>
1. **Examine the "Copy From Release Info" functionality first** to understand how it populates form fields from one source to another
2. **Locate the duplicate track handler** in Index.tsx (likely something like `handleDuplicateTrack` or similar)
3. **Modify the handler logic**:
   - Instead of calling the "add new track" function with copied data
   - Update the current track's form values using React Hook Form's setValue or reset methods
   - Skip audio file fields and ISRC field
   - Copy all other metadata fields
4. **Test the changes** by considering edge cases:
   - What if the current track already has some data filled in? (Should be overwritten)
   - What if the source track is missing some fields? (Copy what exists, leave others empty)
   - Ensure form validation still works after copying

Why exclude audio files and ISRCs: Audio files are physical assets specific to each track recording, and ISRC codes must be unique identifiers for each track - copying these would violate music industry standards and cause distribution issues.
</implementation>

<output>
Modify existing files:
- `src/components/CopyTrackModal.tsx` - Update if any modal text/labels need changing to reflect new behavior
- `src/pages/Index.tsx` - Modify the duplicate track handler to copy metadata to current track instead of creating new track
- `src/components/TrackForm.tsx` - Update only if changes are needed to support the new copying behavior
</output>

<verification>
Before declaring complete, verify your changes:
1. Read the modified code to confirm:
   - The handler no longer creates a new track
   - It properly updates the current track's form fields
   - Audio file and ISRC fields are excluded from copying
   - All other metadata fields are included
2. Check that the solution follows the same pattern as "Copy From Release Info"
3. Ensure React Hook Form methods are used correctly for updating field values
</verification>

<success_criteria>
- Clicking "Duplicate Track" and selecting a source track populates the current track's fields
- Audio files and ISRC are NOT copied
- All other metadata (title, artists, genre, etc.) IS copied
- The modal closes after selection and the current track form shows the copied data
- No new track is created
- Form validation continues to work properly
</success_criteria>
