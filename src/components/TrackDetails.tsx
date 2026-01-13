
import React, { useState } from 'react';
import { TrackData, ReleaseData } from '@/pages/Index';
import TrackDetailsHeader from '@/components/track/TrackDetailsHeader';
import TrackCard from '@/components/track/TrackCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TrackDetailsProps {
  tracks: TrackData[];
  onChange: (tracks: TrackData[]) => void;
  releaseData: ReleaseData;
  showValidation: boolean;
}

const TrackDetails = ({ tracks, onChange, releaseData, showValidation }: TrackDetailsProps) => {
  const [expandedTrack, setExpandedTrack] = useState<number>(0);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const addBlankTrack = () => {
    const newTrack: TrackData = {
      title: '',
      artists: [''],
      featuredArtists: [],
      remixers: [],
      performers: [{ name: '', roles: [] }],
      composition: [{ name: '', roles: [] }],
      production: [{ name: '', roles: [] }],
      publishers: [],
      trackGenre: releaseData.albumGenre || '',
      dolbyAtmos: false,
      language: 'English',
      explicitContent: 'no'
    };
    onChange([...tracks, newTrack]);
    setExpandedTrack(tracks.length);
  };

  const copyFromTrack = (sourceIndex: number, targetIndex: number) => {
    const sourceTrack = tracks[sourceIndex];
    const targetTrack = tracks[targetIndex];

    // Copy all metadata EXCEPT audio file and ISRC codes
    const updatedTrack: TrackData = {
      ...sourceTrack,
      audioFile: targetTrack.audioFile, // Keep the current track's audio file
      isrcCode: targetTrack.isrcCode, // Keep the current track's ISRC
      secondaryIsrc: targetTrack.secondaryIsrc // Keep the current track's secondary ISRC
    };

    updateTrack(targetIndex, updatedTrack);
  };

  const removeTrack = (index: number) => {
    if (tracks.length > 1) {
      const newTracks = tracks.filter((_, i) => i !== index);
      onChange(newTracks);
      if (expandedTrack >= newTracks.length) {
        setExpandedTrack(newTracks.length - 1);
      }
    }
  };

  const updateTrack = (index: number, updatedTrack: TrackData) => {
    const newTracks = [...tracks];
    newTracks[index] = updatedTrack;
    onChange(newTracks);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    console.log('Drag started for track:', index);
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear drag over if we're leaving the component entirely
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    console.log('Drop event triggered:', { draggedIndex, dropIndex });
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newTracks = [...tracks];
    const [draggedTrack] = newTracks.splice(draggedIndex, 1);
    newTracks.splice(dropIndex, 0, draggedTrack);
    
    console.log('Reordering tracks from', draggedIndex, 'to', dropIndex);
    onChange(newTracks);
    
    // Update expanded track index
    if (expandedTrack === draggedIndex) {
      setExpandedTrack(dropIndex);
    } else if (draggedIndex < expandedTrack && dropIndex >= expandedTrack) {
      setExpandedTrack(expandedTrack - 1);
    } else if (draggedIndex > expandedTrack && dropIndex <= expandedTrack) {
      setExpandedTrack(expandedTrack + 1);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const prefillFromRelease = (trackIndex: number) => {
    const track = tracks[trackIndex];
    const updatedTrack: TrackData = {
      ...track,
      artists: [...releaseData.artists],
      featuredArtists: [...releaseData.featuredArtists],
      remixers: [...releaseData.remixers],
    };
    updateTrack(trackIndex, updatedTrack);
  };

  const getTrackDisplayTitle = (track: TrackData, index: number) => {
    let title = `Track ${index + 1}: ${track.title || 'Untitled'}`;
    if (track.mixVersion) {
      title += ` (${track.mixVersion})`;
    }
    return title;
  };

  return (
    <div className="space-y-6">
      <TrackDetailsHeader />

      <div className="space-y-4">
        {tracks.map((track, index) => (
          <TrackCard
            key={`track-${index}`}
            track={track}
            index={index}
            isExpanded={expandedTrack === index}
            tracksLength={tracks.length}
            tracks={tracks}
            releaseData={releaseData}
            showValidation={showValidation}
            draggedIndex={draggedIndex}
            dragOverIndex={dragOverIndex}
            getTrackDisplayTitle={getTrackDisplayTitle}
            onToggleExpand={() => setExpandedTrack(expandedTrack === index ? -1 : index)}
            onUpdateTrack={(updatedTrack) => updateTrack(index, updatedTrack)}
            onRemoveTrack={() => removeTrack(index)}
            onPrefillFromRelease={() => prefillFromRelease(index)}
            onCopyFromTrack={(sourceIndex) => copyFromTrack(sourceIndex, index)}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />
        ))}

        <div className="flex justify-center pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={addBlankTrack}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Track
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrackDetails;
