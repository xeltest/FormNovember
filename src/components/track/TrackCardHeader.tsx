
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Copy, Trash2, GripVertical, Files } from 'lucide-react';
import { TrackData } from '@/pages/Index';
import CopyTrackModal from '@/components/CopyTrackModal';

interface TrackCardHeaderProps {
  track: TrackData;
  index: number;
  isExpanded: boolean;
  tracksLength: number;
  tracks: TrackData[];
  getTrackDisplayTitle: (track: TrackData, index: number) => string;
  onToggleExpand: () => void;
  onRemoveTrack: () => void;
  onPrefillFromRelease: () => void;
  onCopyFromTrack: (sourceIndex: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
}

const TrackCardHeader = ({
  track,
  index,
  isExpanded,
  tracksLength,
  tracks,
  getTrackDisplayTitle,
  onToggleExpand,
  onRemoveTrack,
  onPrefillFromRelease,
  onCopyFromTrack,
  onDragStart
}: TrackCardHeaderProps) => {
  const [copyModalOpen, setCopyModalOpen] = React.useState(false);
  return (
    <CardHeader 
      className="cursor-pointer hover:bg-accent/50"
      onClick={onToggleExpand}
    >
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {!isExpanded && (
            <div 
              data-drag-handle
              className="cursor-move p-1 hover:bg-accent rounded"
              onClick={(e) => e.stopPropagation()}
              draggable={true}
              onDragStart={(e) => {
                e.stopPropagation();
                onDragStart(e, index);
              }}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>
          )}
          <span>{getTrackDisplayTitle(track, index)}</span>
        </div>
        <div className="flex items-center space-x-2">
          {tracksLength > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to remove this track?')) {
                  onRemoveTrack();
                }
              }}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onPrefillFromRelease();
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            <Copy className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setCopyModalOpen(true);
            }}
            className="text-green-600 hover:text-green-800"
          >
            <Files className="w-4 h-4" />
          </Button>

          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </CardTitle>

      <CopyTrackModal
        tracks={tracks}
        onCopy={onCopyFromTrack}
        getTrackDisplayTitle={getTrackDisplayTitle}
        excludeIndex={index}
        open={copyModalOpen}
        onOpenChange={setCopyModalOpen}
      />
    </CardHeader>
  );
};

export default TrackCardHeader;
