import JSZip from 'jszip';
import { ReleaseData, TrackData } from '@/pages/Index';

// Reverse mapping from ISO codes to country names
const ISOToCountry: { [key: string]: string } = {
  'US': 'United States',
  'CA': 'Canada',
  'MX': 'Mexico',
  'AI': 'Anguilla',
  'AG': 'Antigua And Barbuda',
  'AW': 'Aruba',
  'BS': 'Bahamas',
  'BB': 'Barbados',
  'BZ': 'Belize',
  'BM': 'Bermuda',
  'VG': 'British Virgin Islands',
  'KY': 'Cayman Islands',
  'CR': 'Costa Rica',
  'CU': 'Cuba',
  'DM': 'Dominica',
  'DO': 'Dominican Republic',
  'SV': 'El Salvador',
  'GL': 'Greenland',
  'GD': 'Grenada',
  'GP': 'Guadeloupe',
  'GU': 'Guam',
  'GT': 'Guatemala',
  'HT': 'Haiti',
  'HN': 'Honduras',
  'JM': 'Jamaica',
  'MQ': 'Martinique',
  'MS': 'Montserrat',
  'NI': 'Nicaragua',
  'PA': 'Panama',
  'PR': 'Puerto Rico',
  'KN': 'Saint Kitts And Nevis',
  'LC': 'Saint Lucia',
  'VC': 'Saint Vincent And The Grenadines',
  'PM': 'St. Pierre And Miquelon',
  'TT': 'Trinidad And Tobago',
  'TC': 'Turks And Caicos Islands',
  'VI': 'United States Virgin Islands',
  'AN': 'Netherlands Antilles',
  'BL': 'Saint-Barthélemy',
  'MF': 'Saint-Martin (French part)',
  'AX': 'Aland Islands',
  'AL': 'Albania',
  'AD': 'Andorra',
  'AT': 'Austria',
  'BY': 'Belarus',
  'BE': 'Belgium',
  'BA': 'Bosnia And Herzegowina',
  'BG': 'Bulgaria',
  'HR': 'Croatia',
  'CY': 'Cyprus',
  'CZ': 'Czech Republic',
  'DK': 'Denmark',
  'EE': 'Estonia',
  'FO': 'Faroe Islands',
  'FI': 'Finland',
  'FR': 'France',
  'DE': 'Germany',
  'GI': 'Gibraltar',
  'GR': 'Greece',
  'GG': 'Guernsey',
  'VA': 'Holy See (Vatican City State)',
  'HU': 'Hungary',
  'IS': 'Iceland',
  'IE': 'Ireland',
  'IM': 'Isle of Man',
  'IT': 'Italy',
  'JE': 'Jersey',
  'LV': 'Latvia',
  'LI': 'Liechtenstein',
  'LT': 'Lithuania',
  'LU': 'Luxembourg',
  'MT': 'Malta',
  'MD': 'Moldova',
  'MC': 'Monaco',
  'ME': 'Montenegro',
  'NL': 'Netherlands',
  'MK': 'North Macedonia',
  'NO': 'Norway',
  'PL': 'Poland',
  'PT': 'Portugal',
  'RO': 'Romania',
  'SM': 'San Marino',
  'RS': 'Serbia',
  'SK': 'Slovakia',
  'SI': 'Slovenia',
  'ES': 'Spain',
  'SJ': 'Svalbard And Jan Mayen Islands',
  'SE': 'Sweden',
  'CH': 'Switzerland',
  'UA': 'Ukraine',
  'GB': 'United Kingdom',
  'AF': 'Afghanistan',
  'AM': 'Armenia',
  'AZ': 'Azerbaijan',
  'BH': 'Bahrain',
  'BD': 'Bangladesh',
  'BT': 'Bhutan',
  'BN': 'Brunei Darussalam',
  'KH': 'Cambodia',
  'CN': 'China',
  'GE': 'Georgia',
  'HK': 'Hong Kong',
  'IN': 'India',
  'ID': 'Indonesia',
  'IR': 'Iran',
  'IQ': 'Iraq',
  'IL': 'Israel',
  'JP': 'Japan',
  'JO': 'Jordan',
  'KZ': 'Kazakhstan',
  'KR': 'Korea, Republic Of',
  'KP': 'Korea, D.P.R.O.',
  'KW': 'Kuwait',
  'KG': 'Kyrgyzstan',
  'LA': 'Laos',
  'LB': 'Lebanon',
  'MO': 'Macau',
  'MY': 'Malaysia',
  'MV': 'Maldives',
  'MN': 'Mongolia',
  'MM': 'Myanmar',
  'NP': 'Nepal',
  'OM': 'Oman',
  'PK': 'Pakistan',
  'PS': 'Palestinian Territory, Occupied',
  'PH': 'Philippines',
  'QA': 'Qatar',
  'SA': 'Saudi Arabia',
  'SG': 'Singapore',
  'LK': 'Sri Lanka',
  'SY': 'Syrian Arab Republic',
  'TW': 'Taiwan',
  'TJ': 'Tajikistan',
  'TH': 'Thailand',
  'TL': 'Timor-Leste',
  'TR': 'Turkey',
  'TM': 'Turkmenistan',
  'AE': 'United Arab Emirates',
  'UZ': 'Uzbekistan',
  'VN': 'Viet Nam',
  'YE': 'Yemen',
  'AR': 'Argentina',
  'BO': 'Bolivia',
  'BR': 'Brazil',
  'CL': 'Chile',
  'CO': 'Colombia',
  'EC': 'Ecuador',
  'GF': 'French Guiana',
  'GY': 'Guyana',
  'PY': 'Paraguay',
  'PE': 'Peru',
  'SR': 'Suriname',
  'UY': 'Uruguay',
  'VE': 'Venezuela',
  'FK': 'Falkland Islands',
  'DZ': 'Algeria',
  'AO': 'Angola',
  'BJ': 'Benin',
  'BW': 'Botswana',
  'BF': 'Burkina Faso',
  'BI': 'Burundi',
  'CM': 'Cameroon',
  'CV': 'Cape Verde',
  'CF': 'Central African Republic',
  'TD': 'Chad',
  'KM': 'Comoros',
  'CI': 'Cote D\'ivoire',
  'CG': 'Congo',
  'CD': 'Congo, The DRC',
  'DJ': 'Djibouti',
  'EG': 'Egypt',
  'GQ': 'Equatorial Guinea',
  'ER': 'Eritrea',
  'ET': 'Ethiopia',
  'GA': 'Gabon',
  'GM': 'Gambia',
  'GH': 'Ghana',
  'GN': 'Guinea',
  'GW': 'Guinea-Bissau',
  'KE': 'Kenya',
  'LS': 'Lesotho',
  'LR': 'Liberia',
  'LY': 'Libyan Arab Jamahiriya',
  'MG': 'Madagascar',
  'MW': 'Malawi',
  'ML': 'Mali',
  'MR': 'Mauritania',
  'MU': 'Mauritius',
  'YT': 'Mayotte',
  'MA': 'Morocco',
  'MZ': 'Mozambique',
  'NA': 'Namibia',
  'NE': 'Niger',
  'NG': 'Nigeria',
  'RE': 'Reunion',
  'RW': 'Rwanda',
  'ST': 'Sao Tome And Principe',
  'SN': 'Senegal',
  'SC': 'Seychelles',
  'SL': 'Sierra Leone',
  'SO': 'Somalia',
  'ZA': 'South Africa',
  'SS': 'South Sudan',
  'SH': 'St. Helena',
  'SD': 'Sudan',
  'SZ': 'Swaziland',
  'TZ': 'Tanzania',
  'TG': 'Togo',
  'TN': 'Tunisia',
  'UG': 'Uganda',
  'EH': 'Western Sahara',
  'ZM': 'Zambia',
  'ZW': 'Zimbabwe',
  'AS': 'American Samoa',
  'AU': 'Australia',
  'CC': 'Cocos (Keeling) Islands',
  'CK': 'Cook Islands',
  'FJ': 'Fiji',
  'PF': 'French Polynesia',
  'HM': 'Heard and McDonald Islands',
  'KI': 'Kiribati',
  'MH': 'Marshall Islands',
  'FM': 'Micronesia',
  'NR': 'Nauru',
  'NC': 'New Caledonia',
  'NZ': 'New Zealand',
  'NU': 'Niue',
  'NF': 'Norfolk Island',
  'MP': 'Northern Mariana Islands',
  'PW': 'Palau',
  'PG': 'Papua New Guinea',
  'PN': 'Pitcairn',
  'WS': 'Samoa',
  'SB': 'Solomon Islands'
};

/**
 * Parse CSV line respecting quoted values
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  // Add last field
  result.push(current);

  return result;
}

/**
 * Convert DD/MM/YYYY to YYYY-MM-DD
 */
function parseDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return dateStr;
}

/**
 * Map ISO codes to country names
 */
function mapISOToCountries(isoCodes: string): string[] {
  if (!isoCodes) return [];
  return isoCodes.split('/').map(code => ISOToCountry[code.trim()] || code.trim()).filter(Boolean);
}

/**
 * Parse pipe-separated values
 */
function parsePipeSeparated(value: string): string[] {
  if (!value) return [];
  return value.split('|').map(v => v.trim()).filter(Boolean);
}

/**
 * Parse contributor format: "Name|Role||Name2|Role2"
 */
function parseContributors(value: string): Array<{ name: string; roles: string[] }> {
  if (!value) return [];

  const contributors = new Map<string, string[]>();
  const entries = value.split('||');

  for (const entry of entries) {
    const parts = entry.split('|');
    if (parts.length === 2) {
      const [name, role] = parts.map(p => p.trim());
      if (name && role) {
        if (!contributors.has(name)) {
          contributors.set(name, []);
        }
        contributors.get(name)!.push(role);
      }
    }
  }

  return Array.from(contributors.entries()).map(([name, roles]) => ({ name, roles }));
}

/**
 * Reconstruct performers from CSV columns
 */
function reconstructPerformers(row: any): Array<{ name: string; roles: string[] }> {
  const performers = new Map<string, string[]>();

  // Add vocalists
  const vocalists = parsePipeSeparated(row.Vocalist || '');
  vocalists.forEach(name => {
    if (!performers.has(name)) performers.set(name, []);
    performers.get(name)!.push('Vocalist');
  });

  // Add programming
  const programming = parsePipeSeparated(row.Programming || '');
  programming.forEach(name => {
    if (!performers.has(name)) performers.set(name, []);
    performers.get(name)!.push('Programming');
  });

  // Add guitar
  const guitarists = parsePipeSeparated(row.Guitar || '');
  guitarists.forEach(name => {
    if (!performers.has(name)) performers.set(name, []);
    performers.get(name)!.push('Guitar');
  });

  // Add performer other
  const performerOther = parseContributors(row['Performer Other'] || '');
  performerOther.forEach(({ name, roles }) => {
    if (!performers.has(name)) performers.set(name, []);
    performers.get(name)!.push(...roles);
  });

  const result = Array.from(performers.entries()).map(([name, roles]) => ({ name, roles }));
  return result.length > 0 ? result : [{ name: '', roles: [] }];
}

/**
 * Reconstruct composition from CSV columns
 */
function reconstructComposition(row: any): Array<{ name: string; roles: string[] }> {
  const composers = new Map<string, string[]>();

  // Add composers
  const composerNames = parsePipeSeparated(row.Composer || '');
  composerNames.forEach(name => {
    if (!composers.has(name)) composers.set(name, []);
    composers.get(name)!.push('Composer');
  });

  // Add lyricists
  const lyricists = parsePipeSeparated(row.Lyricist || '');
  lyricists.forEach(name => {
    if (!composers.has(name)) composers.set(name, []);
    composers.get(name)!.push('Lyricist');
  });

  // Add songwriters
  const songwriters = parsePipeSeparated(row.Songwriter || '');
  songwriters.forEach(name => {
    if (!composers.has(name)) composers.set(name, []);
    composers.get(name)!.push('Songwriter');
  });

  // Add songwriter other
  const songwriterOther = parseContributors(row['Songwriter Other'] || '');
  songwriterOther.forEach(({ name, roles }) => {
    if (!composers.has(name)) composers.set(name, []);
    composers.get(name)!.push(...roles);
  });

  const result = Array.from(composers.entries()).map(([name, roles]) => ({ name, roles }));
  return result.length > 0 ? result : [{ name: '', roles: [] }];
}

/**
 * Reconstruct production from CSV columns
 */
function reconstructProduction(row: any): Array<{ name: string; roles: string[] }> {
  const producers = new Map<string, string[]>();

  // Add producers
  const producerNames = parsePipeSeparated(row.Producer || '');
  producerNames.forEach(name => {
    if (!producers.has(name)) producers.set(name, []);
    producers.get(name)!.push('Producer');
  });

  // Add mix engineers
  const mixEngineers = parsePipeSeparated(row['Mix Engineer'] || '');
  mixEngineers.forEach(name => {
    if (!producers.has(name)) producers.set(name, []);
    producers.get(name)!.push('Mixer');
  });

  // Add mastering engineers
  const masteringEngineers = parsePipeSeparated(row['Mastering Engineer'] || '');
  masteringEngineers.forEach(name => {
    if (!producers.has(name)) producers.set(name, []);
    producers.get(name)!.push('Mastering Engineer');
  });

  // Add PE other
  const peOther = parseContributors(row['PE Other'] || '');
  peOther.forEach(({ name, roles }) => {
    if (!producers.has(name)) producers.set(name, []);
    producers.get(name)!.push(...roles);
  });

  const result = Array.from(producers.entries()).map(([name, roles]) => ({ name, roles }));
  return result.length > 0 ? result : [{ name: '', roles: [] }];
}

/**
 * Extract remixers from Album Other Artist field
 */
function extractRemixers(albumOtherArtist: string): string[] {
  if (!albumOtherArtist) return [];

  const remixers: string[] = [];
  const entries = albumOtherArtist.split('||');

  for (const entry of entries) {
    const parts = entry.split('|');
    if (parts.length === 2) {
      const [name, role] = parts.map(p => p.trim());
      if (role === 'Remixer') {
        remixers.push(name);
      }
    }
  }

  return remixers;
}

/**
 * Parse entire CSV content respecting quoted values that may span multiple lines
 */
function parseCSVContent(csvContent: string): string[][] {
  const records: string[][] = [];
  let currentRecord: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvContent.length; i++) {
    const char = csvContent[i];
    const nextChar = csvContent[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote - add single quote to field
        currentField += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      currentRecord.push(currentField);
      currentField = '';
    } else if (char === '\n' && !inQuotes) {
      // End of record
      currentRecord.push(currentField);
      if (currentRecord.length > 0 && currentRecord.some(f => f.trim() !== '')) {
        records.push(currentRecord);
      }
      currentRecord = [];
      currentField = '';
    } else if (char === '\r' && nextChar === '\n' && !inQuotes) {
      // Windows line ending - skip \r, let \n be handled
      continue;
    } else if (char === '\r' && !inQuotes) {
      // Mac line ending
      currentRecord.push(currentField);
      if (currentRecord.length > 0 && currentRecord.some(f => f.trim() !== '')) {
        records.push(currentRecord);
      }
      currentRecord = [];
      currentField = '';
    } else {
      // Regular character (including newlines within quotes)
      currentField += char;
    }
  }

  // Add last field and record if exists
  if (currentField || currentRecord.length > 0) {
    currentRecord.push(currentField);
    if (currentRecord.length > 0 && currentRecord.some(f => f.trim() !== '')) {
      records.push(currentRecord);
    }
  }

  return records;
}

/**
 * Parse CSV metadata
 */
function parseMetadataCSV(csvContent: string): { release: Partial<ReleaseData>, tracks: Partial<TrackData>[] } {
  // Parse CSV properly handling multi-line quoted fields
  const records = parseCSVContent(csvContent);

  if (records.length < 2) {
    throw new Error('Invalid CSV: No data rows found');
  }

  // First record is headers
  const headers = records[0];

  // Parse data rows (skip header)
  const dataRows: any[] = [];
  for (let i = 1; i < records.length; i++) {
    const values = records[i];
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    dataRows.push(row);
  }

  if (dataRows.length === 0) {
    throw new Error('Invalid CSV: No data rows found');
  }

  // First row contains release data
  const firstRow = dataRows[0];

  // Parse territories
  const includedTerritories = mapISOToCountries(firstRow.Territory || '');
  const excludedTerritories = mapISOToCountries(firstRow['Excluded Territory'] || '');
  const isWorldwide = includedTerritories.length === 0 && excludedTerritories.length === 0;
  const territoryMode: 'include' | 'exclude' = includedTerritories.length > 0 ? 'include' : 'exclude';
  const territories = territoryMode === 'include' ? includedTerritories : excludedTerritories;

  // Parse release data
  const release: Partial<ReleaseData> = {
    title: firstRow['Album Title'] || '',
    mixVersion: firstRow['Album Mix Version'] || undefined,
    artists: parsePipeSeparated(firstRow['Album Artist'] || ''),
    featuredArtists: parsePipeSeparated(firstRow['Album Featured Artist'] || ''),
    remixers: extractRemixers(firstRow['Album Other Artist'] || ''),
    releaseDate: parseDate(firstRow['Release Date'] || ''),
    originalReleaseDate: parseDate(firstRow['Original  Release Date'] || '') || undefined,
    isReRelease: !!firstRow['Original  Release Date'],
    labelName: firstRow['Label Name'] || '',
    albumGenre: firstRow['Album Genre'] || '',
    catalogNumber: firstRow['Cat Number'] || undefined,
    upc: firstRow['UPC (barcode)'] || undefined,
    albumCLine: firstRow['ALBUM C LINE'] || '',
    albumPLine: firstRow['ALBUM P LINE'] || '',
    isWorldwide,
    territoryMode,
    territories
  };

  // Ensure artists array has at least one empty string
  if (release.artists!.length === 0) {
    release.artists = [''];
  }

  // Parse track data
  const tracks: Partial<TrackData>[] = dataRows.map(row => {
    // Parse explicit content
    let explicitContent: 'no' | 'yes' | 'cleaned' = 'no';
    const explicitValue = row['Explict Content'] || 'N';
    if (explicitValue === 'Y') explicitContent = 'yes';
    else if (explicitValue === 'Cleaned') explicitContent = 'cleaned';

    const track: Partial<TrackData> = {
      title: row['Track Title'] || '',
      mixVersion: row['Mix Version'] || undefined,
      artists: parsePipeSeparated(row['Track Artist'] || ''),
      featuredArtists: parsePipeSeparated(row['Track featured Artist'] || ''),
      remixers: parsePipeSeparated(row.Remixer || ''),
      performers: reconstructPerformers(row),
      composition: reconstructComposition(row),
      production: reconstructProduction(row),
      publishers: parsePipeSeparated(row.Publisher || ''),
      trackGenre: row['Sub-Genre'] || row.Genre || '',
      isrcCode: row['ISRC code'] || undefined,
      secondaryIsrc: row['Secondary ISRC code'] || undefined,
      dolbyAtmos: false,
      language: row.Language || 'English',
      explicitContent,
      lyrics: row.Lyrics || undefined
    };

    // Ensure artists array has at least one empty string
    if (track.artists!.length === 0) {
      track.artists = [''];
    }

    return track;
  });

  return { release, tracks };
}

/**
 * Create File object from ZIP binary data
 */
async function createFileFromZip(zip: JSZip, filename: string, targetFilename?: string): Promise<File | null> {
  const file = zip.file(filename);
  if (!file) return null;

  const blob = await file.async('blob');
  return new File([blob], targetFilename || filename, { type: blob.type });
}

/**
 * Find artwork file in ZIP
 */
function findArtworkFile(zip: JSZip): string | null {
  const artworkPattern = /^artwork\.(jpg|jpeg|png|gif|webp)$/i;
  const files = Object.keys(zip.files);
  return files.find(f => artworkPattern.test(f)) || null;
}

/**
 * Find audio files in ZIP (pattern: 01_Track_Name.wav)
 */
function findAudioFiles(zip: JSZip): string[] {
  const audioPattern = /^\d+_.*\.(wav|mp3|flac|aiff|m4a)$/i;
  const files = Object.keys(zip.files);
  return files.filter(f => audioPattern.test(f)).sort();
}

/**
 * Main import function
 */
export async function importFromZip(
  zipFile: File,
  onProgress?: (progress: number, message: string) => void
): Promise<{ release: ReleaseData; tracks: TrackData[] }> {
  try {
    // Extract ZIP
    onProgress?.(10, 'Extracting ZIP file...');
    const zip = await JSZip.loadAsync(zipFile);

    // Find metadata file
    onProgress?.(20, 'Reading metadata...');
    const metadataFile = zip.file('metadata.csv');
    if (!metadataFile) {
      throw new Error('metadata.csv not found in ZIP file');
    }

    // Parse metadata
    const csvContent = await metadataFile.async('text');
    const { release, tracks } = parseMetadataCSV(csvContent);

    // Load artwork
    onProgress?.(40, 'Loading artwork...');
    const artworkFilename = findArtworkFile(zip);
    if (artworkFilename) {
      const artworkFile = await createFileFromZip(zip, artworkFilename);
      if (artworkFile) {
        release.artwork = artworkFile;
      }
    }

    // Load audio files
    onProgress?.(60, 'Loading audio files...');
    const audioFiles = findAudioFiles(zip);

    for (let i = 0; i < Math.min(audioFiles.length, tracks.length); i++) {
      const progress = 60 + (30 * (i + 1) / audioFiles.length);
      onProgress?.(progress, `Loading track ${i + 1}/${audioFiles.length}...`);

      const audioFile = await createFileFromZip(zip, audioFiles[i]);
      if (audioFile && tracks[i]) {
        tracks[i].audioFile = audioFile;
      }
    }

    onProgress?.(100, 'Import complete!');

    // Return as full objects (TypeScript will ensure required fields exist or use defaults)
    return {
      release: release as ReleaseData,
      tracks: tracks as TrackData[]
    };

  } catch (error) {
    console.error('Import error:', error);
    throw new Error(`Failed to import ZIP: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate imported data
 */
export function validateImportedData(release: Partial<ReleaseData>, tracks: Partial<TrackData>[]): string[] {
  const errors: string[] = [];

  // Release validation
  if (!release.title) errors.push('Release title is missing');
  if (!release.artists || release.artists.length === 0 || !release.artists[0]) {
    errors.push('At least one release artist is required');
  }
  if (!release.labelName) errors.push('Label name is missing');
  if (!release.albumGenre) errors.push('Album genre is missing');

  // Track validation
  if (tracks.length === 0) {
    errors.push('No tracks found in import');
  }

  tracks.forEach((track, index) => {
    if (!track.title) errors.push(`Track ${index + 1}: Title is missing`);
    if (!track.artists || track.artists.length === 0 || !track.artists[0]) {
      errors.push(`Track ${index + 1}: At least one artist is required`);
    }
    if (!track.trackGenre) errors.push(`Track ${index + 1}: Genre is missing`);
  });

  return errors;
}
