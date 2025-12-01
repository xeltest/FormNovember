
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Upload, AlertCircle } from 'lucide-react';
import { TrackData } from '@/pages/Index';
import { areAssetsMandatory } from '@/lib/assetValidation';
import { FieldTooltip } from '@/components/ui/FieldTooltip';

interface TrackMetadataSectionProps {
  track: TrackData;
  onChange: (updates: Partial<TrackData>) => void;
  showValidation: boolean;
}

const TrackMetadataSection = ({ track, onChange, showValidation }: TrackMetadataSectionProps) => {
  const [showMixVersion, setShowMixVersion] = useState(!!track.mixVersion);
  const [dragActive, setDragActive] = useState(false);

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
        <CardTitle>Track Information</CardTitle>
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
    </Card>
  );
};

export default TrackMetadataSection;
