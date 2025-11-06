
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { TrackData } from '@/pages/Index';

interface ContributorsSectionProps {
  track: TrackData;
  onChange: (updates: Partial<TrackData>) => void;
}

const performerRoles = ['Vocalist', 'Guitar', 'Drums', 'Bass', 'Piano', 'Keyboard', 'Saxophone', 'Trumpet', 'Violin', 'Cello', 'Programming', 'Background Vocals', 'Flute'];
const compositionRoles = ['Composer', 'Lyricist', 'Arranger', 'Songwriter', 'Co-writer'];
const productionRoles = ['Producer', 'Engineer', 'Mixer', 'Mastering Engineer', 'Recording Engineer', 'Executive Producer'];

const ContributorsSection = ({ track, onChange }: ContributorsSectionProps) => {
  const updateContributor = (category: 'performers' | 'composition' | 'production', index: number, field: 'name' | 'roles', value: string | string[]) => {
    const newContributors = [...track[category]];
    if (field === 'roles') {
      newContributors[index] = { ...newContributors[index], roles: value as string[] };
    } else {
      newContributors[index] = { ...newContributors[index], name: value as string };
    }
    onChange({ [category]: newContributors });
  };

  const addContributor = (category: 'performers' | 'composition' | 'production') => {
    const newContributors = [...track[category], { name: '', roles: [] }];
    onChange({ [category]: newContributors });
  };

  const removeContributor = (category: 'performers' | 'composition' | 'production', index: number) => {
    if (track[category].length > 1) {
      const newContributors = track[category].filter((_, i) => i !== index);
      onChange({ [category]: newContributors });
    }
  };

  const addRole = (category: 'performers' | 'composition' | 'production', contributorIndex: number, role: string) => {
    const contributor = track[category][contributorIndex];
    if (!contributor.roles.includes(role)) {
      const newRoles = [...contributor.roles, role];
      updateContributor(category, contributorIndex, 'roles', newRoles);
    }
  };

  const removeRole = (category: 'performers' | 'composition' | 'production', contributorIndex: number, role: string) => {
    const contributor = track[category][contributorIndex];
    const newRoles = contributor.roles.filter(r => r !== role);
    updateContributor(category, contributorIndex, 'roles', newRoles);
  };

  const getRolesByCategory = (category: string) => {
    switch (category) {
      case 'performers': return performerRoles;
      case 'composition': return compositionRoles;
      case 'production': return productionRoles;
      default: return [];
    }
  };

  const getSectionTitle = (category: string) => {
    switch (category) {
      case 'performers': return 'Performers';
      case 'composition': return 'Composition';
      case 'production': return 'Production';
      default: return '';
    }
  };

  const getAddButtonLabel = (category: string) => {
    switch (category) {
      case 'performers': return 'Add Performer';
      case 'composition': return 'Add Composer/Writer';
      case 'production': return 'Add Producer/Engineer';
      default: return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contributors</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {(['performers', 'composition', 'production'] as const).map(category => (
          <div key={category} className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-lg">{getSectionTitle(category)} *</h4>
            </div>
            
            {track[category].map((contributor, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3 bg-gray-50">
                <div className="flex items-center space-x-2">
                  <Input
                    value={contributor.name}
                    onChange={(e) => updateContributor(category, index, 'name', e.target.value)}
                    placeholder="Contributor name"
                    className="flex-1"
                  />
                  
                  <Select 
                    onValueChange={(role) => addRole(category, index, role)}
                    value=""
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Add role" />
                    </SelectTrigger>
                    <SelectContent>
                      {getRolesByCategory(category).map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {track[category].length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeContributor(category, index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                {contributor.roles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {contributor.roles.map(role => (
                      <Badge key={role} variant="secondary">
                        {role}
                        <button
                          type="button"
                          onClick={() => removeRole(category, index, role)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addContributor(category)}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              {getAddButtonLabel(category)}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ContributorsSection;
