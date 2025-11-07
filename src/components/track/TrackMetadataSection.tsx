
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Upload } from 'lucide-react';
import { TrackData } from '@/pages/Index';

interface TrackMetadataSectionProps {
  track: TrackData;
  onChange: (updates: Partial<TrackData>) => void;
}

const TrackMetadataSection = ({ track, onChange }: TrackMetadataSectionProps) => {
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
          <Label htmlFor="trackTitle">Track Title *</Label>
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
              <Label htmlFor="trackMixVersion">Track Mix/Version</Label>
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
          <Label>Audio File</Label>
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={triggerFileInput}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              {track.audioFile ? track.audioFile.name : 'Select audio file for this track'}
            </p>
            <p className="text-xs text-gray-500">WAV (Minimum 16bit 44.1kHz)</p>
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
