import { ReleaseData, TrackData } from '@/pages/Index';

/**
 * Check if assets (artwork and audio files) are mandatory based on environment variable
 */
export const areAssetsMandatory = (): boolean => {
  const envValue = import.meta.env.VITE_ASSETS_MANDATORY;
  // Default to true (mandatory) if not set or if explicitly set to 'true'
  return envValue === undefined || envValue === 'true' || envValue === true;
};

/**
 * Validate that artwork is uploaded
 */
export const validateArtwork = (releaseData: ReleaseData): boolean => {
  if (!areAssetsMandatory()) {
    return true; // Validation passes when assets are optional
  }
  return !!releaseData.artwork;
};

/**
 * Validate that all tracks have audio files uploaded
 */
export const validateAudioFiles = (tracks: TrackData[]): boolean => {
  if (!areAssetsMandatory()) {
    return true; // Validation passes when assets are optional
  }
  return tracks.every(track => !!track.audioFile);
};

/**
 * Get list of tracks missing audio files
 */
export const getMissingAudioTracks = (tracks: TrackData[]): number[] => {
  if (!areAssetsMandatory()) {
    return [];
  }
  return tracks
    .map((track, index) => (!track.audioFile ? index : -1))
    .filter(index => index !== -1);
};

/**
 * Validate all assets (artwork + audio files)
 */
export const validateAllAssets = (releaseData: ReleaseData, tracks: TrackData[]): {
  isValid: boolean;
  missingArtwork: boolean;
  missingAudioTracks: number[];
} => {
  const missingArtwork = !validateArtwork(releaseData);
  const missingAudioTracks = getMissingAudioTracks(tracks);

  return {
    isValid: !missingArtwork && missingAudioTracks.length === 0,
    missingArtwork,
    missingAudioTracks,
  };
};

/**
 * Get user-friendly error message for asset validation failures
 */
export const getAssetValidationMessage = (
  missingArtwork: boolean,
  missingAudioTracks: number[]
): string => {
  if (!areAssetsMandatory()) {
    return '';
  }

  const messages: string[] = [];

  if (missingArtwork) {
    messages.push('Release artwork is required');
  }

  if (missingAudioTracks.length > 0) {
    if (missingAudioTracks.length === 1) {
      messages.push(`Track ${missingAudioTracks[0] + 1} is missing an audio file`);
    } else {
      const trackNumbers = missingAudioTracks.map(i => i + 1).join(', ');
      messages.push(`Tracks ${trackNumbers} are missing audio files`);
    }
  }

  return messages.join('. ');
};

/**
 * Get detailed information about missing mandatory fields for each track
 * Returns a map where key = track index (0-based), value = array of missing field names
 */
export const getIncompleteTrackDetails = (tracks: TrackData[]): Map<number, string[]> => {
  const incompleteTracksMap = new Map<number, string[]>();

  tracks.forEach((track, index) => {
    const missingFields: string[] = [];

    // Check title
    if (!track.title || track.title.trim() === '') {
      missingFields.push('title');
    }

    // Check artists (at least one non-empty artist required)
    if (!track.artists || track.artists.length === 0 || !track.artists.some(a => a && a.trim() !== '')) {
      missingFields.push('artists');
    }

    // Check genre
    if (!track.trackGenre || track.trackGenre.trim() === '') {
      missingFields.push('genre');
    }

    // Check performers (at least one with name and roles)
    const hasValidPerformer = track.performers && track.performers.some(p =>
      p.name && p.name.trim() !== '' && p.roles && p.roles.length > 0
    );
    if (!hasValidPerformer) {
      missingFields.push('performers');
    }

    // Check composers (at least one with name and roles)
    const hasValidComposer = track.composition && track.composition.some(c =>
      c.name && c.name.trim() !== '' && c.roles && c.roles.length > 0
    );
    if (!hasValidComposer) {
      missingFields.push('composers');
    }

    // Check producers (at least one with name and roles)
    const hasValidProducer = track.production && track.production.some(p =>
      p.name && p.name.trim() !== '' && p.roles && p.roles.length > 0
    );
    if (!hasValidProducer) {
      missingFields.push('producers');
    }

    // Check audio file (only if assets are mandatory)
    if (areAssetsMandatory() && !track.audioFile) {
      missingFields.push('audio file');
    }

    // Only add to map if there are missing fields
    if (missingFields.length > 0) {
      incompleteTracksMap.set(index, missingFields);
    }
  });

  return incompleteTracksMap;
};

/**
 * Generate detailed validation message for incomplete tracks
 * Returns user-friendly message listing all missing fields per track
 * Format: "Track 1: Missing title, audio file. Track 2: Missing performers"
 */
export const getDetailedValidationMessage = (tracks: TrackData[]): string => {
  const incompleteTracksMap = getIncompleteTrackDetails(tracks);

  // Return empty string if all tracks are valid
  if (incompleteTracksMap.size === 0) {
    return '';
  }

  const trackMessages: string[] = [];

  // Build messages for each incomplete track
  incompleteTracksMap.forEach((missingFields, trackIndex) => {
    const trackNumber = trackIndex + 1; // Convert to 1-indexed for user display
    const fieldsList = missingFields.join(', ');
    trackMessages.push(`Track ${trackNumber}: Missing ${fieldsList}`);
  });

  // Join all track messages
  let fullMessage = trackMessages.join('. ');

  // Truncate if message is too long (max ~200 characters)
  const MAX_LENGTH = 200;
  if (fullMessage.length > MAX_LENGTH) {
    fullMessage = fullMessage.substring(0, MAX_LENGTH - 3) + '...';
  }

  return fullMessage;
};

// ============================================================================
// PART 1: IDENTIFIER FORMAT VALIDATION
// ============================================================================

/**
 * Validation result for identifier fields
 */
export interface IdentifierValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Comprehensive validation result for all identifiers
 */
export interface AllIdentifiersValidation {
  upc: IdentifierValidationResult;
  catalogNumber: IdentifierValidationResult;
  cLine: IdentifierValidationResult;
  pLine: IdentifierValidationResult;
  trackIsrcs: Map<number, IdentifierValidationResult>; // track index -> validation result
}

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

// ============================================================================
// PART 2: SINGLE-TRACK FIELD MATCHING VALIDATION
// ============================================================================

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
