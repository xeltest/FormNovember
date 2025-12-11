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
