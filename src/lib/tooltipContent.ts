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
  releaseTitle: 'This field is Release Title and should be filled in properly',
  releaseMixVersion: 'This field is Release Mix/Version and should be filled in properly',
  releaseArtist: 'This field is Release Artist and should be filled in properly',
  featuredArtist: 'This field is Featured Artist and should be filled in properly',
  remixer: 'This field is Remixer and should be filled in properly',
  releaseDate: 'This field is Release Date and should be filled in properly',
  previouslyReleased: 'This field is Previously Released and should be filled in properly',
  originalReleaseDate: 'This field is Original Release Date and should be filled in properly',
  releaseArtwork: 'This field is Release Artwork and should be filled in properly',
  labelName: 'This field is Label Name and should be filled in properly',
  albumGenre: 'This field is Album Genre and should be filled in properly',
  catalogNumber: 'This field is Catalog Number and should be filled in properly',
  upc: 'This field is UPC (Universal Product Code) and should be filled in properly',
  albumCLine: 'This field is Album C-line (Copyright line) and should be filled in properly',
  albumPLine: 'This field is Album P-line (Phonographic copyright) and should be filled in properly',
  territoryMode: 'This field is Territory Mode and should be filled in properly',
  territories: 'This field is Territories and should be filled in properly',

  // Track Information
  trackTitle: 'This field is Track Title and should be filled in properly',
  trackMixVersion: 'This field is Track Mix/Version and should be filled in properly',
  audioFile: 'This field is Audio File and should be filled in properly',
  trackArtist: 'This field is Track Artist and should be filled in properly',
  trackFeaturedArtist: 'This field is Track Featured Artist and should be filled in properly',
  trackRemixer: 'This field is Track Remixer and should be filled in properly',
  performers: 'This field is Performers and should be filled in properly',
  composition: 'This field is Composition and should be filled in properly',
  production: 'This field is Production and should be filled in properly',
  publisher: 'This field is Publisher and should be filled in properly',
  trackGenre: 'This field is Track Genre and should be filled in properly',
  isrc: 'This field is ISRC (International Standard Recording Code) and should be filled in properly',
  secondaryIsrc: 'This field is Secondary ISRC and should be filled in properly',
  dolbyAtmos: 'This field is Dolby Atmos and should be filled in properly',
  language: 'This field is Language and should be filled in properly',
  explicitContent: 'This field is Explicit Content and should be filled in properly',
  lyrics: 'This field is Lyrics and should be filled in properly',
};
