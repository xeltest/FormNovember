<objective>
Add informative tooltip icons next to all form field labels to help users understand field purposes, format requirements, and expected content. This will reduce user confusion and incorrect data entry, particularly for technical fields like ISRC codes, UPC, catalog numbers, and music industry terminology.
</objective>

<context>
Users filling out music release forms may not understand the purpose of certain fields (ISRC codes, C-line/P-line, UPC, catalog numbers, etc.) or the expected format/content. This leads to confusion and incorrect data entry.

The application already has a tooltip component from shadcn/ui at `src/components/ui/tooltip.tsx`. We'll use this existing component along with the Info icon from lucide-react.

Priority fields requiring tooltips:
- Release Title
- Release Mix/Version
- Release Artist
- Mix/Version
- Featured Artist(s)
- Remixer(s)
- Release Date
- Previously Release
- Original Release Date
- Label Name
- Genre
- ISRC (International Standard Recording Code)
- UPC (Universal Product Code)
- Catalog number
- C-line (Copyright line)
- P-line (Phonographic copyright)
- Genre selection
- Territory selection (Included/Excluded)
- Explicit content
- Dolby Atmos

For this initial implementation, use placeholder text for each tooltip saying "This field is [FIELD_NAME] and should be filled in properly". A team member will replace these with proper content later.
</context>

<requirements>
1. Create a centralized tooltip content configuration that's easy to edit in one place
2. Create a reusable FieldTooltip component that wraps the label + info icon pattern
3. Add tooltips to all relevant form fields across these components:
   - `src/components/ReleaseInfo.tsx`
   - `src/components/TrackForm.tsx`
   - `src/components/track/TrackMetadataSection.tsx`
   - `src/components/track/TrackDetailsSection.tsx` (if exists)
   - `src/components/track/ContributorsSection.tsx` (if exists)
   - `src/components/track/TrackArtistsSection.tsx` (if exists)
   - `src/components/GenreSelector.tsx`
4. Use small Info icons that appear next to labels and trigger tooltips on hover
5. Ensure consistent styling and positioning across all tooltips
</requirements>

<implementation>
Follow this approach:

1. **Read existing files first** to understand current form structure:
   - Read all component files listed in requirements to see existing field labels
   - Examine `src/components/ui/tooltip.tsx` to understand the tooltip API

2. **Create centralized tooltip content** (`src/lib/tooltipContent.ts`):
   - Export a typed object mapping field keys to tooltip text
   - Use placeholder format: "This field is [FIELD_NAME] and should be filled in properly"
   - Make it easy for someone to find and edit all tooltip text in one place

3. **Create reusable FieldTooltip component** (`src/components/ui/FieldTooltip.tsx`):
   - Accepts a label string and tooltip content (or field key)
   - Renders the label with an Info icon that triggers tooltip on hover
   - Position icon appropriately next to label text
   - Use consistent sizing (icon should be small, e.g., h-4 w-4)
   - Ensure good visual alignment

4. **Update each component file**:
   - Import FieldTooltip and tooltip content
   - Replace plain labels with FieldTooltip component where appropriate
   - Focus on the priority fields first, then add to other fields as you find them
   - Maintain existing styling and layout

5. **Styling considerations**:
   - Info icons should be subtle but noticeable
   - Tooltips should be readable with appropriate contrast
   - Icons should align well with label text (use flexbox if needed)
</implementation>

<output>
Create/modify these files:

- `./src/lib/tooltipContent.ts` - Centralized tooltip content configuration with placeholder text
- `./src/components/ui/FieldTooltip.tsx` - Reusable component for label + tooltip pattern
- `./src/components/ReleaseInfo.tsx` - Add tooltips to relevant fields
- `./src/components/TrackForm.tsx` - Add tooltips to relevant fields
- `./src/components/track/TrackMetadataSection.tsx` - Add tooltips to relevant fields
- `./src/components/GenreSelector.tsx` - Add tooltip for genre selection
- Modify other component files as found (TrackDetailsSection, ContributorsSection, TrackArtistsSection)
</output>

<verification>
Before declaring complete, verify:

1. All priority fields have tooltips (ISRC, UPC, Catalog number, C-line, P-line, Genre, Territory, Explicit content, Dolby Atmos)
2. Tooltip content is centralized in one file and easy to edit
3. Visual consistency: all Info icons are the same size and positioned consistently
4. Tooltips appear on hover and display the placeholder text
5. No layout issues or misalignment introduced
6. The FieldTooltip component is reusable and type-safe
</verification>

<success_criteria>
- Centralized tooltip content file exists with placeholder text for all priority fields
- Reusable FieldTooltip component created and working correctly
- All priority fields across all form components have tooltip icons
- Tooltips display on hover with placeholder text
- Visual consistency maintained across all components
- Easy for team member to edit all tooltip text in one place later
</success_criteria>
