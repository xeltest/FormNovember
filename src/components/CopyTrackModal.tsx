
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Copy } from 'lucide-react';
import { TrackData } from '@/pages/Index';

interface CopyTrackModalProps {
  tracks: TrackData[];
  onCopy: (sourceIndex: number) => void;
  getTrackDisplayTitle: (track: TrackData, index: number) => string;
  excludeIndex?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CopyTrackModal = ({ tracks, onCopy, getTrackDisplayTitle, excludeIndex, open, onOpenChange }: CopyTrackModalProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);

  // Use external state if provided, otherwise use internal state
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen;

  // Filter tracks to exclude the current track if excludeIndex is provided
  const filteredTracks = tracks.filter((_, i) => excludeIndex === undefined || i !== excludeIndex);

  const handleCopy = (originalIndex: number) => {
    onCopy(originalIndex);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {open === undefined && (
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="flex items-center"
          >
            <Copy className="w-4 h-4 mr-2" />
            Duplicate Track
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Track To Duplicate</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {tracks.map((track, index) => {
            // Skip excluded track
            if (excludeIndex !== undefined && index === excludeIndex) {
              return null;
            }

            return (
              <Card
                key={index}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => handleCopy(index)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">
                        {getTrackDisplayTitle(track, index)}
                      </h4>
                      {track.artists[0] && (
                        <p className="text-xs text-muted-foreground mt-1">
                          by {track.artists.filter(a => a).join(', ')}
                        </p>
                      )}
                    </div>
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CopyTrackModal;
