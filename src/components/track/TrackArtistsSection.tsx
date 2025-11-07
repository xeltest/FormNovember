
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { TrackData } from '@/pages/Index';

interface TrackArtistsSectionProps {
  track: TrackData;
  onChange: (updates: Partial<TrackData>) => void;
}

const TrackArtistsSection = ({ track, onChange }: TrackArtistsSectionProps) => {
  const [showFeaturedArtists, setShowFeaturedArtists] = useState(track.featuredArtists.length > 0);
  const [showRemixers, setShowRemixers] = useState(track.remixers.length > 0);

  const updateArtistList = (listName: 'artists' | 'featuredArtists' | 'remixers', index: number, value: string) => {
    const newList = [...track[listName]];
    newList[index] = value;
    onChange({ [listName]: newList });
  };

  const addArtist = (listName: 'artists' | 'featuredArtists' | 'remixers') => {
    const newList = [...track[listName], ''];
    onChange({ [listName]: newList });
  };

  const removeArtist = (listName: 'artists' | 'featuredArtists' | 'remixers', index: number) => {
    const newList = track[listName].filter((_, i) => i !== index);
    onChange({ [listName]: newList });
    
    if (listName === 'featuredArtists' && newList.length === 0) {
      setShowFeaturedArtists(false);
    }
    if (listName === 'remixers' && newList.length === 0) {
      setShowRemixers(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Track Artists</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Track Artist(s) *</Label>
          {track.artists.map((artist, index) => (
            <div key={index} className="flex items-center space-x-2 mt-2">
              <Input
                value={artist}
                onChange={(e) => updateArtistList('artists', index, e.target.value)}
                placeholder="Artist name"
              />
              {index === track.artists.length - 1 && (
                <Button type="button" size="sm" onClick={() => addArtist('artists')}>
                  <Plus className="w-4 h-4" />
                </Button>
              )}
              {index > 0 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeArtist('artists', index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {!showFeaturedArtists ? (
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setShowFeaturedArtists(true);
              if (track.featuredArtists.length === 0) {
                onChange({ featuredArtists: [''] });
              }
            }}
            className="text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Featured Artist
          </Button>
        ) : (
          <div>
            <Label>Track Featured Artist(s)</Label>
            {track.featuredArtists.map((artist, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                <Input
                  value={artist}
                  onChange={(e) => updateArtistList('featuredArtists', index, e.target.value)}
                  placeholder="Featured artist name"
                />
                {index === track.featuredArtists.length - 1 && (
                  <Button type="button" size="sm" onClick={() => addArtist('featuredArtists')}>
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeArtist('featuredArtists', index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {!showRemixers ? (
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setShowRemixers(true);
              if (track.remixers.length === 0) {
                onChange({ remixers: [''] });
              }
            }}
            className="text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Remixer
          </Button>
        ) : (
          <div>
            <Label>Track Remixer(s)</Label>
            {track.remixers.map((artist, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                <Input
                  value={artist}
                  onChange={(e) => updateArtistList('remixers', index, e.target.value)}
                  placeholder="Remixer name"
                />
                {index === track.remixers.length - 1 && (
                  <Button type="button" size="sm" onClick={() => addArtist('remixers')}>
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeArtist('remixers', index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrackArtistsSection;
