import { ReleaseData, TrackData } from '@/pages/Index';

/**
 * Type for persisted state with version and timestamp
 */
export interface PersistedState<T> {
  version: number;
  timestamp: number;
  data: T;
}

/**
 * Serialized types without File objects
 */
export type SerializedReleaseData = Omit<ReleaseData, 'artwork'>;
export type SerializedTrackData = Omit<TrackData, 'audioFile'>;

/**
 * Serialize ReleaseData by removing File object (artwork)
 */
export const serializeReleaseData = (data: ReleaseData): SerializedReleaseData => {
  const { artwork, ...rest } = data;
  return rest;
};

/**
 * Deserialize and validate ReleaseData
 * Returns null if data is invalid
 */
export const deserializeReleaseData = (data: any): ReleaseData | null => {
  if (!data || typeof data !== 'object') {
    return null;
  }

  // Validate required fields
  if (
    typeof data.title !== 'string' ||
    !Array.isArray(data.artists) ||
    typeof data.releaseDate !== 'string' ||
    typeof data.labelName !== 'string' ||
    typeof data.albumGenre !== 'string' ||
    typeof data.albumCLine !== 'string' ||
    typeof data.albumPLine !== 'string'
  ) {
    return null;
  }

  // Return validated data with artwork as undefined
  return {
    ...data,
    artwork: undefined,
    // Ensure arrays exist
    artists: data.artists || [''],
    featuredArtists: data.featuredArtists || [],
    remixers: data.remixers || [],
    territories: data.territories || [],
  } as ReleaseData;
};

/**
 * Serialize tracks array by removing File objects (audioFile)
 */
export const serializeTracks = (tracks: TrackData[]): SerializedTrackData[] => {
  return tracks.map(track => {
    const { audioFile, ...rest } = track;
    return rest;
  });
};

/**
 * Deserialize and validate tracks array
 * Returns null if data is invalid
 */
export const deserializeTracks = (data: any): TrackData[] | null => {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  // Validate each track
  const isValid = data.every(track => {
    return (
      track &&
      typeof track === 'object' &&
      typeof track.title === 'string' &&
      Array.isArray(track.artists) &&
      typeof track.trackGenre === 'string' &&
      typeof track.explicitContent === 'string'
    );
  });

  if (!isValid) {
    return null;
  }

  // Return validated tracks with audioFile as undefined
  return data.map(track => ({
    ...track,
    audioFile: undefined,
    // Ensure required arrays exist
    artists: track.artists || [''],
    featuredArtists: track.featuredArtists || [],
    remixers: track.remixers || [],
    performers: track.performers || [{ name: '', roles: [] }],
    composition: track.composition || [{ name: '', roles: [] }],
    production: track.production || [{ name: '', roles: [] }],
    publishers: track.publishers || [],
  })) as TrackData[];
};

/**
 * Type guard to check if restored state is valid
 */
export const isValidPersistedState = <T>(state: any): state is PersistedState<T> => {
  return (
    state &&
    typeof state === 'object' &&
    typeof state.version === 'number' &&
    typeof state.timestamp === 'number' &&
    state.data !== undefined
  );
};
