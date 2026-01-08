<objective>
Enhance the form validation messaging system to provide specific, actionable feedback about incomplete tracks. Instead of showing generic messages like "Tracks 1, 2 are missing audio files", users should see detailed per-track feedback such as "Track 1: Missing title, audio file. Track 2: Missing performers, production credits".

This improvement will help users quickly identify and resolve validation issues when navigating between form steps and during export.
</objective>

<context>
You are working on a multi-track form application where users fill in details for music tracks including title, artists, genre, performers, composers, producers, and audio files.

Current implementation:
- Validation occurs in `src/pages/Index.tsx` (validateStep function at lines 111-124)
- Generic validation messages in `src/lib/assetValidation.ts` (getAssetValidationMessage function at lines 65-89)
- Validation message displayed in tooltip on disabled "Next" button (Index.tsx:274-285)
- Export validation in `src/components/ExportStep.tsx` (lines 30-46)

Mandatory fields per track:
- Title
- At least one artist
- Track genre
- At least one performer with name and roles
- At least one composer with name and roles
- At least one producer with name and roles
- Audio file upload

Read these files to understand the current implementation:
@src/lib/assetValidation.ts
@src/pages/Index.tsx
@src/components/ExportStep.tsx
</context>

<requirements>
1. Create comprehensive track validation functions in `src/lib/assetValidation.ts`:
   - Function to identify all missing mandatory fields for each track
   - Function to generate detailed, user-friendly validation messages
   - Message format: "Track X: Missing [fields]. Track Y: Missing [fields]"

2. Update the hover tooltip validation in `src/pages/Index.tsx`:
   - Replace generic message with detailed per-track validation
   - Ensure message is readable within tooltip constraints (max-w-xs)

3. Update export validation in `src/components/ExportStep.tsx`:
   - Use the same detailed validation logic
   - Ensure consistency between step navigation and export validation

4. Handle edge cases gracefully:
   - Single vs multiple incomplete tracks
   - One field missing vs multiple fields
   - Message length constraints (~200 chars max, truncate with "..." if needed)
   - Track numbering should be 1-indexed for users (Track 1, Track 2, etc.)
</requirements>

<implementation>
**Step 1: Create validation functions in `src/lib/assetValidation.ts`**

Add two new functions:

1. `getIncompleteTrackDetails(tracks: TrackData[]): Map<number, string[]>`
   - Iterate through each track and check all mandatory fields
   - Return a map where key = track index, value = array of missing field names
   - Use user-friendly field names: "title", "artists", "genre", "audio file", "performers", "composers", "producers"
   - A field is missing if:
     - Title is empty/undefined
     - Artists array is empty
     - Genre is empty/undefined
     - Performers/composers/producers arrays are empty OR contain entries without names/roles
     - Audio file is not uploaded

2. `getDetailedValidationMessage(tracks: TrackData[]): string`
   - Call `getIncompleteTrackDetails()` to get missing fields per track
   - Format message clearly: "Track 1: Missing title, audio file. Track 2: Missing performers"
   - Handle singular/plural properly ("Missing audio file" vs "Missing title, audio file")
   - Use 1-indexed track numbers for user display
   - Truncate if message exceeds ~200 characters, ending with "..."
   - Return empty string if all tracks are valid

**Step 2: Update `src/pages/Index.tsx`**

Modify the `getValidationMessage()` function (around line 171-173):
- Import `getDetailedValidationMessage` from `@/lib/assetValidation`
- Replace the call to `getAssetValidationMessage(false, assetValidation.missingAudioTracks)`
- With `getDetailedValidationMessage(tracks)`

**Step 3: Update `src/components/ExportStep.tsx`**

Update the validation in the `validateData()` function:
- Import `getDetailedValidationMessage` from `@/lib/assetValidation`
- Replace or supplement existing track validation with detailed messages
- Ensure export validation matches the step 2 validation logic exactly

**Why these changes matter:**
- Generic messages force users to manually check each track to find issues
- Specific messages enable users to immediately fix the right fields
- Consistent validation across the app prevents confusion
- User-friendly field names (not technical property names) improve UX
</implementation>

<output>
Modify these existing files:
- `./src/lib/assetValidation.ts` - Add `getIncompleteTrackDetails()` and `getDetailedValidationMessage()` functions
- `./src/pages/Index.tsx` - Update `getValidationMessage()` to use detailed validation
- `./src/components/ExportStep.tsx` - Update export validation to use detailed messages
</output>

<verification>
Before declaring complete, test these scenarios:

1. **Track missing only audio file:**
   - Create a track with all fields except audio file
   - Verify tooltip shows: "Track 1: Missing audio file"

2. **Track missing multiple fields:**
   - Create a track missing title, artists, and audio file
   - Verify tooltip shows: "Track 1: Missing title, artists, audio file"

3. **Multiple incomplete tracks:**
   - Create Track 1 missing audio file, Track 2 missing performers and composers
   - Verify tooltip shows: "Track 1: Missing audio file. Track 2: Missing performers, composers"

4. **All tracks complete:**
   - Fill all mandatory fields for all tracks
   - Verify "Next" button is enabled and no validation message appears

5. **Message length handling:**
   - Create scenario with very long validation message
   - Verify message truncates gracefully with "..." if needed

6. **Export validation consistency:**
   - Navigate to export step with incomplete tracks
   - Verify same detailed messages appear as in step 2 tooltip

7. **UI constraints:**
   - Verify tooltip remains readable with longer messages
   - Check that max-w-xs width constraint doesn't break layout
</verification>

<success_criteria>
- Validation messages specify exact missing fields per track, not generic messages
- Users can identify which track needs attention and which specific fields to complete
- Messages use 1-indexed track numbers (Track 1, Track 2, etc.)
- Field names are user-friendly ("audio file" not "audioFile", "artists" not "trackArtists")
- Validation is consistent between step navigation tooltip and export step
- Message length is reasonable for tooltip display (~200 chars max)
- All mandatory field types are checked: title, artists, genre, performers, composers, producers, audio file
- Code reuses validation logic (DRY principle) - no duplication between files
</success_criteria>