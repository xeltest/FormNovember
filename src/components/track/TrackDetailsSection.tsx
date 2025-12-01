
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { TrackData } from '@/pages/Index';
import { GenreSelector } from '@/components/GenreSelector';
import { FieldTooltip } from '@/components/ui/FieldTooltip';

interface TrackDetailsSectionProps {
  track: TrackData;
  onChange: (updates: Partial<TrackData>) => void;
}

const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Instrumental', 'Other'];

const TrackDetailsSection = ({ track, onChange }: TrackDetailsSectionProps) => {
  const updatePublisher = (index: number, value: string) => {
    const newPublishers = [...track.publishers];
    newPublishers[index] = value;
    onChange({ publishers: newPublishers });
  };

  const addPublisher = () => {
    onChange({ publishers: [...track.publishers, ''] });
  };

  const removePublisher = (index: number) => {
    const newPublishers = track.publishers.filter((_, i) => i !== index);
    onChange({ publishers: newPublishers });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Track Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <FieldTooltip
            label="Publisher(s)"
            fieldKey="publisher"
          />
          {track.publishers.length === 0 ? (
            <Button 
              type="button" 
              variant="outline" 
              onClick={addPublisher}
              className="text-sm mt-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Publisher
            </Button>
          ) : (
            track.publishers.map((publisher, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                <Input
                  value={publisher}
                  onChange={(e) => updatePublisher(index, e.target.value)}
                  placeholder="Publisher name"
                />
                {index === track.publishers.length - 1 && (
                  <Button type="button" size="sm" onClick={addPublisher}>
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removePublisher(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        <div>
          <GenreSelector
            id="trackGenre"
            label="Track Genre *"
            value={track.trackGenre}
            onValueChange={(value) => onChange({ trackGenre: value })}
            placeholder="Select track genre"
            showTooltip
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldTooltip
              label="ISRC Code"
              fieldKey="isrc"
              htmlFor="isrcCode"
            />
            <Input
              id="isrcCode"
              value={track.isrcCode || ''}
              onChange={(e) => onChange({ isrcCode: e.target.value })}
              placeholder="e.g., USMC81234567"
            />
          </div>

          <div className="flex items-center space-x-2 pt-6">
            <Checkbox
              id="dolbyAtmos"
              checked={track.dolbyAtmos}
              onCheckedChange={(checked) => onChange({ dolbyAtmos: !!checked })}
            />
            <FieldTooltip
              label="Dolby Atmos"
              fieldKey="dolbyAtmos"
              htmlFor="dolbyAtmos"
            />
          </div>
        </div>

        {track.dolbyAtmos && (
          <div>
            <FieldTooltip
              label="Secondary ISRC (Dolby Atmos)"
              fieldKey="secondaryIsrc"
              htmlFor="secondaryIsrc"
            />
            <Input
              id="secondaryIsrc"
              value={track.secondaryIsrc || ''}
              onChange={(e) => onChange({ secondaryIsrc: e.target.value })}
              placeholder="e.g., USMC87654321"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldTooltip
              label="Language"
              fieldKey="language"
              htmlFor="language"
              required
            />
            <Select value={track.language} onValueChange={(value) => onChange({ language: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map(language => (
                  <SelectItem key={language} value={language}>{language}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <FieldTooltip
              label="Explicit Content"
              fieldKey="explicitContent"
              required
            />
            <div className="flex space-x-2 mt-2">
              {(['no', 'yes', 'cleaned'] as const).map(option => (
                <Button
                  key={option}
                  type="button"
                  variant={track.explicitContent === option ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onChange({ explicitContent: option })}
                  disabled={track.language === 'Instrumental'}
                  className="capitalize"
                >
                  {option}
                </Button>
              ))}
            </div>
            {track.language === 'Instrumental' && (
              <p className="text-xs text-gray-500 mt-1">
                Instrumental tracks automatically set to "No" explicit content
              </p>
            )}
          </div>
        </div>

        <div>
          <FieldTooltip
            label="Lyrics"
            fieldKey="lyrics"
            htmlFor="lyrics"
          />
          <Textarea
            id="lyrics"
            value={track.lyrics || ''}
            onChange={(e) => onChange({ lyrics: e.target.value })}
            placeholder="Enter track lyrics..."
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackDetailsSection;
