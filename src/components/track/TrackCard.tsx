
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrackData, ReleaseData } from '@/pages/Index';
import TrackForm from '@/components/TrackForm';
import TrackCardHeader from '@/components/track/TrackCardHeader';

interface TrackCardProps {
  track: TrackData;
  index: number;
  isExpanded: boolean;
  tracksLength: number;
  tracks: TrackData[];
  releaseData: ReleaseData;
  showValidation: boolean;
  draggedIndex: number | null;
  dragOverIndex: number | null;
  getTrackDisplayTitle: (track: TrackData, index: number) => string;
  onToggleExpand: () => void;
  onUpdateTrack: (updatedTrack: TrackData) => void;
  onRemoveTrack: () => void;
  onPrefillFromRelease: () => void;
  onCopyFromTrack: (sourceIndex: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, dropIndex: number) => void;
}

const TrackCard = ({
  track,
  index,
  isExpanded,
  tracksLength,
  tracks,
  releaseData,
  showValidation,
  draggedIndex,
  dragOverIndex,
  getTrackDisplayTitle,
  onToggleExpand,
  onUpdateTrack,
  onRemoveTrack,
  onPrefillFromRelease,
  onCopyFromTrack,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop
}: TrackCardProps) => {
  return (
    <Card 
      className={`relative transition-all ${
        dragOverIndex === index ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : ''
      } ${draggedIndex === index ? 'opacity-50' : ''}`}
      onDragOver={(e) => onDragOver(e, index)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, index)}
    >
      <TrackCardHeader
        track={track}
        index={index}
        isExpanded={isExpanded}
        tracksLength={tracksLength}
        tracks={tracks}
        getTrackDisplayTitle={getTrackDisplayTitle}
        onToggleExpand={onToggleExpand}
        onRemoveTrack={onRemoveTrack}
        onPrefillFromRelease={onPrefillFromRelease}
        onCopyFromTrack={onCopyFromTrack}
        onDragStart={onDragStart}
      />
      
      {isExpanded && (
        <CardContent>
          <TrackForm
            track={track}
            onChange={onUpdateTrack}
            releaseData={releaseData}
            showValidation={showValidation}
            tracks={tracks}
            currentTrackIndex={index}
            onCopyFromTrack={onCopyFromTrack}
            getTrackDisplayTitle={getTrackDisplayTitle}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default TrackCard;
