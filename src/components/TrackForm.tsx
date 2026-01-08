
import React, { useEffect } from 'react';
import { TrackData, ReleaseData } from '@/pages/Index';
import TrackMetadataSection from '@/components/track/TrackMetadataSection';
import TrackArtistsSection from '@/components/track/TrackArtistsSection';
import ContributorsSection from '@/components/track/ContributorsSection';
import TrackDetailsSection from '@/components/track/TrackDetailsSection';

interface TrackFormProps {
  track: TrackData;
  onChange: (track: TrackData) => void;
  releaseData: ReleaseData;
  showValidation: boolean;
  tracks: TrackData[];
  currentTrackIndex: number;
  onCopyFromTrack: (sourceIndex: number) => void;
  getTrackDisplayTitle: (track: TrackData, index: number) => string;
}

const TrackForm = ({
  track,
  onChange,
  releaseData,
  showValidation,
  tracks,
  currentTrackIndex,
  onCopyFromTrack,
  getTrackDisplayTitle
}: TrackFormProps) => {
  const updateTrack = (updates: Partial<TrackData>) => {
    onChange({ ...track, ...updates });
  };

  const copyFromReleaseInfo = () => {
    updateTrack({
      title: releaseData.title,
      mixVersion: releaseData.mixVersion,
      artists: [...releaseData.artists],
      featuredArtists: [...releaseData.featuredArtists],
      remixers: [...releaseData.remixers]
    });
  };

  // Handle instrumental language change
  useEffect(() => {
    if (track.language === 'Instrumental' && track.explicitContent !== 'no') {
      updateTrack({ explicitContent: 'no' });
    }
  }, [track.language]);

  return (
    <div className="space-y-6">
      <TrackMetadataSection
        track={track}
        onChange={updateTrack}
        showValidation={showValidation}
        onCopyFromRelease={copyFromReleaseInfo}
        tracks={tracks}
        currentTrackIndex={currentTrackIndex}
        onCopyFromTrack={onCopyFromTrack}
        getTrackDisplayTitle={getTrackDisplayTitle}
      />
      <TrackArtistsSection track={track} onChange={updateTrack} />
      <ContributorsSection track={track} onChange={updateTrack} />
      <TrackDetailsSection track={track} onChange={updateTrack} />
    </div>
  );
};

export default TrackForm;
