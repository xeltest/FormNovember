
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Upload, AlertCircle, Files } from 'lucide-react';
import { TrackData } from '@/pages/Index';
import { areAssetsMandatory } from '@/lib/assetValidation';
import { FieldTooltip } from '@/components/ui/FieldTooltip';
import CopyTrackModal from '@/components/CopyTrackModal';

interface TrackMetadataSectionProps {
  track: TrackData;
  onChange: (updates: Partial<TrackData>) => void;
  showValidation: boolean;
  onCopyFromRelease: () => void;
  tracks: TrackData[];
  currentTrackIndex: number;
  onCopyFromTrack: (sourceIndex: number) => void;
  getTrackDisplayTitle: (track: TrackData, index: number) => string;
}

const TrackMetadataSection = ({
  track,
  onChange,
  showValidation,
  onCopyFromRelease,
  tracks,
  currentTrackIndex,
  onCopyFromTrack,
  getTrackDisplayTitle
}: TrackMetadataSectionProps) => {
  const [showMixVersion, setShowMixVersion] = useState(!!track.mixVersion);
  const [dragActive, setDragActive] = useState(false);
  const [copyModalOpen, setCopyModalOpen] = useState(false);

  // Auto-expand mix/version section when data is populated (e.g., from "Copy from Release Info")
  useEffect(() => {
    if (track.mixVersion && track.mixVersion.trim() !== '') {
      setShowMixVersion(true);
    }
  }, [track.mixVersion]);

  const handleFileUpload = (file: File) => {
    onChange({ audioFile: file });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('audio/')) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const triggerFileInput = () => {
    document.getElementById('audio-upload')?.click();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Track Information</CardTitle>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCopyFromRelease}
              className="text-xs"
            >
              Copy from Release Info
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCopyModalOpen(true)}
              className="text-xs"
            >
              <Files className="w-3 h-3 mr-1" />
              Duplicate Track
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <FieldTooltip
            label="Track Title"
            fieldKey="trackTitle"
            htmlFor="trackTitle"
            required
          />
          <Input
            id="trackTitle"
            value={track.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Enter track title"
          />
        </div>

        {!showMixVersion ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowMixVersion(true)}
            className="text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Mix/Version
          </Button>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <FieldTooltip
                label="Track Mix/Version"
                fieldKey="trackMixVersion"
                htmlFor="trackMixVersion"
              />
              <Input
                id="trackMixVersion"
                value={track.mixVersion || ''}
                onChange={(e) => onChange({ mixVersion: e.target.value })}
                placeholder="e.g., Radio Edit, Extended Mix"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowMixVersion(false);
                onChange({ mixVersion: undefined });
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        <div>
          <FieldTooltip
            label="Audio File"
            fieldKey="audioFile"
            required={areAssetsMandatory()}
          />
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              dragActive
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-950'
                : showValidation && areAssetsMandatory() && !track.audioFile
                ? 'border-orange-400 bg-orange-50 dark:bg-orange-950 hover:border-orange-500'
                : 'border-border hover:border-foreground/20'
            }`}
            onClick={triggerFileInput}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {showValidation && areAssetsMandatory() && !track.audioFile ? (
              <AlertCircle className="w-8 h-8 mx-auto text-orange-500 mb-2" />
            ) : (
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            )}
            <p className="text-sm text-foreground">
              {track.audioFile ? track.audioFile.name : 'Select audio file for this track'}
            </p>
            <p className="text-xs text-muted-foreground">WAV (Minimum 16bit 44.1kHz)</p>
            {showValidation && areAssetsMandatory() && !track.audioFile && (
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-2 font-medium">
                Audio file is required to proceed
              </p>
            )}
            <input
              id="audio-upload"
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
          </div>
        </div>
      </CardContent>

      <CopyTrackModal
        tracks={tracks}
        onCopy={onCopyFromTrack}
        getTrackDisplayTitle={getTrackDisplayTitle}
        excludeIndex={currentTrackIndex}
        open={copyModalOpen}
        onOpenChange={setCopyModalOpen}
      />
    </Card>
  );
};

export default TrackMetadataSection;
