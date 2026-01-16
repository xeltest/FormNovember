<!-- Completed: 2026-01-16 -->
<!-- Status: SUCCESS -->
<!-- Files modified: src/components/ExportStep.tsx -->

<objective>
Update the export logic so the "Filename" column in the CSV and Excel files contains the same filename that the audio file is actually renamed to in the ZIP, not the original uploaded filename.
</objective>

<context>
In `src/components/ExportStep.tsx`, audio files are renamed during ZIP export using this pattern (lines 1068-1072):
```typescript
const trackNumber = String(i + 1).padStart(2, '0');
const sanitizedTitle = tracks[i].title.replace(/[^a-z0-9]/gi, '_');
const extension = tracks[i].audioFile!.name.split('.').pop();
const filename = `${trackNumber}_${sanitizedTitle}.${extension}`;
```

However, the CSV and Excel export functions use the original uploaded filename:
- CSV: line 401 - `track.audioFile?.name || ''`
- Spotify CSV: line 640 - `track.audioFile?.name || ''`
- Excel: line 843 - `track.audioFile?.name || ''`
- Spotify Excel: line 1026 - `track.audioFile?.name || ''`

This causes a mismatch between what the metadata says and what the actual file is named in the ZIP.
</context>

<requirements>
1. Create a helper function that generates the export filename for a track (accepts track and index)
2. Use this helper function in all four places where the filename is written to metadata:
   - `generateCSV()` - line 401
   - `generateSpotifyCSV()` - line 640
   - Excel generation in `handleDownloadZip()` - line 843
   - Spotify Excel generation in `handleDownloadZip()` - line 1026
3. Use the same helper function in the ZIP file creation loop to ensure consistency
4. Handle the case where `track.audioFile` is null (return empty string)
</requirements>

<implementation>
Add a helper function inside the component:
```typescript
const getExportFilename = (track: TrackData, index: number): string => {
  if (!track.audioFile) return '';
  const trackNumber = String(index + 1).padStart(2, '0');
  const sanitizedTitle = track.title.replace(/[^a-z0-9]/gi, '_');
  const extension = track.audioFile.name.split('.').pop();
  return `${trackNumber}_${sanitizedTitle}.${extension}`;
};
```

Then replace the four filename references and the ZIP loop to use this function.
</implementation>

<output>
Modify `./src/components/ExportStep.tsx`:
- Add the `getExportFilename` helper function
- Update all filename references to use the helper
</output>

<verification>
After changes:
1. The filename in metadata.csv should match the actual audio filename in the ZIP
2. The filename in metadata.xlsx should match the actual audio filename in the ZIP
3. Same for spotify versions if applicable
4. No TypeScript errors
</verification>
