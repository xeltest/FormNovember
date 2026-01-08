# Implementation Plan: Comprehensive Form Validation

**Date:** 2026-01-08
**Tasks:** Format validation for identifiers + Single-track release field matching

## Overview

Implement two major validation features:
1. **Format Validation** for UPC, ISRC, Catalog Numbers, and C/P Lines with on-blur validation and export blocking
2. **Single-Track Field Matching** with "Copy from Release Info" button and smart export validation

## Context

### Current Implementation
- **Validation System:** `src/lib/assetValidation.ts` (currently handles asset validation only)
- **Release Form:** `src/components/ReleaseInfo.tsx` (contains UPC, Catalog Number, C/P Line fields)
- **Track Form:** `src/components/TrackForm.tsx` (parent component)
- **Track Details:** `src/components/track/TrackDetailsSection.tsx` (contains ISRC field)
- **Track Metadata:** `src/components/track/TrackMetadataSection.tsx` (contains track title, mix/version, artists)
- **Track Artists:** `src/components/track/TrackArtistsSection.tsx` (contains featured artists, remixers)
- **Export Step:** `src/components/ExportStep.tsx` (handles export validation and blocking)
- **Toast System:** shadcn/ui toast + sonner available for non-intrusive warnings

### Data Structures
```typescript
// From src/pages/Index.tsx
interface ReleaseData {
  title: string;
  mixVersion?: string;
  artists: string[];
  featuredArtists: string[];
  remixers: string[];
  // ... other fields
  catalogNumber?: string;
  upc?: string;
  albumCLine: string;
  albumPLine: string;
}

interface TrackData {
  title: string;
  mixVersion?: string;
  artists: string[];
  featuredArtists: string[];
  remixers: string[];
  // ... other fields
  isrcCode?: string;
}
```

## Part 1: Format Validation for Identifiers

### Task 1.1: Create validation functions in assetValidation.ts

**Location:** `src/lib/assetValidation.ts`

#### Implementation Steps

1. **Add validation result interfaces:**
```typescript
export interface IdentifierValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export interface AllIdentifiersValidation {
  upc: IdentifierValidationResult;
  catalogNumber: IdentifierValidationResult;
  cLine: IdentifierValidationResult;
  pLine: IdentifierValidationResult;
  trackIsrcs: Map<number, IdentifierValidationResult>; // track index -> validation result
}
```

2. **Add UPC validation function:**
```typescript
/**
 * Validate UPC format (12 or 13 digits)
 * Empty/undefined values are valid (optional field)
 */
export const validateUPC = (upc?: string): IdentifierValidationResult => {
  if (!upc || upc.trim() === '') {
    return { isValid: true };
  }

  const cleaned = upc.trim();
  const isValidFormat = /^\d{12,13}$/.test(cleaned);

  return {
    isValid: isValidFormat,
    errorMessage: isValidFormat
      ? undefined
      : 'UPC must be 12 or 13 digits'
  };
};
```

3. **Add ISRC validation and cleaning functions:**
```typescript
/**
 * Clean ISRC by removing hyphens and whitespace, converting to uppercase
 * Used for both validation and export formatting
 */
export const cleanISRC = (isrc: string): string => {
  return isrc.replace(/[-\s]/g, '').toUpperCase();
};

/**
 * Validate ISRC format: CC-XXX-YY-NNNNN (with or without hyphens)
 * First 2 chars = letters (country code)
 * Next 3 = alphanumeric (registrant code)
 * Next 2 = digits (year)
 * Last 5 = digits (designation code)
 * Empty/undefined values are valid (optional field)
 */
export const validateISRC = (isrc?: string): IdentifierValidationResult => {
  if (!isrc || isrc.trim() === '') {
    return { isValid: true };
  }

  // Remove hyphens and whitespace for validation
  const cleaned = cleanISRC(isrc);

  // Must be exactly 12 characters after removing hyphens
  if (cleaned.length !== 12) {
    return {
      isValid: false,
      errorMessage: 'ISRC must be 12 characters (format: CC-XXX-YY-NNNNN)'
    };
  }

  // First 2 must be letters (country code)
  if (!/^[A-Z]{2}/.test(cleaned)) {
    return {
      isValid: false,
      errorMessage: 'ISRC must start with 2-letter country code'
    };
  }

  // Next 3 can be letters or digits (registrant code)
  if (!/^[A-Z]{2}[A-Z0-9]{3}/.test(cleaned)) {
    return {
      isValid: false,
      errorMessage: 'ISRC registrant code (characters 3-5) must be alphanumeric'
    };
  }

  // Next 2 must be digits (year)
  if (!/^[A-Z]{2}[A-Z0-9]{3}\d{2}/.test(cleaned)) {
    return {
      isValid: false,
      errorMessage: 'ISRC year (characters 6-7) must be 2 digits'
    };
  }

  // Last 5 must be digits (designation code)
  if (!/^[A-Z]{2}[A-Z0-9]{3}\d{2}\d{5}$/.test(cleaned)) {
    return {
      isValid: false,
      errorMessage: 'ISRC designation code (last 5 characters) must be digits'
    };
  }

  return { isValid: true };
};
```

4. **Add Catalog Number validation function:**
```typescript
/**
 * Validate Catalog Number format
 * Should be alphanumeric only (no hyphens or special characters)
 * Ideally 3+ letters followed by 3+ numbers, but not strictly enforced
 * Empty/undefined values are valid (optional field)
 */
export const validateCatalogNumber = (catalogNumber?: string): IdentifierValidationResult => {
  if (!catalogNumber || catalogNumber.trim() === '') {
    return { isValid: true };
  }

  const cleaned = catalogNumber.trim();

  // Check for alphanumeric only (no hyphens or special chars)
  if (!/^[A-Za-z0-9]+$/.test(cleaned)) {
    return {
      isValid: false,
      errorMessage: 'Catalog number should contain only letters and numbers (no hyphens or special characters)'
    };
  }

  return { isValid: true };
};
```

5. **Add C/P Line validation function:**
```typescript
/**
 * Validate C Line and P Line format: "YYYY Alphanumeric String"
 * Must start with 4-digit year, followed by space, then text
 * Required field (cannot be empty)
 */
export const validateCopyrightLine = (line: string, lineType: 'C' | 'P'): IdentifierValidationResult => {
  if (!line || line.trim() === '') {
    return {
      isValid: false,
      errorMessage: `${lineType} Line is required`
    };
  }

  const cleaned = line.trim();

  // Must start with 4-digit year followed by space
  const yearMatch = cleaned.match(/^(\d{4})\s+(.+)$/);

  if (!yearMatch) {
    return {
      isValid: false,
      errorMessage: `${lineType} Line must start with a 4-digit year followed by a space and text (e.g., "2025 Example Records")`
    };
  }

  const year = parseInt(yearMatch[1]);
  const currentYear = new Date().getFullYear();

  // Sanity check on year (must be between 1900 and current year + 5)
  if (year < 1900 || year > currentYear + 5) {
    return {
      isValid: false,
      errorMessage: `${lineType} Line year must be between 1900 and ${currentYear + 5}`
    };
  }

  // Must have text after the year and space
  if (yearMatch[2].trim().length === 0) {
    return {
      isValid: false,
      errorMessage: `${lineType} Line must include text after the year`
    };
  }

  return { isValid: true };
};
```

6. **Add comprehensive validation function for export:**
```typescript
/**
 * Validate all identifiers for export
 * Returns validation results for all identifier fields
 */
export const validateAllIdentifiers = (
  releaseData: ReleaseData,
  tracks: TrackData[]
): AllIdentifiersValidation => {
  const trackIsrcs = new Map<number, IdentifierValidationResult>();

  tracks.forEach((track, index) => {
    trackIsrcs.set(index, validateISRC(track.isrcCode));
  });

  return {
    upc: validateUPC(releaseData.upc),
    catalogNumber: validateCatalogNumber(releaseData.catalogNumber),
    cLine: validateCopyrightLine(releaseData.albumCLine, 'C'),
    pLine: validateCopyrightLine(releaseData.albumPLine, 'P'),
    trackIsrcs
  };
};

/**
 * Get export blocking messages for invalid identifiers
 * Returns array of error messages that should block export
 */
export const getIdentifierBlockingMessages = (validation: AllIdentifiersValidation): string[] => {
  const messages: string[] = [];

  if (!validation.upc.isValid) {
    messages.push(`UPC: ${validation.upc.errorMessage}. Enter a valid UPC or leave blank and one will be assigned for you.`);
  }

  if (!validation.catalogNumber.isValid) {
    messages.push(`Catalog Number: ${validation.catalogNumber.errorMessage}`);
  }

  if (!validation.cLine.isValid) {
    messages.push(`C Line: ${validation.cLine.errorMessage}`);
  }

  if (!validation.pLine.isValid) {
    messages.push(`P Line: ${validation.pLine.errorMessage}`);
  }

  validation.trackIsrcs.forEach((result, trackIndex) => {
    if (!result.isValid) {
      messages.push(`Track ${trackIndex + 1} ISRC: ${result.errorMessage}`);
    }
  });

  return messages;
};
```

### Task 1.2: Add on-blur validation with toast warnings

**Files:**
- `src/components/ReleaseInfo.tsx` (UPC, Catalog Number, C/P Lines)
- `src/components/track/TrackDetailsSection.tsx` (ISRC)

#### Implementation Steps for ReleaseInfo.tsx

1. **Import toast and validation functions:**
```typescript
import { useToast } from '@/components/ui/use-toast';
import { validateUPC, validateCatalogNumber, validateCopyrightLine } from '@/lib/assetValidation';
```

2. **Add toast hook:**
```typescript
const { toast } = useToast();
```

3. **Create blur handlers:**
```typescript
const handleUPCBlur = () => {
  if (data.upc && data.upc.trim() !== '') {
    const result = validateUPC(data.upc);
    if (!result.isValid) {
      toast({
        variant: "destructive",
        title: "Invalid UPC",
        description: result.errorMessage,
      });
    }
  }
};

const handleCatalogNumberBlur = () => {
  if (data.catalogNumber && data.catalogNumber.trim() !== '') {
    const result = validateCatalogNumber(data.catalogNumber);
    if (!result.isValid) {
      toast({
        variant: "destructive",
        title: "Invalid Catalog Number",
        description: result.errorMessage,
      });
    }
  }
};

const handleCLineBlur = () => {
  const result = validateCopyrightLine(data.albumCLine, 'C');
  if (!result.isValid) {
    toast({
      variant: "destructive",
      title: "Invalid C Line",
      description: result.errorMessage,
    });
  }
};

const handlePLineBlur = () => {
  const result = validateCopyrightLine(data.albumPLine, 'P');
  if (!result.isValid) {
    toast({
      variant: "destructive",
      title: "Invalid P Line",
      description: result.errorMessage,
    });
  }
};
```

4. **Update Input fields to add onBlur handlers:**
```typescript
// UPC field (~line 463)
<Input
  id="upc"
  value={data.upc || ''}
  onChange={(e) => updateData({ upc: e.target.value })}
  onBlur={handleUPCBlur}
  placeholder="123456789012 or 1234567890123"
/>

// Catalog Number field (~line 450)
<Input
  id="catalogNumber"
  value={data.catalogNumber || ''}
  onChange={(e) => updateData({ catalogNumber: e.target.value })}
  onBlur={handleCatalogNumberBlur}
  placeholder="ABC123"
/>

// C Line field (~line 487)
<Input
  id="albumCLine"
  value={data.albumCLine}
  onChange={(e) => updateData({ albumCLine: e.target.value })}
  onBlur={handleCLineBlur}
  placeholder="2025 Example Records"
/>

// P Line field (~line 501)
<Input
  id="albumPLine"
  value={data.albumPLine}
  onChange={(e) => updateData({ albumPLine: e.target.value })}
  onBlur={handlePLineBlur}
  placeholder="2025 Example Records"
/>
```

#### Implementation Steps for TrackDetailsSection.tsx

1. **Import toast and validation:**
```typescript
import { useToast } from '@/components/ui/use-toast';
import { validateISRC } from '@/lib/assetValidation';
```

2. **Add toast hook and blur handler:**
```typescript
const { toast } = useToast();

const handleISRCBlur = () => {
  if (track.isrcCode && track.isrcCode.trim() !== '') {
    const result = validateISRC(track.isrcCode);
    if (!result.isValid) {
      toast({
        variant: "destructive",
        title: "Invalid ISRC",
        description: result.errorMessage,
      });
    }
  }
};
```

3. **Update ISRC Input field (~line 103):**
```typescript
<Input
  id="isrcCode"
  value={track.isrcCode || ''}
  onChange={(e) => onChange({ isrcCode: e.target.value })}
  onBlur={handleISRCBlur}
  placeholder="USMC12345678 or US-MC1-23-45678"
/>
```

### Task 1.3: Add export blocking validation

**File:** `src/components/ExportStep.tsx`

#### Implementation Steps

1. **Import validation functions:**
```typescript
import { validateAllIdentifiers, getIdentifierBlockingMessages } from '@/lib/assetValidation';
```

2. **Update validateData function (~line 31) to include identifier validation:**
```typescript
const validateData = () => {
  const issues = [];

  // Asset validation (artwork only)
  const assetValidation = validateAllAssets(releaseData, tracks);
  if (assetValidation.missingArtwork) {
    issues.push('Release artwork is required');
  }

  // Release validation
  if (!releaseData.title) issues.push('Release title is required');
  if (!releaseData.artists[0]) issues.push('At least one release artist is required');
  if (!releaseData.releaseDate) issues.push('Release date is required');
  if (!releaseData.labelName) issues.push('Label name is required');
  if (!releaseData.albumGenre) issues.push('Album genre is required');
  if (!releaseData.albumCLine) issues.push('Album C Line is required');
  if (!releaseData.albumPLine) issues.push('Album P Line is required');

  // Identifier format validation - BLOCKING
  const identifierValidation = validateAllIdentifiers(releaseData, tracks);
  const identifierMessages = getIdentifierBlockingMessages(identifierValidation);
  issues.push(...identifierMessages);

  // Track validation - use detailed validation message
  const detailedTrackMessage = getDetailedValidationMessage(tracks);
  if (detailedTrackMessage) {
    issues.push(detailedTrackMessage);
  }

  return issues;
};
```

### Task 1.4: Clean ISRCs on export (remove hyphens)

**File:** `src/components/ExportStep.tsx`

#### Implementation Steps

1. **Import cleanISRC function:**
```typescript
import {
  validateAllAssets,
  getAssetValidationMessage,
  getDetailedValidationMessage,
  validateAllIdentifiers,
  getIdentifierBlockingMessages,
  cleanISRC
} from '@/lib/assetValidation';
```

2. **Find the CSV/Excel generation code and clean ISRCs before export:**

When building the track data for export (likely in a function that generates CSV rows or Excel data), ensure ISRCs are cleaned:

```typescript
// Example - wherever track ISRC is being added to export data
const trackRow = {
  // ... other fields
  isrc: track.isrcCode ? cleanISRC(track.isrcCode) : '',
  secondaryIsrc: track.secondaryIsrc ? cleanISRC(track.secondaryIsrc) : '',
  // ... other fields
};
```

**Note:** The exact location will depend on where the CSV/Excel export logic exists in ExportStep.tsx. Look for where track data is mapped to export rows and apply `cleanISRC()` to any ISRC fields.

## Part 2: Single-Track Release Field Matching

### Task 2.1: Add "Copy from Release Info" button to track form

**Files:**
- `src/components/TrackForm.tsx`
- `src/components/track/TrackMetadataSection.tsx`

#### Implementation Steps for TrackForm.tsx

1. **Add helper function to copy release data:**
```typescript
const copyFromReleaseInfo = () => {
  updateTrack({
    title: releaseData.title,
    mixVersion: releaseData.mixVersion,
    artists: [...releaseData.artists],
    featuredArtists: [...releaseData.featuredArtists],
    remixers: [...releaseData.remixers]
  });
};
```

2. **Pass copyFromReleaseInfo to TrackMetadataSection:**
```typescript
<TrackMetadataSection
  track={track}
  onChange={updateTrack}
  showValidation={showValidation}
  onCopyFromRelease={copyFromReleaseInfo}
/>
```

#### Implementation Steps for TrackMetadataSection.tsx

1. **Update interface to accept callback:**
```typescript
interface TrackMetadataSectionProps {
  track: TrackData;
  onChange: (updates: Partial<TrackData>) => void;
  showValidation: boolean;
  onCopyFromRelease: () => void;
}
```

2. **Update component signature:**
```typescript
const TrackMetadataSection = ({
  track,
  onChange,
  showValidation,
  onCopyFromRelease
}: TrackMetadataSectionProps) => {
```

3. **Add "Copy from Release Info" button after CardTitle (~line 50):**
```typescript
<CardHeader>
  <div className="flex items-center justify-between">
    <CardTitle>Track Metadata</CardTitle>
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onCopyFromRelease}
      className="text-xs"
    >
      Copy from Release Info
    </Button>
  </div>
</CardHeader>
```

### Task 2.2: Add single-track export validation

**File:** `src/lib/assetValidation.ts`

#### Implementation Steps

1. **Add single-track validation function:**
```typescript
/**
 * Validate that single-track releases have matching fields between release and track
 * Returns array of mismatched field names
 */
export const validateSingleTrackMatching = (
  releaseData: ReleaseData,
  tracks: TrackData[]
): string[] => {
  // Only validate if there's exactly one track
  if (tracks.length !== 1) {
    return [];
  }

  const track = tracks[0];
  const mismatches: string[] = [];

  // Check title
  if (releaseData.title !== track.title) {
    mismatches.push('Title');
  }

  // Check mix/version
  if ((releaseData.mixVersion || '') !== (track.mixVersion || '')) {
    mismatches.push('Mix/Version');
  }

  // Check artists (must have same length and same values)
  const releaseArtists = releaseData.artists.filter(a => a && a.trim() !== '');
  const trackArtists = track.artists.filter(a => a && a.trim() !== '');

  if (releaseArtists.length !== trackArtists.length ||
      !releaseArtists.every((artist, i) => artist === trackArtists[i])) {
    mismatches.push('Artist(s)');
  }

  // Check featured artists
  const releaseFeatured = releaseData.featuredArtists.filter(a => a && a.trim() !== '');
  const trackFeatured = track.featuredArtists.filter(a => a && a.trim() !== '');

  if (releaseFeatured.length !== trackFeatured.length ||
      !releaseFeatured.every((artist, i) => artist === trackFeatured[i])) {
    mismatches.push('Featured Artist(s)');
  }

  // Check remixers
  const releaseRemixers = releaseData.remixers.filter(a => a && a.trim() !== '');
  const trackRemixers = track.remixers.filter(a => a && a.trim() !== '');

  if (releaseRemixers.length !== trackRemixers.length ||
      !releaseRemixers.every((artist, i) => artist === trackRemixers[i])) {
    mismatches.push('Remixer(s)');
  }

  return mismatches;
};

/**
 * Get user-friendly message for single-track mismatch
 */
export const getSingleTrackMismatchMessage = (mismatches: string[]): string => {
  if (mismatches.length === 0) {
    return '';
  }

  const fieldList = mismatches.join(', ');
  return `Single-track release detected: The following fields must match between release and track: ${fieldList}. Please use "Copy from Release Info" or manually sync these fields.`;
};
```

### Task 2.3: Integrate single-track validation into export

**File:** `src/components/ExportStep.tsx`

#### Implementation Steps

1. **Import single-track validation functions:**
```typescript
import {
  validateAllAssets,
  getAssetValidationMessage,
  getDetailedValidationMessage,
  validateAllIdentifiers,
  getIdentifierBlockingMessages,
  validateSingleTrackMatching,
  getSingleTrackMismatchMessage
} from '@/lib/assetValidation';
```

2. **Add single-track validation to validateData function:**
```typescript
const validateData = () => {
  const issues = [];

  // Asset validation (artwork only)
  const assetValidation = validateAllAssets(releaseData, tracks);
  if (assetValidation.missingArtwork) {
    issues.push('Release artwork is required');
  }

  // Release validation
  if (!releaseData.title) issues.push('Release title is required');
  if (!releaseData.artists[0]) issues.push('At least one release artist is required');
  if (!releaseData.releaseDate) issues.push('Release date is required');
  if (!releaseData.labelName) issues.push('Label name is required');
  if (!releaseData.albumGenre) issues.push('Album genre is required');
  if (!releaseData.albumCLine) issues.push('Album C Line is required');
  if (!releaseData.albumPLine) issues.push('Album P Line is required');

  // Identifier format validation - BLOCKING
  const identifierValidation = validateAllIdentifiers(releaseData, tracks);
  const identifierMessages = getIdentifierBlockingMessages(identifierValidation);
  issues.push(...identifierMessages);

  // Single-track field matching validation - BLOCKING
  const singleTrackMismatches = validateSingleTrackMatching(releaseData, tracks);
  const singleTrackMessage = getSingleTrackMismatchMessage(singleTrackMismatches);
  if (singleTrackMessage) {
    issues.push(singleTrackMessage);
  }

  // Track validation - use detailed validation message
  const detailedTrackMessage = getDetailedValidationMessage(tracks);
  if (detailedTrackMessage) {
    issues.push(detailedTrackMessage);
  }

  return issues;
};
```

## Testing Checklist

### Format Validation Testing
- [ ] UPC field validates on blur with 12 or 13 digit requirement
- [ ] UPC accepts exactly 12 digits
- [ ] UPC accepts exactly 13 digits
- [ ] UPC rejects 11 digits or less
- [ ] UPC rejects 14 digits or more
- [ ] UPC shows toast warning when invalid format entered
- [ ] UPC allows empty/blank (optional field)
- [ ] UPC blocks export when invalid and shows proper message
- [ ] ISRC validates on blur with CC-XXX-YY-NNNNN format
- [ ] ISRC accepts both hyphenated and non-hyphenated formats
- [ ] ISRC validates country code (first 2 chars are letters)
- [ ] ISRC validates registrant code (next 3 alphanumeric)
- [ ] ISRC validates year (next 2 digits)
- [ ] ISRC validates designation code (last 5 digits)
- [ ] ISRC shows toast warning when invalid
- [ ] ISRC allows empty/blank (optional field)
- [ ] ISRC blocks export when invalid
- [ ] ISRC with hyphens (US-MC1-23-45678) is cleaned to USMC12345678 in export files
- [ ] ISRC without hyphens (USMC12345678) remains unchanged in export files
- [ ] Secondary ISRC is also cleaned if hyphens present
- [ ] Exported CSV contains cleaned ISRCs (no hyphens)
- [ ] Exported Excel contains cleaned ISRCs (no hyphens)
- [ ] Catalog Number validates alphanumeric only
- [ ] Catalog Number warns against hyphens/special chars
- [ ] Catalog Number allows empty/blank (optional field)
- [ ] C Line validates YYYY format at start
- [ ] C Line requires text after year
- [ ] C Line shows toast warning when invalid
- [ ] C Line blocks export when invalid (required field)
- [ ] P Line validates YYYY format at start
- [ ] P Line requires text after year
- [ ] P Line shows toast warning when invalid
- [ ] P Line blocks export when invalid (required field)
- [ ] Placeholder text shows correct format examples

### Single-Track Matching Testing
- [ ] "Copy from Release Info" button appears in track metadata section
- [ ] Button copies release title to track title
- [ ] Button copies release mix/version to track mix/version
- [ ] Button copies release artists to track artists
- [ ] Button copies featured artists correctly
- [ ] Button copies remixers correctly
- [ ] Export validation detects single-track releases (tracks.length === 1)
- [ ] Export validation ignores multi-track releases
- [ ] Export shows specific mismatched fields (Title, Mix/Version, etc.)
- [ ] Export blocks when single-track fields don't match
- [ ] Export message mentions "Copy from Release Info" button
- [ ] Export allows when all fields match for single-track
- [ ] No validation errors for multi-track releases with different track/release data

### General Testing
- [ ] Toast notifications appear in correct position
- [ ] Toast notifications auto-dismiss after delay
- [ ] Multiple validation errors stack properly in toast
- [ ] Export validation alert shows all errors clearly
- [ ] TypeScript compilation succeeds with no errors
- [ ] No console errors during validation
- [ ] Form performance remains smooth with validation

## Notes

### Validation Timing
- **On blur:** Show non-intrusive toast warnings to inform user of format issues
- **On export:** Block export with alert dialog listing all validation failures

### UPC Validation
- Accepts both 12-digit and 13-digit UPCs (EAN-13 and UPC-A formats)
- Export blocking message for UPC explicitly mentions that leaving it blank will result in auto-assignment, matching distribution platform behavior

### ISRC Flexibility and Export Cleaning
- Accepts both `USMC12345678` and `US-MC1-23-45678` formats to accommodate user preferences
- Validates the actual content structure regardless of hyphen presence
- **Critical:** ISRCs are automatically cleaned (hyphens removed) during export to CSV/Excel files
- The `cleanISRC()` helper function is used both for validation and export formatting
- Users can enter ISRCs with hyphens for readability, but exports will always have clean format

### Catalog Number Philosophy
Promotes ideal format (ABC123) via placeholder text but doesn't strictly enforce it, allowing flexibility for different labeling conventions.

### Single-Track UX Flow
1. User creates release with metadata
2. User adds first track
3. User clicks "Copy from Release Info" button (optional, for convenience)
4. If user modifies fields independently, export validation catches mismatches
5. Export shows which specific fields don't match
6. User can either manually sync or use "Copy from Release Info" button

### Future Enhancements (Out of Scope)
- Auto-sync option toggle in settings
- Real-time validation warnings (instead of just on blur)
- ISRC country code validation against ISO 3166-1 alpha-2 list
- UPC checksum digit validation
- Automatic field syncing when track count changes from 2→1

## Files Modified Summary

**New validation functions:**
- `src/lib/assetValidation.ts` (+~300 lines)
  - `validateUPC()` - 12 or 13 digit validation
  - `cleanISRC()` - Remove hyphens/whitespace, uppercase
  - `validateISRC()` - CC-XXX-YY-NNNNN format validation
  - `validateCatalogNumber()` - Alphanumeric validation
  - `validateCopyrightLine()` - YYYY + text validation
  - `validateAllIdentifiers()` - Comprehensive validation
  - `getIdentifierBlockingMessages()` - Export error messages
  - `validateSingleTrackMatching()` - Single-track field comparison
  - `getSingleTrackMismatchMessage()` - Single-track error message

**Updated components:**
- `src/components/ReleaseInfo.tsx` (add blur handlers for UPC/Catalog/C Line/P Line, update placeholders)
- `src/components/track/TrackDetailsSection.tsx` (add ISRC blur handler, update placeholder)
- `src/components/track/TrackMetadataSection.tsx` (add "Copy from Release Info" button, accept callback prop)
- `src/components/TrackForm.tsx` (add copyFromReleaseInfo function, pass to child)
- `src/components/ExportStep.tsx` (integrate identifier + single-track validation, clean ISRCs on export)

**Dependencies:**
- Uses existing shadcn/ui toast system (no new dependencies)
