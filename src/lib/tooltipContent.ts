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
  | 'releaseWorldwide'
  | 'includedTerritories'
  | 'excludedTerritories'
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
releaseTitle: 'The official title of the release, excluding version or mix information',

releaseMixVersion: 'Use for specific versions, ie. "Deluxe", "2026 Remaster", or " Joan Smith Remix" etc. Leave blank for standard releases.',

releaseArtist: 'Primary artist(s) for the release. List all primary artists individually.',

featuredArtist: 'Featured artists (e.g., "feat. [Artist]"). Only for performers - not producers or songwriters.',

remixer: 'Artist(s) who remixed the entire release. Leave blank for original versions or multi remix EPs',

releaseDate: 'Set the official release date for streaming and stores that you would like this to go live. Must be a future date.',

previouslyReleased: 'Has this exact release been released before either on digital stores or physically?.',

originalReleaseDate: 'The first release date in any format (streaming, physical, digital). Required for re-releases.',

releaseArtwork: 'Upload your cover art (3000x3000px, RGB, JPG). No URLs, parental warnings, or pricing info.',

labelName: 'The record label releasing the music.',

albumGenre: 'Select the genre and/or sub-genre which applies best to the entire release',

catalogNumber: 'Your label’s reference number (e.g., "XLN001"). Optional, but recommended for organization.',

upc: 'A unique 12-13 digit barcode for your release. If your release does not have one, please leave blank and we can assign one for you.',

albumCLine: 'Copyright holder of composition/lyrics/artwork. Format:[Year] [Copyright Holder] (e.g., "2025 John Smith Music").',

albumPLine: 'Copyright holder of sound recording. Format:[Year] [Copyright Holder] (e.g., "2025 XYZ Records").',

territoryMode: 'PLACEHOLDER',

territories: 'PLACEHOLDER',

releaseWorldwide: 'Check this box to make your release available in all territories worldwide. Uncheck to specify which territories should or should not receive your release using the panels below.',

includedTerritories: 'Territories in this panel will receive your release. Select or deselect territories to move them between the included and excluded panels.',

excludedTerritories: 'Territories in this panel will NOT receive your release. Select or deselect territories to move them between the included and excluded panels.',

// Track Information
trackTitle: 'The official title of the track, excluding version or mix information.',

trackMixVersion: 'Use for specific versions, ie. "Extended Mix", "2026 Remaster", or "Joan Smith Remix" etc. Leave blank for standard releases.',

audioFile: 'Upload the final mastered audio file (WAV/AIFF, 16-bit/44.1kHz or higher).',

trackArtist: 'Primary performing artist(s) on the track. Usually matches the release artist, but may differ for compilations.',

trackFeaturedArtist: 'Featured artist(s) on the track (e.g., "feat. [Artist]"). Only for performers, not producers or songwriters.',

trackRemixer: 'Artist who remixed the track. Leave blank for original versions. If Mix/Version is "Joan Smith Remix", put "Joan Smith".',

performers: 'Musicians who performed on the recording (e.g., "Vocalist", "Guitarist", "Pianist"). Type their name and assign their role(s). (For DJ/Producers, select "Programming")',

composition: 'FIRST and LAST NAME of those who wrote the lyrics and music. (e.g., "Composer", "Lyricist", or "Songwriter"). Type their name and assign their role(s).',

production: 'Production/engineering team (e.g., "Producer", "Mixer", "Mastering Engineer"). Type their name and assign their role(s)',

publisher: 'Music publisher for composition rights.',

trackGenre: 'Select the genre and/or sub-genre which applies best to the entire release',

isrc: 'A unique 12-character ISRC code identifying this track (e.g., "USRC17607839"). If your track does not have one yet, we can assign one for you.',

secondaryIsrc: 'Used only for the Dolby Atmos files.',

dolbyAtmos: 'Check if you uploaded a Dolby Atmos mix. Requires special mixing and separate file upload.',

language: 'Primary language of the lyrics. Choose "Instrumental" if no vocals. Multiple languages? Use the dominant one.',

explicitContent: 'Select "Yes" if the track contains explicit language or content. "Cleaned" if censored. "No" for clean content.',

lyrics: 'Upload the full lyrics in text form. Use line breaks between sections. Do NOT use headers such as "Verse" "Chorus" etc.'
};