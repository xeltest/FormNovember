# Outstanding To-Dos

## Pending Tasks



## Completed Tasks

### ✅ Add Tooltips to Territory Section - Completed 2026-01-08

- **Add tooltip to "Release worldwide" header** - Add informative tooltip next to the "Release worldwide" checkbox header explaining functionality. **Status:** COMPLETED - Implemented using FieldTooltip component with custom tooltip content. Tooltip explains that checking the box makes the release available worldwide, while unchecking enables territory-specific restrictions. **Files modified:** `src/components/territory/TerritorySelector.tsx`, `src/lib/tooltipContent.ts`.

- **Add tooltips for included and excluded territories** - When "Release worldwide" is unchecked, add separate tooltips for the included territories panel and excluded territories panel. **Status:** COMPLETED - Added info icon tooltips to both panel headers using shadcn/ui Tooltip components. Tooltips explain the purpose of each panel and how territories can be moved between them. **Files modified:** `src/components/territory/TerritoryPanel.tsx`, `src/components/territory/TerritorySelector.tsx`, `src/components/territory/types.ts`, `src/lib/tooltipContent.ts`. **Plan:** `.planning/territory-tooltips-PLAN.md`.

### ✅ Territory Section Redesign - Completed 2025-12-23

- **Restructure/Design territory selector** - Create dual-panel UI with left-right divide, broken into continents with drill-down interface. **Status:** COMPLETED - Comprehensive implementation prompt created with detailed specifications for hierarchical accordion structure, search functionality, real-time counts, and backward compatibility. **Prompt:** `prompts/001-territory-selector-ui.md`. Ready for implementation when needed.

### ✅ Form Field Tooltips - Completed 2025-12-01

- **Add tooltip icons to all form fields** - Add info icon tooltips next to each form field label to provide hover explanations about what the field is for and how to fill it out correctly. **Status:** COMPLETED - Implemented comprehensive tooltip system with centralized content configuration (`/src/lib/tooltipContent.ts`) and reusable `FieldTooltip` component. All priority fields now have tooltips with placeholder text ready for team members to update. **Git commit:** `2184dfb feat: add informative tooltips to all form field labels`. **Documentation:** `TOOLTIP_IMPLEMENTATION.md`.

### ✅ Flexible Genre Selection - Completed 2025-12-01

- **Allow genre selection at any tier level** - Enable users to select genres from any level in the hierarchy (Tier 1, Tier 2, or Tier 3) instead of forcing selection only at the deepest level. **Status:** COMPLETED - Updated genre selection mechanism to support flexible tier selection. **Git commit:** `cc54f60 feat: allow genre selection at any tier level`.

### ✅ Move Export Success Info to Persistent Display - Completed 2025-12-02

- **Add permanent section alongside export modal** - Add a persistent information section to the export page that displays submission instructions, pitch form link, resources, and support contact. **Status:** COMPLETED - Added permanent Card section while keeping the existing success modal for immediate feedback. Users now have both modal notification and persistent reference. **Documentation:** `prompts/completed/001-move-export-modal-to-permanent-section.md`. **Note:** The "Back to Tracks" button was also removed as part of this implementation.

### ✅ Mandatory Asset Upload Validation - Completed 2025-12-02

- **Implement environment-based validation for artwork and audio uploads** - Add validation system controlled by `VITE_ASSETS_MANDATORY` environment variable to enforce or allow optional asset uploads. **Status:** COMPLETED - Comprehensive validation system implemented with visual indicators, step navigation blocking, and export validation. Environment variable defaults to `true` (mandatory) for production. **Documentation:** `ASSET_VALIDATION.md`, `IMPLEMENTATION_SUMMARY.md`. **Prompt:** `prompts/completed/001-mandatory-asset-upload-validation.md`. 

### Fix Form Field Label Spacing - 2025-12-02 10:32

- **Increase spacing between field labels and input fields** - Add proper margin/padding between form field labels and their corresponding input fields throughout all form components. **Problem:** Field labels are positioned too close to the input fields below them, creating a cramped appearance and poor visual hierarchy that makes forms harder to read and use. **Files:** `src/components/ReleaseInfo.tsx`, `src/components/TrackForm.tsx`, `src/components/TrackDetails.tsx`, `src/components/track/TrackMetadataSection.tsx`, `src/components/track/TrackDetailsSection.tsx`, `src/components/track/ContributorsSection.tsx`, `src/components/track/TrackArtistsSection.tsx` (all form components that display labels and inputs). **Solution:** Add consistent spacing (e.g., `mb-2` or `mb-3`) to label elements or their wrapper divs. Check existing spacing utilities and standardize across all form fields for visual consistency.

--- 
### Hover for incomplete form section - 2025-12-011 23:40

- **Hover for incomplete form section- Improve wording** - Instead of "Tracks 1,2 are missing audio files" say which tracks are missing manatory information an which mndatory information they are missing.

---
### Clean Up Genre List - 2025-12-02 10:33

- **Clean up and organize genre-related files** - Review and clean up the genre data structure, removing duplicates, backup files, or unused genre definitions. **Problem:** Multiple genre-related files exist (genres.ts modified, genres.json and genresbackuppp.ts untracked), suggesting incomplete cleanup or migration work that may cause confusion or inconsistencies in genre selection. **Files:** `src/constants/genres.ts`, `genres.json`, `genresbackuppp.ts`. **Solution:** Review all three files to determine which is the source of truth, consolidate genre data if needed, remove backup/temporary files, and ensure the genre structure is clean and well-organized.

---

### Clean Up Tool Tips - 2025-12-011 23:37

- **Clean up and organize tool tips** - Review and clean up the Tool Tips, re-writing them to apply to our needs specifically. and ensure they are presented in an aesthetically pleasing manner.
---

### Copy From Track - 2025-12-011 23:42

- **Change button Woring** -  to "Duplicate a track" and Choose a track to duplicate (potentially ad a tool tip telling people to use this feature if the components of the track are similar)
---
### Add Comprehensive Form Validation - 2026-01-07 14:25

- **Implement format validation for UPC, ISRC, Cat Numbers, C and P Lines** - Add validation to ensure industry-standard identifiers follow correct formats when supplied. **Problem:** Form currently accepts UPCs, ISRCs, Catalog Numbers, and C/P Lines without validating their structure, which could lead to downstream distribution issues or rejections. **Files:** `src/lib/assetValidation.ts`, `src/components/ReleaseInfo.tsx`, `src/components/TrackForm.tsx`. **Solution:** Create validation functions for each identifier type (UPC: 12 digits, ISRC: CC-XXX-YY-NNNNN format, etc.) and integrate with existing form validation. Display clear error messages for invalid formats.

- **Enforce single-track release field matching** - Ensure release-level and track-level fields match when a release contains only one track. **Problem:** For single-track releases, critical metadata like Title, Mix/Version, Artist, Featured Artist, and Remixers must match between release and track levels to meet distribution requirements, but currently there's no validation or auto-sync mechanism. **Files:** `src/components/ReleaseInfo.tsx`, `src/components/TrackForm.tsx`, `src/pages/Index.tsx`. **Solution:** Add validation check that triggers when track count equals 1. Compare Release Title with Track Title, Mix/Version fields at both levels, and all artist fields (Artist, Featured Artist, Remixers). Either auto-sync values or display validation errors highlighting mismatches.

---

### Reorganize Track Duplication UI - 2026-01-08 22:50

- **Move duplicate track modal to per-track button** - Relocate the "Duplicate a Track Modal" from top-level controls to individual track-level buttons positioned near the "Copy Release Info Button", renamed as "Copy Existing Track". **Problem:** Current UI has duplicate track functionality at the top level, but it would be more intuitive and efficient to have this action available directly on each track, similar to how the copy release info button works. **Files:** `src/pages/Index.tsx`, `src/components/TrackForm.tsx`, `src/components/CopyTrackModal.tsx`. **Solution:** Add "Copy Existing Track" button to each track card/section near the existing "Copy Release Info Button". Keep the modal logic but trigger it from the per-track button instead of top-level controls.

- **Remove top-level track action buttons** - Remove the two buttons at the top: "add Blank Track" and "Duplicate a Track". **Problem:** These top-level buttons create redundant UI now that functionality is being reorganized - add blank track should be at the bottom as a natural continuation point, and duplicate is moving to per-track buttons. **Files:** `src/pages/Index.tsx`. **Solution:** Remove both button components from the top section of the tracks area.

- **Relocate and rename Add Track button** - Move the "Add a blank Track" button to the bottom of the tracks section and rename it to "Add New Track". **Problem:** Having the add track button at the top feels backwards - users naturally expect to add a new track after scrolling through existing tracks, and "Add New Track" is clearer terminology than "Add a blank Track". **Files:** `src/pages/Index.tsx`. **Solution:** Move button component to render after all existing tracks and update button text from "Add a blank Track" to "Add New Track".

### Spotify-Specific Artist Export - 2026-01-08 00:58

- **Add "Make Primary on Spotify" toggle for featured artists and remixers** - Add checkbox/toggle at release and track level that appears when featured artist or remixer is added/expanded. **Problem:** Spotify requires different artist attribution than other platforms - featured artists and remixers sometimes need to be listed as primary artists for proper credit and royalty distribution on Spotify specifically. **Files:** `src/components/ReleaseInfo.tsx`, `src/components/track/TrackArtistsSection.tsx`, `src/pages/Index.tsx`. **Solution:** Add boolean field "makeSpotifyPrimary" or similar to featured artist and remixer data structures. Display toggle when these artists are added with label "Make Primary on Spotify" or "Show as Primary Artist on Spotify".

- **Generate Spotify-specific export files with modified artist data** - Create duplicate CSV and Excel files with "_spotify" suffix when Spotify toggle is enabled. **Problem:** Need to export two sets of metadata files - standard files for most platforms and Spotify-specific files where selected featured artists/remixers are promoted to primary artist status by appending them to the primary artists list. **Files:** `src/components/ExportStep.tsx`. **Solution:** When exporting, check if any tracks/release have makeSpotifyPrimary enabled. If yes, generate standard files (metadata.csv, metadata.xlsx) plus Spotify variants (metadata_spotify.csv, metadata_spotify.xlsx) where the featured artist/remixer with flag enabled is appended to the primary artists array. Final export ZIP contains: artwork, audio files, 2 CSVs, and 2 Excel files.

---
### Fix Duplicate Track Button Behavior - 2026-01-14 01:09

- **Change Duplicate Track button to copy metadata TO current track instead of creating new track** - Modify the "Duplicate Track" button functionality to copy track metadata FROM a selected track TO the current track, similar to how "Copy From Release Info" works. **Problem:** Currently when clicking "Duplicate Track" button, it creates a NEW track using the selected track as a template. The desired behavior is to populate the CURRENT track's fields with metadata from another existing track, not create a new track. Should work like "Copy From Release Info" but for track-to-track copying. **Files:** `src/components/CopyTrackModal.tsx`, `src/components/TrackForm.tsx`, `src/pages/Index.tsx`. **Solution:** Modify the modal and its handler to copy metadata from the selected source track into the current track's form fields instead of calling the "add new track" functionality with copied data.
