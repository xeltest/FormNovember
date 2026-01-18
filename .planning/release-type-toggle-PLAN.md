---
feature: release-type-toggle
type: execute
---

<objective>
Add a three-way release type toggle (Single/EP/Album) to the release page with the following behaviors:

1. **UI**: Pretty radial/segmented toggle on release page
2. **Single behavior**: Auto-populates Track 1 from release info when navigating to Tracks page
3. **EP/Album behavior**: Leaves tracks as-is (current behavior)
4. **Export logic**: Title Type field in CSV/Excel exports conditionally:
   - Single → "Single"
   - Album → "Album"
   - EP with ≤3 tracks → "Single"
   - EP with ≥4 tracks → "Album"

Purpose: Allow users to declare release type upfront, streamline single-track workflow, and ensure correct Title Type in distribution metadata.
Output: Working toggle, auto-population on page 2 for singles, correct export values.
</objective>

<context>
Key files to modify:
- `src/pages/Index.tsx` - ReleaseData type, step navigation logic, state management
- `src/components/ReleaseInfo.tsx` - Toggle UI placement
- `src/components/ExportStep.tsx` - Title Type export logic (currently hardcoded "SINGLE")
- `src/components/TrackForm.tsx` - Contains copyFromReleaseInfo logic to reuse
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add releaseType to ReleaseData interface and state</name>
  <files>src/pages/Index.tsx</files>
  <action>
1. Add `releaseType: 'single' | 'ep' | 'album'` to the ReleaseData interface (around line 16-35)
2. Add `releaseType: 'single'` as default in the initial state (around line 68-81)
3. This establishes the data model before UI work
  </action>
  <verify>TypeScript compiles without errors: `npm run build` or check IDE</verify>
  <done>ReleaseData type includes releaseType field, default value set to 'single'</done>
</task>

<task type="auto">
  <name>Task 2: Create ReleaseTypeToggle component</name>
  <files>src/components/ReleaseTypeToggle.tsx</files>
  <action>
Create a new component using the existing ToggleGroup from shadcn/ui:

```tsx
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Disc, Album, Music } from 'lucide-react';

interface ReleaseTypeToggleProps {
  value: 'single' | 'ep' | 'album';
  onChange: (value: 'single' | 'ep' | 'album') => void;
}

const ReleaseTypeToggle = ({ value, onChange }: ReleaseTypeToggleProps) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(val) => val && onChange(val as 'single' | 'ep' | 'album')}
        className="bg-muted p-1 rounded-lg"
      >
        <ToggleGroupItem
          value="single"
          className="px-6 py-2 data-[state=on]:bg-background data-[state=on]:shadow-sm rounded-md"
        >
          <Music className="w-4 h-4 mr-2" />
          Single
        </ToggleGroupItem>
        <ToggleGroupItem
          value="ep"
          className="px-6 py-2 data-[state=on]:bg-background data-[state=on]:shadow-sm rounded-md"
        >
          <Disc className="w-4 h-4 mr-2" />
          EP
        </ToggleGroupItem>
        <ToggleGroupItem
          value="album"
          className="px-6 py-2 data-[state=on]:bg-background data-[state=on]:shadow-sm rounded-md"
        >
          <Album className="w-4 h-4 mr-2" />
          Album
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default ReleaseTypeToggle;
```

Style notes:
- Use existing ToggleGroup/ToggleGroupItem from shadcn
- Add icons for visual appeal (Music for Single, Disc for EP, Album for Album)
- Use muted background with on-state highlighting
- Rounded, pill-style design
  </action>
  <verify>Component file exists and exports default</verify>
  <done>ReleaseTypeToggle.tsx created with proper typing and styling</done>
</task>

<task type="auto">
  <name>Task 3: Add ReleaseTypeToggle to ReleaseInfo page</name>
  <files>src/components/ReleaseInfo.tsx</files>
  <action>
1. Import ReleaseTypeToggle component
2. Add the toggle at the TOP of the Release Info form, before the first Card
3. Position it prominently so users see it first

Insert after the header (around line 176-178), before the first Card:

```tsx
{/* Release Type Selection */}
<div className="flex justify-center mb-6">
  <ReleaseTypeToggle
    value={data.releaseType || 'single'}
    onChange={(value) => updateData({ releaseType: value })}
  />
</div>
```

Also add the import at the top of the file.
  </action>
  <verify>Toggle renders on release page, selection persists when changed</verify>
  <done>Toggle visible at top of Release Info, value updates correctly</done>
</task>

<task type="auto">
  <name>Task 4: Auto-populate Track 1 when Single selected and navigating to page 2</name>
  <files>src/pages/Index.tsx</files>
  <action>
1. Modify handleNext function (around line 185-192) to check if:
   - currentStep === 1 (leaving Release Info)
   - releaseData.releaseType === 'single'

2. If both conditions met, auto-populate track 1 with release info BEFORE advancing step.
   Copy the logic from TrackForm.tsx copyFromReleaseInfo (lines 34-42):

```tsx
const handleNext = () => {
  if (canProceed(currentStep) && currentStep < 4) {
    // Auto-populate Track 1 for singles when leaving Release Info
    if (currentStep === 1 && releaseData.releaseType === 'single') {
      const updatedTrack = {
        ...tracks[0],
        title: releaseData.title,
        mixVersion: releaseData.mixVersion,
        artists: [...releaseData.artists],
        featuredArtists: releaseData.featuredArtists.map(a => ({ ...a })),
        remixers: releaseData.remixers.map(r => ({ ...r }))
      };
      const newTracks = [...tracks];
      newTracks[0] = updatedTrack;
      setTracks(newTracks);
    }
    setCurrentStep(currentStep + 1);
    setAttemptedProceed(false);
  } else {
    setAttemptedProceed(true);
  }
};
```

This ensures Track 1 is auto-populated when user clicks Next from Release Info with Single selected.
  </action>
  <verify>
1. Set release type to Single
2. Fill in release info (title, artists, etc.)
3. Click Next to go to Tracks
4. Track 1 should have title, artists, featured artists, remixers copied from release
  </verify>
  <done>Track 1 auto-populates from release info when Single is selected</done>
</task>

<task type="auto">
  <name>Task 5: Update export logic for Title Type field</name>
  <files>src/components/ExportStep.tsx</files>
  <action>
1. Create a helper function to determine export title type:

```tsx
const getExportTitleType = (): string => {
  const trackCount = tracks.length;

  switch (releaseData.releaseType) {
    case 'single':
      return 'Single';
    case 'album':
      return 'Album';
    case 'ep':
      // EP: ≤3 tracks = Single, ≥4 tracks = Album
      return trackCount <= 3 ? 'Single' : 'Album';
    default:
      return 'Single'; // fallback
  }
};
```

2. Replace hardcoded 'SINGLE' in generateCSV() (line 353) with getExportTitleType()
3. Replace hardcoded 'SINGLE' in generateSpotifyCSV() (line 592) with getExportTitleType()
4. Replace hardcoded 'SINGLE' in Excel generation (line 795) with getExportTitleType()
5. Replace hardcoded 'SINGLE' in Spotify Excel generation (line 978) with getExportTitleType()

Note: The current code has 'SINGLE' hardcoded in multiple places. All need updating.
  </action>
  <verify>
1. Create a release with Single type → export → Title Type = "Single"
2. Create a release with Album type → export → Title Type = "Album"
3. Create a release with EP type, 2 tracks → export → Title Type = "Single"
4. Create a release with EP type, 5 tracks → export → Title Type = "Album"
  </verify>
  <done>Title Type exports correctly based on releaseType and conditional EP logic</done>
</task>

<task type="auto">
  <name>Task 6: Update pitch form URL builder</name>
  <files>src/components/ExportStep.tsx</files>
  <action>
The buildPitchFormUrl function (lines 132-170) currently calculates release type from track count.
Update it to use the user-selected releaseType instead:

```tsx
const buildPitchFormUrl = () => {
  const baseUrl = "https://airtable.com/appncstxdoakDSeBs/pagq9v5PHhRqVqB9N/form";

  // Use user-selected release type, applying EP conditional logic
  let releaseType = "Single";
  if (releaseData.releaseType === 'album') {
    releaseType = "Album";
  } else if (releaseData.releaseType === 'ep') {
    // EP: show as "EP" in pitch form (don't apply export logic here)
    releaseType = "EP";
  }

  // ... rest of function unchanged
```

Note: For the pitch form, we show "EP" directly (not the export conditional).
The export conditional (≤3→Single, ≥4→Album) only applies to CSV/Excel metadata.
  </action>
  <verify>Pitch form URL params include correct Release Type based on selection</verify>
  <done>Pitch form URL uses selected release type</done>
</task>

</tasks>

<verification>
Before declaring complete:
- [ ] `npm run build` succeeds without errors
- [ ] Toggle renders on Release Info page with Single/EP/Album options
- [ ] Toggle selection persists through page navigation
- [ ] Single: Track 1 auto-populates when navigating to Tracks page
- [ ] EP/Album: Track 1 NOT auto-populated when navigating
- [ ] Export CSV: Title Type = "Single" when Single selected
- [ ] Export CSV: Title Type = "Album" when Album selected
- [ ] Export CSV: Title Type = "Single" when EP with ≤3 tracks
- [ ] Export CSV: Title Type = "Album" when EP with ≥4 tracks
- [ ] Excel exports match CSV behavior
</verification>

<success_criteria>
- All 6 tasks completed
- All verification checks pass
- No TypeScript errors
- UI is visually polished (matches existing design language)
- Session persistence works (releaseType saved/restored)
</success_criteria>

<output>
After completion, create `.planning/release-type-toggle-SUMMARY.md`
</output>
