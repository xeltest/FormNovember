// Hierarchical genre structure for music categorization
// Supports up to 3 levels: Genre > Subgenre > Sub-subgenre

export interface GenreNode {
  id: string;
  label: string;
  children?: GenreNode[];
  searchTerms?: string[]; // Additional terms for search/filtering
}

export const GENRES: GenreNode[] = [
  {
    id: 'rock',
    label: 'Rock',
    children: [
      { id: 'rock-alternative', label: 'Alternative Rock' },
      { id: 'rock-classic', label: 'Classic Rock' },
      { id: 'rock-hard', label: 'Hard Rock' },
      { id: 'rock-indie', label: 'Indie Rock' },
      { id: 'rock-progressive', label: 'Progressive Rock', searchTerms: ['prog rock'] },
      { id: 'rock-psychedelic', label: 'Psychedelic Rock', searchTerms: ['psych rock'] },
      { id: 'rock-punk', label: 'Punk Rock' },
      { id: 'rock-soft', label: 'Soft Rock' },
    ]
  },
  {
    id: 'electronic',
    label: 'Electronic',
    children: [
      {
        id: 'electronic-ambient',
        label: 'Ambient',
        children: [
          { id: 'electronic-ambient-dark', label: 'Dark Ambient' },
          { id: 'electronic-ambient-drone', label: 'Drone' },
        ]
      },
      { id: 'electronic-breakbeat', label: 'Breakbeat' },
      { id: 'electronic-downtempo', label: 'Downtempo' },
      { id: 'electronic-drum-bass', label: 'Drum & Bass', searchTerms: ['dnb', 'd&b'] },
      { id: 'electronic-dubstep', label: 'Dubstep' },
      { id: 'electronic-edm', label: 'EDM', searchTerms: ['electronic dance music'] },
      { id: 'electronic-garage', label: 'Garage', searchTerms: ['uk garage', 'ukg'] },
      {
        id: 'electronic-house',
        label: 'House',
        children: [
          { id: 'electronic-house-deep', label: 'Deep House' },
          { id: 'electronic-house-electro', label: 'Electro House' },
          { id: 'electronic-house-future', label: 'Future House' },
          { id: 'electronic-house-progressive', label: 'Progressive House', searchTerms: ['prog house'] },
          { id: 'electronic-house-tech', label: 'Tech House' },
          { id: 'electronic-house-tropical', label: 'Tropical House' },
        ]
      },
      { id: 'electronic-idm', label: 'IDM', searchTerms: ['intelligent dance music'] },
      { id: 'electronic-jungle', label: 'Jungle' },
      {
        id: 'electronic-techno',
        label: 'Techno',
        children: [
          { id: 'electronic-techno-acid', label: 'Acid Techno' },
          { id: 'electronic-techno-detroit', label: 'Detroit Techno' },
          { id: 'electronic-techno-hard', label: 'Hard Techno' },
          { id: 'electronic-techno-minimal', label: 'Minimal Techno' },
        ]
      },
      {
        id: 'electronic-trance',
        label: 'Trance',
        children: [
          { id: 'electronic-trance-progressive', label: 'Progressive Trance' },
          { id: 'electronic-trance-psytrance', label: 'Psytrance', searchTerms: ['psychedelic trance'] },
          { id: 'electronic-trance-uplifting', label: 'Uplifting Trance' },
        ]
      },
    ]
  },
  {
    id: 'pop',
    label: 'Pop',
    children: [
      { id: 'pop-contemporary', label: 'Contemporary Pop' },
      { id: 'pop-dance', label: 'Dance Pop' },
      { id: 'pop-electro', label: 'Electropop' },
      { id: 'pop-indie', label: 'Indie Pop' },
      { id: 'pop-kpop', label: 'K-Pop', searchTerms: ['korean pop'] },
      { id: 'pop-synth', label: 'Synthpop' },
      { id: 'pop-teen', label: 'Teen Pop' },
    ]
  },
  {
    id: 'hip-hop',
    label: 'Hip-Hop/Rap',
    children: [
      { id: 'hip-hop-alternative', label: 'Alternative Hip-Hop' },
      { id: 'hip-hop-conscious', label: 'Conscious Hip-Hop' },
      { id: 'hip-hop-drill', label: 'Drill' },
      { id: 'hip-hop-grime', label: 'Grime' },
      { id: 'hip-hop-trap', label: 'Trap' },
      { id: 'hip-hop-uk', label: 'UK Hip-Hop' },
      { id: 'hip-hop-underground', label: 'Underground Hip-Hop' },
    ]
  },
  {
    id: 'rb-soul',
    label: 'R&B/Soul',
    children: [
      { id: 'rb-contemporary', label: 'Contemporary R&B' },
      { id: 'rb-funk', label: 'Funk' },
      { id: 'rb-neo-soul', label: 'Neo-Soul' },
      { id: 'rb-soul-classic', label: 'Soul' },
    ]
  },
  {
    id: 'metal',
    label: 'Metal',
    children: [
      { id: 'metal-black', label: 'Black Metal' },
      { id: 'metal-death', label: 'Death Metal' },
      { id: 'metal-doom', label: 'Doom Metal' },
      { id: 'metal-heavy', label: 'Heavy Metal' },
      { id: 'metal-metalcore', label: 'Metalcore' },
      { id: 'metal-power', label: 'Power Metal' },
      { id: 'metal-progressive', label: 'Progressive Metal', searchTerms: ['prog metal'] },
      { id: 'metal-thrash', label: 'Thrash Metal' },
    ]
  },
  {
    id: 'dance',
    label: 'Dance',
    children: [
      { id: 'dance-club', label: 'Club Dance' },
      { id: 'dance-euro', label: 'Eurodance' },
      { id: 'dance-freestyle', label: 'Freestyle' },
      { id: 'dance-hardcore', label: 'Hardcore' },
      { id: 'dance-hardstyle', label: 'Hardstyle' },
    ]
  },
  {
    id: 'jazz',
    label: 'Jazz',
    children: [
      { id: 'jazz-bebop', label: 'Bebop' },
      { id: 'jazz-contemporary', label: 'Contemporary Jazz' },
      { id: 'jazz-fusion', label: 'Jazz Fusion' },
      { id: 'jazz-latin', label: 'Latin Jazz' },
      { id: 'jazz-smooth', label: 'Smooth Jazz' },
      { id: 'jazz-swing', label: 'Swing' },
    ]
  },
  {
    id: 'classical',
    label: 'Classical',
    children: [
      { id: 'classical-baroque', label: 'Baroque' },
      { id: 'classical-chamber', label: 'Chamber Music' },
      { id: 'classical-contemporary', label: 'Contemporary Classical' },
      { id: 'classical-opera', label: 'Opera' },
      { id: 'classical-romantic', label: 'Romantic' },
      { id: 'classical-symphony', label: 'Symphony' },
    ]
  },
  {
    id: 'country',
    label: 'Country',
    children: [
      { id: 'country-alternative', label: 'Alternative Country', searchTerms: ['alt-country'] },
      { id: 'country-bluegrass', label: 'Bluegrass' },
      { id: 'country-contemporary', label: 'Contemporary Country' },
      { id: 'country-outlaw', label: 'Outlaw Country' },
      { id: 'country-traditional', label: 'Traditional Country' },
    ]
  },
  {
    id: 'folk',
    label: 'Folk',
    children: [
      { id: 'folk-americana', label: 'Americana' },
      { id: 'folk-contemporary', label: 'Contemporary Folk' },
      { id: 'folk-indie', label: 'Indie Folk' },
      { id: 'folk-traditional', label: 'Traditional Folk' },
    ]
  },
  {
    id: 'blues',
    label: 'Blues',
    children: [
      { id: 'blues-chicago', label: 'Chicago Blues' },
      { id: 'blues-contemporary', label: 'Contemporary Blues' },
      { id: 'blues-delta', label: 'Delta Blues' },
      { id: 'blues-electric', label: 'Electric Blues' },
    ]
  },
  {
    id: 'reggae',
    label: 'Reggae',
    children: [
      { id: 'reggae-dancehall', label: 'Dancehall' },
      { id: 'reggae-dub', label: 'Dub' },
      { id: 'reggae-roots', label: 'Roots Reggae' },
      { id: 'reggae-ska', label: 'Ska' },
    ]
  },
  {
    id: 'latin',
    label: 'Latin',
    children: [
      { id: 'latin-bachata', label: 'Bachata' },
      { id: 'latin-flamenco', label: 'Flamenco' },
      { id: 'latin-reggaeton', label: 'Reggaeton' },
      { id: 'latin-salsa', label: 'Salsa' },
      { id: 'latin-tango', label: 'Tango' },
    ]
  },
  {
    id: 'world',
    label: 'World',
    children: [
      { id: 'world-african', label: 'African' },
      { id: 'world-asian', label: 'Asian' },
      { id: 'world-celtic', label: 'Celtic' },
      { id: 'world-middle-eastern', label: 'Middle Eastern' },
    ]
  },
  {
    id: 'alternative',
    label: 'Alternative',
    children: [
      { id: 'alternative-emo', label: 'Emo' },
      { id: 'alternative-grunge', label: 'Grunge' },
      { id: 'alternative-post-rock', label: 'Post-Rock' },
      { id: 'alternative-shoegaze', label: 'Shoegaze' },
    ]
  },
  {
    id: 'punk',
    label: 'Punk',
    children: [
      { id: 'punk-hardcore', label: 'Hardcore Punk' },
      { id: 'punk-pop', label: 'Pop Punk' },
      { id: 'punk-post', label: 'Post-Punk' },
      { id: 'punk-ska', label: 'Ska Punk' },
    ]
  },
];

// Utility function to flatten genre tree for search
export const flattenGenres = (genres: GenreNode[], parentPath: string[] = []): Array<{
  id: string;
  label: string;
  path: string[];
  fullPath: string;
  searchTerms: string[];
}> => {
  const flattened: Array<{
    id: string;
    label: string;
    path: string[];
    fullPath: string;
    searchTerms: string[];
  }> = [];

  genres.forEach(genre => {
    const currentPath = [...parentPath, genre.label];
    const fullPath = currentPath.join(' > ');

    flattened.push({
      id: genre.id,
      label: genre.label,
      path: currentPath,
      fullPath,
      searchTerms: [
        genre.label.toLowerCase(),
        ...(genre.searchTerms || []),
        fullPath.toLowerCase()
      ]
    });

    if (genre.children) {
      flattened.push(...flattenGenres(genre.children, currentPath));
    }
  });

  return flattened;
};

// Get all leaf nodes (selectable genres without children)
export const getSelectableGenres = (genres: GenreNode[] = GENRES): Array<{
  id: string;
  label: string;
  fullPath: string;
}> => {
  const selectable: Array<{
    id: string;
    label: string;
    fullPath: string;
  }> = [];

  const traverse = (nodes: GenreNode[], parentPath: string[] = []) => {
    nodes.forEach(node => {
      const currentPath = [...parentPath, node.label];

      if (!node.children || node.children.length === 0) {
        // Leaf node - selectable
        selectable.push({
          id: node.id,
          label: node.label,
          fullPath: currentPath.join(' > ')
        });
      } else {
        // Has children - traverse deeper
        traverse(node.children, currentPath);
      }
    });
  };

  traverse(genres);
  return selectable;
};

// Find a genre anywhere in the tree by its label (supports both leaf name and full path)
export const findGenreByLabel = (
  label: string,
  genres: GenreNode[] = GENRES
): {
  genre: GenreNode;
  path: string[];
  parentSelections: { level: number; id: string; label: string }[];
} | null => {
  // Handle both "Tech House" and "Electronic > House > Tech House" formats
  const searchLabel = label.includes(' > ') ? label.split(' > ').pop()?.trim() : label;

  if (!searchLabel) return null;

  const search = (
    nodes: GenreNode[],
    parentPath: string[] = [],
    parentIds: { level: number; id: string; label: string }[] = [],
    level: number = 1
  ): {
    genre: GenreNode;
    path: string[];
    parentSelections: { level: number; id: string; label: string }[];
  } | null => {
    for (const node of nodes) {
      const currentPath = [...parentPath, node.label];
      const currentParents = [...parentIds, { level, id: node.id, label: node.label }];

      // Check if this node matches (case-insensitive)
      if (node.label.toLowerCase() === searchLabel.toLowerCase()) {
        return {
          genre: node,
          path: currentPath,
          parentSelections: currentParents
        };
      }

      // Search children
      if (node.children) {
        const result = search(node.children, currentPath, currentParents, level + 1);
        if (result) return result;
      }
    }

    return null;
  };

  return search(genres);
};
