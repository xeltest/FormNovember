
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TrackData } from '@/pages/Index';
import CopyTrackModal from '@/components/CopyTrackModal';

interface TrackDetailsHeaderProps {
  tracks: TrackData[];
  onAddBlankTrack: () => void;
  onCopyFromTrack: (sourceIndex: number) => void;
  getTrackDisplayTitle: (track: TrackData, index: number) => string;
}

const TrackDetailsHeader = ({ 
  tracks, 
  onAddBlankTrack, 
  onCopyFromTrack, 
  getTrackDisplayTitle 
}: TrackDetailsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-foreground">Track Details</h2>
      <div className="flex space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onAddBlankTrack}
          className="flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Blank Track
        </Button>
        
        {tracks.length > 0 && (
          <CopyTrackModal 
            tracks={tracks}
            onCopy={onCopyFromTrack}
            getTrackDisplayTitle={getTrackDisplayTitle}
          />
        )}
      </div>
    </div>
  );
};

export default TrackDetailsHeader;
