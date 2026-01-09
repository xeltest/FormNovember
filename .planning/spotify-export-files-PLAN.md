---
phase: spotify-artist-export-part-2
type: execute
---

<objective>
Generate Spotify-specific export files (_spotify suffix) when and only when any featured artist or remixer has the "Make Primary on Spotify" toggle enabled.

Purpose: Create duplicate metadata files (CSV and Excel) with modified artist data where selected featured artists/remixers are promoted to primary artist status for Spotify distribution.

Output: Export functionality that generates 4 files when Spotify toggles are used (metadata.csv, metadata_spotify.csv, metadata.xlsx, metadata_spotify.xlsx) plus artwork and audio files in the ZIP archive.
</objective>

<execution_context>
@/Users/tom/.claude/skills/create-plans/workflows/execute-phase.md
@/Users/tom/.claude/skills/create-plans/templates/summary.md
</execution_context>

<context>
@/Users/tom/Desktop/Coding/FormNovember-main07112025/TO-DOS.md
@/Users/tom/Desktop/Coding/FormNovember-main07112025/src/components/ExportStep.tsx
@/Users/tom/Desktop/Coding/FormNovember-main07112025/src/pages/Index.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Update CSV generation to use makeSpotifyPrimary flag</name>
  <files>src/components/ExportStep.tsx</files>
  <action>
    Update the generateCSV function to populate the "Make Featured Artist Primary on Spotify" and "Make Remixer Primary on Spotify" columns based on actual toggle state:

    1. Locate the CSV row generation (around lines 382-383) where these columns are currently hardcoded to 'N'

    2. For "Make Featured Artist Primary on Spotify" column:
       - Check if ANY track featured artist has makeSpotifyPrimary === true
       - If yes, set to 'Y', otherwise 'N'
       - Logic: `track.featuredArtists.some(a => a.makeSpotifyPrimary) ? 'Y' : 'N'`

    3. For "Make Remixer Primary on Spotify" column:
       - Check if ANY track remixer has makeSpotifyPrimary === true
       - If yes, set to 'Y', otherwise 'N'
       - Logic: `track.remixers.some(r => r.makeSpotifyPrimary) ? 'Y' : 'N'`

    4. DO NOT modify the artist name columns yet - that will be handled in the Spotify-specific generation

    IMPORTANT: Keep the existing CSV generation intact - we're only updating the flag columns to reflect actual user selections.
  </action>
  <verify>
    1. Run `npm run build` - should complete without errors
    2. Add console.log to inspect generated CSV content
    3. Create test data with featured artist and toggle it
    4. Verify the CSV row shows 'Y' in the appropriate column when toggle is checked
  </verify>
  <done>CSV generation correctly populates Spotify primary flag columns based on toggle state, no errors</done>
</task>

<task type="auto">
  <name>Task 2: Create helper function to check if Spotify export is needed</name>
  <files>src/components/ExportStep.tsx</files>
  <action>
    Add a helper function that determines whether Spotify-specific files need to be generated:

    ```typescript
    const needsSpotifyExport = (): boolean => {
      // Check release-level featured artists and remixers
      const releaseHasSpotifyPrimary =
        releaseData.featuredArtists.some(a => a.makeSpotifyPrimary) ||
        releaseData.remixers.some(r => r.makeSpotifyPrimary);

      // Check track-level featured artists and remixers
      const trackHasSpotifyPrimary = tracks.some(track =>
        track.featuredArtists.some(a => a.makeSpotifyPrimary) ||
        track.remixers.some(r => r.makeSpotifyPrimary)
      );

      return releaseHasSpotifyPrimary || trackHasSpotifyPrimary;
    };
    ```

    Place this function near the top of the ExportStep component, alongside other helper functions like `countContributors` and `countFiles`.

    IMPORTANT: This function should check BOTH release-level and track-level artists/remixers for any Spotify primary flags.
  </action>
  <verify>
    1. Run `npm run build` - should complete without errors
    2. Add test data and verify function returns true when any toggle is checked
    3. Verify function returns false when no toggles are checked
  </verify>
  <done>Helper function needsSpotifyExport() created and correctly detects when Spotify files are needed</done>
</task>

<task type="auto">
  <name>Task 3: Create Spotify-specific CSV generation function</name>
  <files>src/components/ExportStep.tsx</files>
  <action>
    Create a new function `generateSpotifyCSV()` that generates a modified CSV with promoted artists:

    1. Duplicate the entire `generateCSV()` function and rename it to `generateSpotifyCSV()`

    2. Modify the artist column population logic:
       - For "Album Artist" column: Append release-level featured artists with makeSpotifyPrimary=true and remixers with makeSpotifyPrimary=true
       - For "Track Artist" column: Append track-level featured artists with makeSpotifyPrimary=true and remixers with makeSpotifyPrimary=true
       - Use pipe separator `|` to join multiple artists (matching existing pattern)

    3. Implementation pattern for Album Artist (around line 343):
       ```typescript
       // Start with primary artists
       const albumArtists = releaseData.artists.filter(a => a);

       // Add featured artists marked for Spotify primary
       const spotifyFeatured = releaseData.featuredArtists
         .filter(a => a.name && a.makeSpotifyPrimary)
         .map(a => a.name);

       // Add remixers marked for Spotify primary
       const spotifyRemixers = releaseData.remixers
         .filter(r => r.name && r.makeSpotifyPrimary)
         .map(r => r.name);

       // Combine all
       const allAlbumArtists = [...albumArtists, ...spotifyFeatured, ...spotifyRemixers].join('|');
       ```

    4. Apply the same pattern for Track Artist column with track-level data

    5. Keep all other columns identical to the standard CSV

    IMPORTANT: Only modify the artist columns - all other data should remain exactly the same as the standard CSV.
  </action>
  <verify>
    1. Run `npm run build` - should complete without errors
    2. Add console.log to inspect both standard and Spotify CSV content
    3. Create test data with featured artist toggled for Spotify primary
    4. Verify Spotify CSV has the featured artist appended to Album Artist and/or Track Artist columns
    5. Verify standard CSV remains unchanged (featured artists NOT in primary artist columns)
  </verify>
  <done>generateSpotifyCSV() function created and correctly promotes toggled artists to primary positions, standard CSV unchanged</done>
</task>

<task type="auto">
  <name>Task 4: Create Spotify-specific Excel generation logic</name>
  <files>src/components/ExportStep.tsx</files>
  <action>
    Update the downloadZip function to generate Spotify-specific Excel file when needed:

    1. Locate the Excel generation section in downloadZip (around lines 420-500)

    2. After the standard Excel file generation completes, add conditional Spotify Excel generation:
       ```typescript
       if (needsSpotifyExport()) {
         // Load template again for Spotify version
         const spotifyWorkbook = new ExcelJS.Workbook();
         await spotifyWorkbook.xlsx.load(templateBuffer);
         const spotifyWorksheet = spotifyWorkbook.getWorksheet('Data');

         // Populate with Spotify-modified data
         // Use same logic as generateSpotifyCSV for artist columns
         // Keep all other columns identical

         // Generate Spotify Excel buffer
         const spotifyExcelBuffer = await spotifyWorkbook.xlsx.writeBuffer();
         zip.file('metadata_spotify.xlsx', spotifyExcelBuffer);
       }
       ```

    3. For the artist column population in Spotify Excel:
       - Combine primary artists + featured artists with makeSpotifyPrimary + remixers with makeSpotifyPrimary
       - Use the same joining pattern as the standard Excel (pipe separator)
       - Apply at both release and track level

    4. Update progress reporting if needed to account for additional file generation

    IMPORTANT: Reuse the template loading logic. The Spotify Excel should use the same template but with modified artist data. Don't create a separate Spotify template file.
  </action>
  <verify>
    1. Run `npm run build` - should complete without errors
    2. Create test data with Spotify primary toggles enabled
    3. Trigger export and download ZIP
    4. Verify ZIP contains metadata_spotify.xlsx in addition to metadata.xlsx
    5. Open both Excel files and compare - Spotify version should have promoted artists in Album Artist/Track Artist columns
    6. Verify standard Excel remains unchanged
  </verify>
  <done>Spotify Excel generation implemented, both standard and Spotify Excel files generated when toggles are enabled, artist promotion works correctly</done>
</task>

<task type="auto">
  <name>Task 5: Integrate Spotify CSV into ZIP export</name>
  <files>src/components/ExportStep.tsx</files>
  <action>
    Update the downloadZip function to conditionally include Spotify CSV alongside standard CSV:

    1. Locate where the standard CSV is added to the ZIP (around line 414-415):
       ```typescript
       const csvContent = generateCSV();
       zip.file('metadata.csv', csvContent);
       ```

    2. After adding the standard CSV, add conditional Spotify CSV:
       ```typescript
       // Add standard CSV
       const csvContent = generateCSV();
       zip.file('metadata.csv', csvContent);

       // Add Spotify CSV if needed
       if (needsSpotifyExport()) {
         const spotifyCSVContent = generateSpotifyCSV();
         zip.file('metadata_spotify.csv', spotifyCSVContent);
       }
       ```

    3. Ensure this happens before the Excel generation section to maintain logical flow

    IMPORTANT: Standard CSV should ALWAYS be generated. Spotify CSV is only added when needsSpotifyExport() returns true.
  </action>
  <verify>
    1. Run `npm run build` - should complete without errors
    2. Test scenario 1: NO Spotify toggles enabled
       - Export and download ZIP
       - Verify ZIP contains: artwork, audio files, metadata.csv, metadata.xlsx (NO _spotify files)
    3. Test scenario 2: At least one Spotify toggle enabled
       - Export and download ZIP
       - Verify ZIP contains: artwork, audio files, metadata.csv, metadata_spotify.csv, metadata.xlsx, metadata_spotify.xlsx
    4. Verify file counts and names are correct in both scenarios
  </verify>
  <done>Spotify CSV integrated into export, ZIP contains correct files based on toggle state, both scenarios work correctly</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>Complete Spotify-specific export functionality with conditional dual file generation and artist promotion logic</what-built>
  <how-to-verify>
    1. Run dev server: `npm run dev`
    2. Navigate to form and create a test release:
       - Add release title, artist, and required fields
       - Add a featured artist at release level
       - Check "Make Primary on Spotify" for that featured artist
       - Add at least one track
       - Add a remixer at track level
       - Check "Make Primary on Spotify" for that remixer
    3. Proceed to Export step and click "Download ZIP"
    4. Extract the ZIP file and verify it contains 6 files:
       - Artwork image
       - Audio file (if added)
       - metadata.csv
       - metadata_spotify.csv
       - metadata.xlsx
       - metadata_spotify.xlsx
    5. Open metadata.csv and metadata_spotify.csv:
       - In metadata.csv: Featured artist should be in "Album Featured Artist" column, NOT in "Album Artist"
       - In metadata_spotify.csv: Featured artist should be appended to "Album Artist" column
       - Verify "Make Featured Artist Primary on Spotify" column shows 'Y' in both files
    6. Open metadata.xlsx and metadata_spotify.xlsx:
       - Verify same artist promotion behavior as CSV files
    7. Test with NO Spotify toggles:
       - Create new release without checking any Spotify toggles
       - Export and verify ZIP contains only 4 files (NO _spotify files)
  </how-to-verify>
  <resume-signal>Type "approved" to continue, or describe any issues found</resume-signal>
</task>

</tasks>

<verification>
Before declaring phase complete:
- [ ] `npm run build` completes with zero errors
- [ ] Export generates 4 files (CSV + Excel, standard + Spotify) when toggles are enabled
- [ ] Export generates 2 files (CSV + Excel, standard only) when toggles are disabled
- [ ] Spotify CSV correctly promotes toggled artists to primary position
- [ ] Spotify Excel correctly promotes toggled artists to primary position
- [ ] Standard files remain unchanged regardless of toggle state
- [ ] Flag columns in CSV show correct Y/N values based on toggle state
</verification>

<success_criteria>
- All tasks completed
- All verification checks pass
- Spotify export files generated only when needed
- Artist promotion logic works correctly for both release and track level
- Both CSV and Excel formats support Spotify-specific exports
- Standard export files remain unchanged
- No errors during export process
</success_criteria>

<output>
After completion, create `.planning/spotify-export-files-SUMMARY.md`
</output>
