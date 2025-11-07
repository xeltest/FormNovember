import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle, AlertCircle, Music, Users, Globe, Upload, Download, FileArchive } from 'lucide-react';
import { ReleaseData, TrackData } from '@/pages/Index';
import JSZip from 'jszip';

interface ExportStepProps {
  releaseData: ReleaseData;
  tracks: TrackData[];
}

const ExportStep = ({ releaseData, tracks }: ExportStepProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateData = () => {
    const issues = [];
    
    // Release validation
    if (!releaseData.title) issues.push('Release title is required');
    if (!releaseData.artists[0]) issues.push('At least one release artist is required');
    if (!releaseData.releaseDate) issues.push('Release date is required');
    if (!releaseData.labelName) issues.push('Label name is required');
    if (!releaseData.albumGenre) issues.push('Album genre is required');
    if (!releaseData.albumCLine) issues.push('Album C Line is required');
    if (!releaseData.albumPLine) issues.push('Album P Line is required');
    
    // Track validation
    tracks.forEach((track, index) => {
      if (!track.title) issues.push(`Track ${index + 1}: Title is required`);
      if (!track.artists[0]) issues.push(`Track ${index + 1}: At least one artist is required`);
      if (!track.trackGenre) issues.push(`Track ${index + 1}: Genre is required`);
      
      const hasPerformer = track.performers.some(p => p.name && p.roles.length > 0);
      const hasComposer = track.composition.some(c => c.name && c.roles.length > 0);
      const hasProducer = track.production.some(p => p.name && p.roles.length > 0);
      
      if (!hasPerformer) issues.push(`Track ${index + 1}: At least one performer with role is required`);
      if (!hasComposer) issues.push(`Track ${index + 1}: At least one composer/writer with role is required`);
      if (!hasProducer) issues.push(`Track ${index + 1}: At least one producer/engineer with role is required`);
    });
    
    return issues;
  };

  const handleExport = async () => {
    const validationIssues = validateData();
    if (validationIssues.length > 0) {
      alert('Please fix the following issues before exporting:\n\n' + validationIssues.join('\n'));
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    // Simulate export process
    const intervals = [10, 25, 50, 75, 90, 100];
    for (let i = 0; i < intervals.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setExportProgress(intervals[i]);
    }

    setIsExporting(false);
    setExportComplete(true);
    
    // Here you would normally handle the actual export
    console.log('Export data:', { releaseData, tracks });
  };

  const countContributors = (track: TrackData) => {
    return track.performers.length + track.composition.length + track.production.length;
  };

  const countFiles = () => {
    let fileCount = 0;
    if (releaseData.artwork) fileCount++;
    tracks.forEach(track => {
      if (track.audioFile) fileCount++;
    });
    return fileCount;
  };

  // Convert country names to ISO 2-letter codes
  const countryToISO: { [key: string]: string } = {
    'United States': 'US', 'Canada': 'CA', 'Mexico': 'MX',
    'United Kingdom': 'GB', 'Germany': 'DE', 'France': 'FR', 'Italy': 'IT', 
    'Spain': 'ES', 'Netherlands': 'NL', 'Sweden': 'SE', 'Norway': 'NO',
    'Japan': 'JP', 'China': 'CN', 'South Korea': 'KR', 'India': 'IN', 
    'Thailand': 'TH', 'Singapore': 'SG',
    'Brazil': 'BR', 'Argentina': 'AR', 'Chile': 'CL', 'Colombia': 'CO',
    'South Africa': 'ZA', 'Nigeria': 'NG', 'Kenya': 'KE', 'Egypt': 'EG',
    'Australia': 'AU', 'New Zealand': 'NZ'
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getTerritories = () => {
    if (releaseData.isWorldwide) return { included: '', excluded: '' };
    
    const isoCodes = releaseData.territories
      .map(country => countryToISO[country] || country)
      .join('/');
    
    if (releaseData.territoryMode === 'include') {
      return { included: isoCodes, excluded: '' };
    } else {
      return { included: '', excluded: isoCodes };
    }
  };

  const generateCSV = () => {
    const rows: string[][] = [];
    
    // Header row - exact match to the guide
    rows.push([
      'Disc Number',
      'Track Number',
      'Title Type',
      'Cat Number',
      'Label Name',
      'UPC (barcode)',
      'Release Date',
      'Original  Release Date',
      'Album Artist',
      'Album Featured Artist',
      'Album Other Artist',
      'Album Title',
      'Album Mix Version',
      'Track Artist',
      'Track featured Artist',
      'Vocalist',
      'Programming',
      'Guitar',
      'Performer Other',
      'Composer',
      'Lyricist',
      'Songwriter',
      'Songwriter Other',
      'Producer',
      'Mix Engineer',
      'Mastering Engineer',
      'PE Other',
      'Track Title',
      'Mix Version',
      'Remixer',
      'ISRC code',
      'Secondary ISRC code',
      'Language',
      'Duration',
      'Sub-Genre',
      'Publisher',
      'Sample Start Time',
      'Filename',
      'Explict Content',
      'Must Remain Bundled/\nNot for Individual Sale',
      'ALBUM C LINE',
      'ALBUM P LINE',
      'Territory',
      'Excluded Territory',
      'Album Genre',
      'Public Domain',
      'Genre',
      'Make Featured Artist Primary on Spotify',
      'Make Remixer Primary on Spotify',
      'Lyrics',
      'Track Credits'
    ]);

    const territories = getTerritories();

    // Album Other Artist - format remixers as Artist|Remixer||Artist2|Remixer
    const albumOtherArtist = releaseData.remixers
      .filter(r => r)
      .map(r => `${r}|Remixer`)
      .join('||');

    // Track rows - one row per track with release info repeated
    tracks.forEach((track, index) => {
      // Extract specific performer roles
      const vocalists = track.performers
        .filter(p => p.name && p.roles.includes('Vocalist'))
        .map(p => p.name)
        .join('|');
      
      const programming = track.performers
        .filter(p => p.name && p.roles.includes('Programming'))
        .map(p => p.name)
        .join('|');
      
      const guitarists = track.performers
        .filter(p => p.name && p.roles.includes('Guitar'))
        .map(p => p.name)
        .join('|');
      
      // Performer Other - all other roles (exclude Vocalist, Programming, Guitar)
      const performerOther = track.performers
        .filter(p => p.name)
        .flatMap(p => {
          const otherRoles = p.roles.filter(role => 
            role !== 'Vocalist' && role !== 'Programming' && role !== 'Guitar'
          );
          return otherRoles.map(role => `${p.name}|${role}`);
        })
        .join('||');

      // Extract specific composition roles
      const composers = track.composition
        .filter(c => c.name && c.roles.includes('Composer'))
        .map(c => c.name)
        .join('|');
      
      const lyricists = track.composition
        .filter(c => c.name && c.roles.includes('Lyricist'))
        .map(c => c.name)
        .join('|');
      
      const songwriters = track.composition
        .filter(c => c.name && c.roles.includes('Songwriter'))
        .map(c => c.name)
        .join('|');
      
      // Songwriter Other - all other roles (exclude Composer, Lyricist, Songwriter)
      const songwriterOther = track.composition
        .filter(c => c.name)
        .flatMap(c => {
          const otherRoles = c.roles.filter(role => 
            role !== 'Composer' && role !== 'Lyricist' && role !== 'Songwriter'
          );
          return otherRoles.map(role => `${c.name}|${role}`);
        })
        .join('||');

      // Extract specific production roles
      const producers = track.production
        .filter(p => p.name && p.roles.includes('Producer'))
        .map(p => p.name)
        .join('|');
      
      const mixEngineers = track.production
        .filter(p => p.name && p.roles.includes('Mixer'))
        .map(p => p.name)
        .join('|');
      
      const masteringEngineers = track.production
        .filter(p => p.name && p.roles.includes('Mastering Engineer'))
        .map(p => p.name)
        .join('|');
      
      // PE Other - all other roles (exclude Producer, Mixer, Mastering Engineer)
      const peOther = track.production
        .filter(p => p.name)
        .flatMap(p => {
          const otherRoles = p.roles.filter(role => 
            role !== 'Producer' && role !== 'Mixer' && role !== 'Mastering Engineer'
          );
          return otherRoles.map(role => `${p.name}|${role}`);
        })
        .join('||');

      // Format explicit content
      let explicitContent = 'N';
      if (track.explicitContent === 'yes') explicitContent = 'Y';
      else if (track.explicitContent === 'cleaned') explicitContent = 'Cleaned';

      rows.push([
        '1', // Disc Number
        String(index + 1), // Track Number
        'SINGLE', // Title Type
        releaseData.catalogNumber || '', // Cat Number
        releaseData.labelName, // Label Name
        releaseData.upc || '', // UPC (barcode)
        formatDate(releaseData.releaseDate || ''), // Release Date
        formatDate(releaseData.originalReleaseDate || ''), // Original Release Date
        releaseData.artists.filter(a => a).join('|'), // Album Artist
        releaseData.featuredArtists.join('|'), // Album Featured Artist
        albumOtherArtist, // Album Other Artist
        releaseData.title, // Album Title
        releaseData.mixVersion || '', // Album Mix Version
        track.artists.filter(a => a).join('|'), // Track Artist
        track.featuredArtists.join('|'), // Track featured Artist
        vocalists, // Vocalist
        programming, // Programming
        guitarists, // Guitar
        performerOther, // Performer Other
        composers, // Composer
        lyricists, // Lyricist
        songwriters, // Songwriter
        songwriterOther, // Songwriter Other
        producers, // Producer
        mixEngineers, // Mix Engineer
        masteringEngineers, // Mastering Engineer
        peOther, // PE Other
        track.title, // Track Title
        track.mixVersion || '', // Mix Version
        track.remixers.join('|'), // Remixer
        track.isrcCode || '', // ISRC code
        track.secondaryIsrc || '', // Secondary ISRC code
        track.language, // Language
        '', // Duration - leave blank
        track.trackGenre, // Sub-Genre
        track.publishers.join('|'), // Publisher
        '', // Sample Start Time - leave blank
        track.audioFile?.name || '', // Filename
        explicitContent, // Explicit Content
        'N', // Must Remain Bundled
        releaseData.albumCLine, // ALBUM C LINE
        releaseData.albumPLine, // ALBUM P LINE
        territories.included, // Territory
        territories.excluded, // Excluded Territory
        releaseData.albumGenre, // Album Genre
        '', // Public Domain - leave blank
        track.trackGenre, // Genre
        'N', // Make Featured Artist Primary on Spotify
        'N', // Make Remixer Primary on Spotify
        track.lyrics || '', // Lyrics
        '' // Track Credits - leave blank
      ]);
    });

    // Convert to CSV string
    return rows.map(row => 
      row.map(cell => {
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        const escaped = String(cell).replace(/"/g, '""');
        return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
      }).join(',')
    ).join('\n');
  };

  const handleDownloadZip = async () => {
    const validationIssues = validateData();
    if (validationIssues.length > 0) {
      alert('Please fix the following issues before downloading:\n\n' + validationIssues.join('\n'));
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      const zip = new JSZip();

      // Add metadata CSV
      setExportProgress(10);
      const csvContent = generateCSV();
      zip.file('metadata.csv', csvContent);

      // Generate and add Excel file
      setExportProgress(20);
      try {
        // Dynamically import ExcelJS
        const ExcelJS = (await import('exceljs')).default;

        // Fetch the template file
        const templateResponse = await fetch('/Xelon_Metadata_Submission_Sheet.xlsx');
        const templateBuffer = await templateResponse.arrayBuffer();

        // Load the template
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(templateBuffer);

        // Get the Data sheet
        const worksheet = workbook.getWorksheet('Data');
        if (!worksheet) {
          throw new Error('Data sheet not found in template');
        }

        const territories = getTerritories();
        const albumOtherArtist = releaseData.remixers
          .filter(r => r)
          .map(r => `${r}|Remixer`)
          .join('||');

        // Populate data starting from row 4
        tracks.forEach((track, index) => {
          const rowNumber = 4 + index;
          const row = worksheet.getRow(rowNumber);

          // Extract performer roles
          const vocalists = track.performers
            .filter(p => p.name && p.roles.includes('Vocalist'))
            .map(p => p.name)
            .join('|');
          
          const programming = track.performers
            .filter(p => p.name && p.roles.includes('Programming'))
            .map(p => p.name)
            .join('|');
          
          const guitarists = track.performers
            .filter(p => p.name && p.roles.includes('Guitar'))
            .map(p => p.name)
            .join('|');
          
          const performerOther = track.performers
            .filter(p => p.name)
            .flatMap(p => {
              const otherRoles = p.roles.filter(role => 
                role !== 'Vocalist' && role !== 'Programming' && role !== 'Guitar'
              );
              return otherRoles.map(role => `${p.name}|${role}`);
            })
            .join('||');

          // Extract composition roles
          const composers = track.composition
            .filter(c => c.name && c.roles.includes('Composer'))
            .map(c => c.name)
            .join('|');
          
          const lyricists = track.composition
            .filter(c => c.name && c.roles.includes('Lyricist'))
            .map(c => c.name)
            .join('|');
          
          const songwriters = track.composition
            .filter(c => c.name && c.roles.includes('Songwriter'))
            .map(c => c.name)
            .join('|');
          
          const songwriterOther = track.composition
            .filter(c => c.name)
            .flatMap(c => {
              const otherRoles = c.roles.filter(role => 
                role !== 'Composer' && role !== 'Lyricist' && role !== 'Songwriter'
              );
              return otherRoles.map(role => `${c.name}|${role}`);
            })
            .join('||');

          // Extract production roles
          const producers = track.production
            .filter(p => p.name && p.roles.includes('Producer'))
            .map(p => p.name)
            .join('|');
          
          const mixEngineers = track.production
            .filter(p => p.name && p.roles.includes('Mixer'))
            .map(p => p.name)
            .join('|');
          
          const masteringEngineers = track.production
            .filter(p => p.name && p.roles.includes('Mastering Engineer'))
            .map(p => p.name)
            .join('|');
          
          const peOther = track.production
            .filter(p => p.name)
            .flatMap(p => {
              const otherRoles = p.roles.filter(role => 
                role !== 'Producer' && role !== 'Mixer' && role !== 'Mastering Engineer'
              );
              return otherRoles.map(role => `${p.name}|${role}`);
            })
            .join('||');

          // Format explicit content
          let explicitContent = 'N';
          if (track.explicitContent === 'yes') explicitContent = 'Y';
          else if (track.explicitContent === 'cleaned') explicitContent = 'Cleaned';

          // Set cell values
          row.getCell(1).value = 1;
          row.getCell(2).value = index + 1;
          row.getCell(3).value = 'SINGLE';
          row.getCell(4).value = releaseData.catalogNumber || '';
          row.getCell(5).value = releaseData.labelName;
          row.getCell(6).value = releaseData.upc || '';
          row.getCell(7).value = formatDate(releaseData.releaseDate || '');
          row.getCell(8).value = formatDate(releaseData.originalReleaseDate || '');
          row.getCell(9).value = releaseData.artists.filter(a => a).join('|');
          row.getCell(10).value = releaseData.featuredArtists.join('|');
          row.getCell(11).value = albumOtherArtist;
          row.getCell(12).value = releaseData.title;
          row.getCell(13).value = releaseData.mixVersion || '';
          row.getCell(14).value = track.artists.filter(a => a).join('|');
          row.getCell(15).value = track.featuredArtists.join('|');
          row.getCell(16).value = vocalists;
          row.getCell(17).value = programming;
          row.getCell(18).value = guitarists;
          row.getCell(19).value = performerOther;
          row.getCell(20).value = composers;
          row.getCell(21).value = lyricists;
          row.getCell(22).value = songwriters;
          row.getCell(23).value = songwriterOther;
          row.getCell(24).value = producers;
          row.getCell(25).value = mixEngineers;
          row.getCell(26).value = masteringEngineers;
          row.getCell(27).value = peOther;
          row.getCell(28).value = track.title;
          row.getCell(29).value = track.mixVersion || '';
          row.getCell(30).value = track.remixers.join('|');
          row.getCell(31).value = track.isrcCode || '';
          row.getCell(32).value = track.secondaryIsrc || '';
          row.getCell(33).value = track.language;
          row.getCell(34).value = '';
          row.getCell(35).value = track.trackGenre;
          row.getCell(36).value = track.publishers.join('|');
          row.getCell(37).value = '';
          row.getCell(38).value = track.audioFile?.name || '';
          row.getCell(39).value = explicitContent;
          row.getCell(40).value = 'N';
          row.getCell(41).value = releaseData.albumCLine;
          row.getCell(42).value = releaseData.albumPLine;
          row.getCell(43).value = territories.included;
          row.getCell(44).value = territories.excluded;
          row.getCell(45).value = releaseData.albumGenre;
          row.getCell(46).value = '';
          row.getCell(47).value = '';
          row.getCell(48).value = track.trackGenre;
          row.getCell(49).value = 'N';
          row.getCell(50).value = 'N';
          row.getCell(51).value = track.lyrics || '';
          row.getCell(52).value = '';

          row.commit();
        });

        // Generate Excel buffer and add to ZIP
        const excelBuffer = await workbook.xlsx.writeBuffer();
        const releaseTitle = releaseData.title.replace(/[^a-z0-9]/gi, '_');
        zip.file(`${releaseTitle}_metadata.xlsx`, excelBuffer);
      } catch (error) {
        console.error('Error creating Excel file:', error);
        // Continue with ZIP creation even if Excel fails
      }

      // Add artwork if present
      if (releaseData.artwork) {
        setExportProgress(40);
        zip.file(`artwork.${releaseData.artwork.name.split('.').pop()}`, releaseData.artwork);
      }

      // Add audio files
      let audioProgress = 40;
      for (let i = 0; i < tracks.length; i++) {
        if (tracks[i].audioFile) {
          audioProgress += (40 / tracks.length);
          setExportProgress(Math.round(audioProgress));
          
          const trackNumber = String(i + 1).padStart(2, '0');
          const sanitizedTitle = tracks[i].title.replace(/[^a-z0-9]/gi, '_');
          const extension = tracks[i].audioFile!.name.split('.').pop();
          const filename = `${trackNumber}_${sanitizedTitle}.${extension}`;
          
          zip.file(filename, tracks[i].audioFile!);
        }
      }

      // Generate ZIP file
      setExportProgress(90);
      const blob = await zip.generateAsync({ type: 'blob' });

      // Trigger download
      setExportProgress(100);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const releaseTitle = releaseData.title.replace(/[^a-z0-9]/gi, '_');
      link.download = `${releaseTitle}_release.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportComplete(true);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error creating ZIP:', error);
      alert('Error creating ZIP file. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Export Release</h2>
      
      {/* Release Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Music className="w-5 h-5 mr-2" />
            Release Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700">Title</h4>
              <p className="text-lg">{releaseData.title}</p>
              {releaseData.mixVersion && (
                <p className="text-sm text-gray-600">{releaseData.mixVersion}</p>
              )}
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700">Primary Artists</h4>
              <p>{releaseData.artists.filter(a => a).join(', ')}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700">Label</h4>
              <p>{releaseData.labelName}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700">Genre</h4>
              <p>{releaseData.albumGenre}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700">Release Date</h4>
              <p>{releaseData.releaseDate}</p>
              {releaseData.isReRelease && releaseData.originalReleaseDate && (
                <p className="text-sm text-gray-600">
                  Original: {releaseData.originalReleaseDate}
                </p>
              )}
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700">Tracks</h4>
              <p>{tracks.length} track{tracks.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {releaseData.featuredArtists.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700">Featured Artists</h4>
              <p>{releaseData.featuredArtists.join(', ')}</p>
            </div>
          )}

          {releaseData.remixers.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700">Remixers</h4>
              <p>{releaseData.remixers.join(', ')}</p>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-2 text-gray-600" />
              <span className="text-sm">
                {releaseData.isWorldwide ? 'Worldwide Release' : 
                  `${releaseData.territoryMode === 'include' ? 'Include' : 'Exclude'} ${releaseData.territories.length} territories`}
              </span>
            </div>
            
            <div className="flex items-center">
              <Upload className="w-4 h-4 mr-2 text-gray-600" />
              <span className="text-sm">{countFiles()} file{countFiles() !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Track Listing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Track Listing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tracks.map((track, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{index + 1}.</span>
                    <span className="font-medium">{track.title || 'Untitled'}</span>
                    {track.mixVersion && (
                      <Badge variant="secondary" className="text-xs">
                        {track.mixVersion}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {track.artists.filter(a => a).join(', ')}
                  </p>
                  {track.featuredArtists.length > 0 && (
                    <p className="text-xs text-gray-500">
                      feat. {track.featuredArtists.join(', ')}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{countContributors(track)} contributors</span>
                  <span>{track.trackGenre}</span>
                  <span>{track.language}</span>
                  {track.audioFile && <CheckCircle className="w-4 h-4 text-green-500" />}
                  {track.dolbyAtmos && <Badge variant="outline" className="text-xs">Atmos</Badge>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Validation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Validation Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const issues = validateData();
            if (issues.length === 0) {
              return (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>All data is valid and ready for export</span>
                </div>
              );
            } else {
              return (
                <div className="space-y-2">
                  <div className="flex items-center text-red-600 mb-3">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span>{issues.length} issue{issues.length !== 1 ? 's' : ''} found</span>
                  </div>
                  <ul className="space-y-1">
                    {issues.map((issue, index) => (
                      <li key={index} className="text-sm text-red-600">â€¢ {issue}</li>
                    ))}
                  </ul>
                </div>
              );
            }
          })()}
        </CardContent>
      </Card>

      {/* Export Process */}
      {isExporting && (
        <Card>
          <CardHeader>
            <CardTitle>Exporting Release...</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={exportProgress} className="w-full" />
            <p className="text-sm text-gray-600 mt-2">
              Processing files and metadata... {exportProgress}%
            </p>
          </CardContent>
        </Card>
      )}

      {exportComplete && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-6 h-6 mr-3" />
              <div>
                <h3 className="font-medium">Download Complete!</h3>
                <p className="text-sm text-green-700">
                  Your release package has been successfully downloaded.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Actions */}
      <div className="flex justify-between">
        <Button variant="outline" disabled={isExporting}>
          Back to Tracks
        </Button>
        
        <div className="flex gap-2">
          <Button
            onClick={handleDownloadZip}
            disabled={isExporting || validateData().length > 0}
            className="flex items-center bg-blue-500 hover:bg-blue-600"
          >
            {isExporting ? (
              <>Processing...</>
            ) : (
              <>
                <FileArchive className="w-4 h-4 mr-2" />
                Download Zip
              </>
            )}
          </Button>

        
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-orange-800 flex items-center justify-center">
  <CheckCircle className="w-6 h-6 mr-2" />
  You're Almost There!
</DialogTitle>

<DialogDescription className="text-center space-y-4 pt-4">
  <p className="text-base">
    Please send to <strong>support@xelondigital.com</strong>
  </p>

  <p className="text-base">
    Don’t forget to submit your <a href="https://airtable.com/appncstxdoakDSeBs/pagq9v5PHhRqVqB9N/form" className="text-orange-700 underline">pitch form</a> ASAP to give your music the best chance at platforms
  </p>

  <p className="text-base">
    If you need more tips on how to approach your release, check out our <a href="https://drive.google.com/file/d/1sK3GYvMjf7P7eM5EXTaHtPo8Z3sh84hi/view?usp=sharing" className="text-orange-700 underline">resources</a>
  </p>

  <p className="text-base">
    For any other needs please contact <strong>support@xelondigital.com</strong>
  </p>

  <p className="text-base">
    We can’t wait to get to work on your release!
  </p>
</DialogDescription>

          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button 
              onClick={() => setShowSuccessModal(false)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExportStep;