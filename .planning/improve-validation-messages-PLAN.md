# Plan: Improve Incomplete Form Section Validation Messages

## Objective

Enhance the validation message shown when hovering over the disabled "Next" button to provide specific, actionable feedback about which tracks are incomplete and exactly what mandatory information is missing for each track.

**Current behavior:** Shows generic message "Tracks 1, 2 are missing audio files"

**Desired behavior:** Shows detailed message like "Track 1: Missing title, audio file. Track 2: Missing performers, production credits"

## Context

**Problem location:**
- `src/pages/Index.tsx:160-176` - `getValidationMessage()` function
- `src/lib/assetValidation.ts:65-89` - `getAssetValidationMessage()` function

**Current validation checks** (from `validateStep()` at Index.tsx:111-124):
- Title
- At least one artist
- Track genre
- At least one performer with name and roles
- At least one composer with name and roles
- At least one producer with name and roles
- Audio file upload

**Display location:**
- Tooltip on disabled "Next" button (Index.tsx:274-285)
- Export validation (ExportStep.tsx:30-46)

## Tasks

### Task 1: Create Comprehensive Track Validation Function

**Type:** Implementation
**Files:** `src/lib/assetValidation.ts`

**Action:**
1. Add new function `getIncompleteTrackDetails(tracks: TrackData[]): Map<number, string[]>`
   - For each track, check all mandatory fields
   - Return a map of track index → array of missing field names
   - Field names should be user-friendly (e.g., "title", "artists", "genre", "audio file", "performers", "composers", "producers")

2. Add new function `getDetailedValidationMessage(tracks: TrackData[]): string`
   - Use `getIncompleteTrackDetails()` to identify issues
   - Format message as: "Track X: Missing [fields]. Track Y: Missing [fields]"
   - Handle singular/plural gracefully
   - If only one field type is missing across all tracks, use simplified format
   - Max message length ~200 chars (truncate if needed with "...")

**Verify:**
- Function correctly identifies all missing mandatory fields
- Message format is clear and actionable
- Edge cases handled (single track, all fields missing, etc.)

**Done:** ☐

---

### Task 2: Update Hover Tooltip Validation Message

**Type:** Implementation
**Files:** `src/pages/Index.tsx`

**Action:**
1. Import `getDetailedValidationMessage` from `@/lib/assetValidation`
2. Update `getValidationMessage()` function at line 171-173:
   - Replace `getAssetValidationMessage(false, assetValidation.missingAudioTracks)`
   - With `getDetailedValidationMessage(tracks)`
3. Test that tooltip shows detailed per-track validation messages

**Verify:**
- Hover tooltip displays specific missing fields per track
- Message is readable and fits in tooltip (max-w-xs constraint)
- Works for various scenarios (1 track incomplete, multiple tracks, different missing fields)

**Done:** ☐

---

### Task 3: Update Export Step Validation

**Type:** Implementation
**Files:** `src/components/ExportStep.tsx`

**Action:**
1. Import `getDetailedValidationMessage` from `@/lib/assetValidation`
2. Review current track validation in `validateData()` (lines 30-46)
3. Replace or supplement existing validation with detailed messages
4. Ensure export validation matches step 2 validation logic

**Verify:**
- Export step shows same detailed validation as hover tooltip
- All validation issues are caught before export
- Error messages are consistent across the app

**Done:** ☐

---

## Verification

**Overall checks:**
- [ ] Hover tooltip on "Next" button shows specific missing fields per track
- [ ] Message clearly identifies track numbers (1-indexed for users)
- [ ] Message lists actual missing fields, not just "audio files"
- [ ] Export validation prevents export with incomplete tracks
- [ ] Messages are consistent between step navigation and export
- [ ] UI remains responsive with long validation messages

**Test scenarios:**
1. Track missing only audio file → "Track 1: Missing audio file"
2. Track missing multiple fields → "Track 1: Missing title, artists, audio file"
3. Multiple tracks incomplete → "Track 1: Missing audio file. Track 2: Missing performers, composers"
4. All tracks complete → No validation message, can proceed

## Success Criteria

- ✅ Validation messages specify exact missing fields per track
- ✅ Users understand what actions are needed to proceed
- ✅ Messages are concise yet comprehensive
- ✅ Implementation reuses validation logic (DRY principle)
- ✅ Works seamlessly with existing UI/UX

## Notes

- Keep messages user-friendly (avoid technical jargon)
- Consider message length constraints in tooltip (max-w-xs)
- Maintain consistency with existing validation patterns
- Test with dark mode to ensure tooltip readability
