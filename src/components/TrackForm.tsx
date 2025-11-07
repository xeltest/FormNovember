
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
}

const TrackForm = ({ track, onChange, releaseData }: TrackFormProps) => {
  const updateTrack = (updates: Partial<TrackData>) => {
    onChange({ ...track, ...updates });
  };

  // Handle instrumental language change
  useEffect(() => {
    if (track.language === 'Instrumental' && track.explicitContent !== 'no') {
      updateTrack({ explicitContent: 'no' });
    }
  }, [track.language]);

  return (
    <div className="space-y-6">
      <TrackMetadataSection track={track} onChange={updateTrack} />
      <TrackArtistsSection track={track} onChange={updateTrack} />
      <ContributorsSection track={track} onChange={updateTrack} />
      <TrackDetailsSection track={track} onChange={updateTrack} />
    </div>
  );
};

export default TrackForm;
