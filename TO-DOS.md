# Outstanding To-Dos

## Pending Tasks

### Clean Up Genre List - 2025-12-02 10:33

- **Clean up and organize genre-related files** - Review and clean up the genre data structure, removing duplicates, backup files, or unused genre definitions. **Problem:** Multiple genre-related files exist (genres.ts modified, genres.json and genresbackuppp.ts untracked), suggesting incomplete cleanup or migration work that may cause confusion or inconsistencies in genre selection. **Files:** `src/constants/genres.ts`, `genres.json`, `genresbackuppp.ts`. **Solution:** Review all three files to determine which is the source of truth, consolidate genre data if needed, remove backup/temporary files, and ensure the genre structure is clean and well-organized.

---

### Clean Up Tool Tips - 2025-12-011 23:37

- **Clean up and organize tool tips** - Review and clean up the Tool Tips, re-writing them to apply to our needs specifically. and ensure they are presented in an aesthetically pleasing manner.

---

### Hover for incomplete form section - 2025-12-011 23:40

- **Improve wording** - Instead of "Tracks 1,2 are missing audio files" say which tracks are missing manatory information an which mndatory information they are missing.

---

### Territory section - 2025-12-011 23:42

- **Restructure/Design** -  left right divide, broken into continents with a drill down interface
---

### Copy From Track - 2025-12-011 23:42

- **Change button Woring** -  to "Duplicate a track" and Choose a track to duplicate (potentially ad a tool tip telling people to use this feature if the components of the track are similar)
---

## Completed Tasks

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
