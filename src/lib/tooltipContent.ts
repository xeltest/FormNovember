/**
 * Centralized Tooltip Content Configuration
 *
 * This file contains all tooltip text for form field labels.
 * Edit the text in this file to update tooltips across the entire application.
 *
 * Current text format: "This field is [FIELD_NAME] and should be filled in properly"
 * Replace with proper guidance text as needed.
 */

export type TooltipFieldKey =
  // Release Information fields
  | 'releaseTitle'
  | 'releaseMixVersion'
  | 'releaseArtist'
  | 'featuredArtist'
  | 'remixer'
  | 'releaseDate'
  | 'previouslyReleased'
  | 'originalReleaseDate'
  | 'releaseArtwork'
  | 'labelName'
  | 'albumGenre'
  | 'catalogNumber'
  | 'upc'
  | 'albumCLine'
  | 'albumPLine'
  | 'territoryMode'
  | 'territories'
  // Track fields
  | 'trackTitle'
  | 'trackMixVersion'
  | 'audioFile'
  | 'trackArtist'
  | 'trackFeaturedArtist'
  | 'trackRemixer'
  | 'performers'
  | 'composition'
  | 'production'
  | 'publisher'
  | 'trackGenre'
  | 'isrc'
  | 'secondaryIsrc'
  | 'dolbyAtmos'
  | 'language'
  | 'explicitContent'
  | 'lyrics';

export const tooltipContent: Record<TooltipFieldKey, string> = {
  // Release Information
  releaseTitle: 'The official title of your release as it should appear on streaming platforms. Do not include artist names or (feat.) credits here - just the release title (e.g., "Midnight Dreams", "Summer").',

  releaseMixVersion: 'Optional qualifier for special versions like "Deluxe Edition", "Remastered", or "John Smith Remix". Leave blank for standard releases.',

  releaseArtist: 'Primary artist(s) who created this release. This is the main artist name that appears on the release. For collaborations, list all primary artists. Do NOT list producers, remixers, or featured artists here.',

  featuredArtist: 'Artists who are featured on the release but not primary artists. They will appear as "feat. [Artist Name]" on platforms. Only use this for artists who perform on the release (vocals, instruments).',

  remixer: 'Artist(s) who created an official remix version of the entire release. If individual tracks have different remixers, add them at the track level instead. Leave blank for original releases.',

  releaseDate: 'The date you want this release to be available on streaming platforms and stores. Choose your planned release date carefully - early access dates may differ but this is the official public release date.',

  previouslyReleased: 'Check this box if you are re-releasing music that was previously available on streaming platforms, physical media, or other distribution channels. This helps platforms properly handle catalog and streaming history.',

  originalReleaseDate: 'The date this music was first made available to the public in any format (streaming, physical, digital download). Required for re-releases to maintain accurate catalog dating and historical data.',

  releaseArtwork: 'Upload your album/single cover art. Industry standard: 3000x3000 pixels, RGB color mode, JPG format. The artwork must be square, high-resolution, and meet platform requirements (no explicit content, URLs, or pricing info).',

  labelName: 'The record label releasing this music. If you are self-releasing, use your artist name or create a label name. This identifies who owns or controls the release and appears in platform credits.',

  albumGenre: 'The primary genre category for this release. Choose carefully as this affects playlist placements, recommendations, and discoverability. You can select from broad categories or drill down to specific subgenres.',

  catalogNumber: 'Your label\'s internal catalog/reference number for this release (e.g., "XLN001", "REL-2024-05"). Optional but highly recommended for organization, especially if you release multiple projects. Creates a professional tracking system.',

  upc: 'Universal Product Code (12-13 digit barcode) that uniquely identifies this release across all stores and platforms. Each release needs its own UPC. Your distributor may provide this, or you can purchase from GS1. Required for physical sales.',

  albumCLine: 'Copyright owner of the composition/lyrics/artwork. Format: © [Year] [Copyright Holder]. Example: "© 2025 John Smith Music". This protects the underlying musical work and creative content. The © symbol represents composition copyright.',

  albumPLine: 'Phonographic copyright owner of the sound recording. Format: ℗ [Year] [Copyright Holder]. Example: "℗ 2025 XYZ Records". This protects the actual recorded audio performance. The ℗ symbol (P in circle) represents sound recording copyright.',

  territoryMode: 'Choose "Include" to select specific countries where your release will be available, or "Exclude" to make it available worldwide except in selected countries. Most releases use worldwide distribution.',

  territories: 'Select specific countries for distribution. Use "Include" mode to only release in chosen territories (e.g., US-only release) or "Exclude" mode to release everywhere except chosen territories (e.g., worldwide except specific regions due to rights).',

  // Track Information
  trackTitle: 'The official title of this individual track. Do not include artist names, "feat." credits, or version info here - those have separate fields. Just the song title (e.g., "Starlight", "Lost in Time").',

  trackMixVersion: 'Optional version descriptor like "Radio Edit", "Extended Mix", "Acoustic Version", "Instrumental", "Live", or "Demo". Leave blank for the original/main version. Each unique mix requires a new ISRC code.',

  audioFile: 'Upload the final mastered audio file for this track. Required format: WAV or AIFF, minimum 16-bit/44.1kHz (CD quality) or higher. Ensure proper loudness levels and mastering. File name does not affect metadata.',

  trackArtist: 'Primary performing artist(s) on this track. Usually matches the release artist but can differ for compilation albums or multi-artist releases. Must be performing artists (singing, rapping, playing instruments) - not producers or writers.',

  trackFeaturedArtist: 'Performing artist(s) featured on this track who appear as "feat. [Artist]". Only use for artists who perform vocals or instruments. Do NOT list producers, songwriters, or non-performing collaborators here.',

  trackRemixer: 'Artist who created this remix version of the track. Only fill this out for official remixes. Original versions should leave this blank. The remixer credit appears after the title on platforms (e.g., "Song Title [Remixer Name Remix]").',

  performers: 'Musicians who performed on this recording (vocalists, instrumentalists, programmers). Assign specific roles like "Vocalist", "Guitarist", "Pianist". This ensures proper crediting and royalty distribution. Multiple performers per role are allowed.',

  composition: 'People who wrote the music and/or lyrics. Assign roles like "Composer" (music), "Lyricist" (words), or "Songwriter" (both). Writers receive composition royalties separately from performance royalties. Critical for proper payment.',

  production: 'Production and engineering team. Assign roles like "Producer", "Mixer", "Mastering Engineer". Producers shape the sound, mixers balance elements, mastering engineers finalize for distribution. These credits appear on platforms and affect royalties.',

  publisher: 'Music publishing company that administers the composition rights and collects songwriter royalties. If you self-publish or have no publisher, you can leave this blank. Publishers handle mechanical licenses and sync licensing.',

  trackGenre: 'Primary genre for this individual track. Can differ from the album genre for compilations or genre-blending releases. Affects playlist placement and recommendations at the track level. Choose the most specific applicable subgenre.',

  isrc: 'International Standard Recording Code - a unique 12-character code (e.g., "USRC17607839") that permanently identifies THIS specific recording. One ISRC per master recording. Never reuse. Required for royalty tracking. Your distributor may provide this.',

  secondaryIsrc: 'Optional second ISRC for cases where a track has been re-released or was previously distributed with a different code. Helps link catalog history. Leave blank for new releases. Prevents streaming count fragmentation across codes.',

  dolbyAtmos: 'Check this box if you have uploaded a Dolby Atmos spatial audio mix of this track. Dolby Atmos is an immersive audio format available on Apple Music and other platforms. Requires special mixing and separate file upload.',

  language: 'Primary language of the lyrics. Choose "Instrumental" if there are no vocals or lyrics. This affects content filtering, market recommendations, and language-specific playlists. Multiple languages in one track should use the dominant language.',

  explicitContent: 'Select "Yes" if the track contains explicit language, sexual content, or violence. "Cleaned" if explicit content has been removed/censored. "No" for clean content. This creates content filters and parental advisory labels on platforms.',

  lyrics: 'Full verbatim lyrics of the song. Optional but recommended. Enhances user experience on platforms with lyric display (Spotify, Apple Music). Must be accurate, properly formatted, and include all verses, hooks, and ad-libs. No timestamps needed.',
};
