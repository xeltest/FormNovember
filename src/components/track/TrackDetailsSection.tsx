
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

interface TrackDetailsSectionProps {
  track: TrackData;
  onChange: (updates: Partial<TrackData>) => void;
}

const genres = [
  'Rock', 'Pop', 'Dance', 'Electronic', 'Hip-Hop/Rap', 'R&B/Soul',
  'Classical', 'Jazz', 'Folk', 'Country', 'Metal', 'Blues', 'Reggae',
  'Punk', 'World', 'Latin', 'Indie', 'Alternative', 'Techno', 'House'
];

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
          <Label>Publisher(s)</Label>
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
          <Label htmlFor="trackGenre">Track Genre *</Label>
          <Select value={track.trackGenre} onValueChange={(value) => onChange({ trackGenre: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent>
              {genres.map(genre => (
                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="isrcCode">ISRC Code</Label>
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
            <Label htmlFor="dolbyAtmos">Dolby Atmos</Label>
          </div>
        </div>

        {track.dolbyAtmos && (
          <div>
            <Label htmlFor="secondaryIsrc">Secondary ISRC (Dolby Atmos)</Label>
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
            <Label htmlFor="language">Language *</Label>
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
            <Label>Explicit Content *</Label>
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
          <Label htmlFor="lyrics">Lyrics</Label>
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
