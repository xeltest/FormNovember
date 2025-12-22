import React, { useState, useMemo, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ReleaseData } from '@/pages/Index';
import { CONTINENTS, getCountryCode, getTotalCountries } from '@/constants/territories';
import TerritoryPanel from './TerritoryPanel';
import { TerritoryNode } from './types';
import { FieldTooltip } from '@/components/ui/FieldTooltip';

interface TerritorySelectorProps {
  data: ReleaseData;
  onChange: (data: ReleaseData) => void;
  showValidation?: boolean;
}

const TerritorySelector: React.FC<TerritorySelectorProps> = ({
  data,
  onChange,
  showValidation = false,
}) => {
  // Internal state for territories in each panel
  const [includedTerritories, setIncludedTerritories] = useState<Set<string>>(new Set());
  const [excludedTerritories, setExcludedTerritories] = useState<Set<string>>(new Set());

  // Search state for each panel
  const [searchIncluded, setSearchIncluded] = useState('');
  const [searchExcluded, setSearchExcluded] = useState('');

  // Expanded nodes state
  const [expandedIncluded, setExpandedIncluded] = useState<Set<string>>(new Set());
  const [expandedExcluded, setExpandedExcluded] = useState<Set<string>>(new Set());

  // Initialize state from props
  useEffect(() => {
    if (data.isWorldwide) {
      setIncludedTerritories(new Set());
      setExcludedTerritories(new Set());
    } else if (data.territoryMode === 'include') {
      setIncludedTerritories(new Set(data.territories));
      setExcludedTerritories(new Set());
    } else if (data.territoryMode === 'exclude') {
      setIncludedTerritories(new Set());
      setExcludedTerritories(new Set(data.territories));
    }
  }, [data.isWorldwide, data.territoryMode, data.territories]);

  // Build territory tree structure
  const territoryNodes = useMemo((): TerritoryNode[] => {
    return Object.entries(CONTINENTS).map(([continent, countries]) => ({
      id: continent.toLowerCase().replace(/\s+/g, '-'),
      name: continent,
      type: 'continent' as const,
      children: countries.map((country) => ({
        id: `${continent.toLowerCase().replace(/\s+/g, '-')}-${country.toLowerCase().replace(/\s+/g, '-')}`,
        name: country,
        code: getCountryCode(country),
        type: 'country' as const,
      })),
    }));
  }, []);

  // Get nodes for each panel
  const includedNodes = useMemo(() => {
    return territoryNodes.map((continent) => ({
      ...continent,
      children: continent.children?.filter((country) => includedTerritories.has(country.name)),
    })).filter((continent) => (continent.children?.length ?? 0) > 0);
  }, [territoryNodes, includedTerritories]);

  const excludedNodes = useMemo(() => {
    return territoryNodes.map((continent) => ({
      ...continent,
      children: continent.children?.filter((country) => excludedTerritories.has(country.name)),
    })).filter((continent) => (continent.children?.length ?? 0) > 0);
  }, [territoryNodes, excludedTerritories]);

  // Handle worldwide checkbox toggle
  const handleWorldwideChange = (checked: boolean) => {
    onChange({
      ...data,
      isWorldwide: checked,
      territories: [],
      territoryMode: checked ? undefined : 'include',
    });

    if (checked) {
      setIncludedTerritories(new Set());
      setExcludedTerritories(new Set());
    }
  };

  // Handle territory mode toggle
  const handleModeChange = (mode: 'include' | 'exclude') => {
    // When switching modes, swap the territories
    const currentTerritories = mode === 'include' ? excludedTerritories : includedTerritories;

    onChange({
      ...data,
      territoryMode: mode,
      territories: Array.from(currentTerritories),
    });

    if (mode === 'include') {
      setIncludedTerritories(currentTerritories);
      setExcludedTerritories(new Set());
    } else {
      setExcludedTerritories(currentTerritories);
      setIncludedTerritories(new Set());
    }
  };

  // Handle territory toggle in included panel
  const handleIncludedToggle = (territory: string, isContinent: boolean) => {
    const newIncluded = new Set(includedTerritories);

    if (isContinent) {
      // Toggle entire continent
      const continentCountries = CONTINENTS[territory as keyof typeof CONTINENTS] || [];
      const allSelected = continentCountries.every((country) => newIncluded.has(country));

      if (allSelected) {
        // Remove all countries
        continentCountries.forEach((country) => newIncluded.delete(country));
      } else {
        // Add all countries
        continentCountries.forEach((country) => newIncluded.add(country));
      }
    } else {
      // Toggle individual country
      if (newIncluded.has(territory)) {
        newIncluded.delete(territory);
      } else {
        newIncluded.add(territory);
      }
    }

    setIncludedTerritories(newIncluded);

    // Update parent component
    onChange({
      ...data,
      territories: Array.from(newIncluded),
      territoryMode: 'include',
    });
  };

  // Handle territory toggle in excluded panel
  const handleExcludedToggle = (territory: string, isContinent: boolean) => {
    const newExcluded = new Set(excludedTerritories);

    if (isContinent) {
      // Toggle entire continent
      const continentCountries = CONTINENTS[territory as keyof typeof CONTINENTS] || [];
      const allSelected = continentCountries.every((country) => newExcluded.has(country));

      if (allSelected) {
        // Remove all countries
        continentCountries.forEach((country) => newExcluded.delete(country));
      } else {
        // Add all countries
        continentCountries.forEach((country) => newExcluded.add(country));
      }
    } else {
      // Toggle individual country
      if (newExcluded.has(territory)) {
        newExcluded.delete(territory);
      } else {
        newExcluded.add(territory);
      }
    }

    setExcludedTerritories(newExcluded);

    // Update parent component
    onChange({
      ...data,
      territories: Array.from(newExcluded),
      territoryMode: 'exclude',
    });
  };

  const toggleExpandedIncluded = (nodeId: string) => {
    const newExpanded = new Set(expandedIncluded);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedIncluded(newExpanded);
  };

  const toggleExpandedExcluded = (nodeId: string) => {
    const newExpanded = new Set(expandedExcluded);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedExcluded(newExpanded);
  };

  const getTerritoryHelperText = () => {
    if (data.territoryMode === 'include') {
      return "Release will be available ONLY in selected territories";
    }
    return "Release will be available worldwide EXCEPT for selected territories";
  };

  const totalCountries = getTotalCountries();
  const includedCount = includedTerritories.size;
  const excludedCount = excludedTerritories.size;

  return (
    <div className="space-y-4">
      {/* Worldwide Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="worldwide"
          checked={data.isWorldwide}
          onCheckedChange={handleWorldwideChange}
        />
        <Label htmlFor="worldwide" className="mb-0">Release worldwide</Label>
      </div>

      {/* Territory Selection Panels */}
      {!data.isWorldwide && (
        <div className="space-y-4">
          {/* Territory Mode Toggle */}
          <div className="space-y-3">
            <FieldTooltip
              label="Territory Mode:"
              fieldKey="territoryMode"
            />
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-muted rounded-full p-1">
                <div
                  className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all ${
                    data.territoryMode === 'include'
                      ? 'bg-green-500 text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => handleModeChange('include')}
                >
                  Include
                </div>
                <div
                  className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all ${
                    data.territoryMode === 'exclude'
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => handleModeChange('exclude')}
                >
                  Exclude
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{getTerritoryHelperText()}</p>
            </div>
          </div>

          {/* Total Count Badge */}
          <div className="flex items-center justify-center py-2">
            <Badge variant="outline" className="text-sm">
              Total: {totalCountries} territories available
            </Badge>
          </div>

          {/* Dual Panel Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ minHeight: '500px' }}>
            {/* Included Panel */}
            <TerritoryPanel
              territories={includedTerritories}
              onToggle={handleIncludedToggle}
              searchValue={searchIncluded}
              onSearchChange={setSearchIncluded}
              title="Included Territories"
              count={includedCount}
              side="included"
              nodes={data.territoryMode === 'include' ? territoryNodes : includedNodes}
              expandedNodes={expandedIncluded}
              onToggleExpand={toggleExpandedIncluded}
            />

            {/* Excluded Panel */}
            <TerritoryPanel
              territories={excludedTerritories}
              onToggle={handleExcludedToggle}
              searchValue={searchExcluded}
              onSearchChange={setSearchExcluded}
              title="Excluded Territories"
              count={excludedCount}
              side="excluded"
              nodes={data.territoryMode === 'exclude' ? territoryNodes : excludedNodes}
              expandedNodes={expandedExcluded}
              onToggleExpand={toggleExpandedExcluded}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TerritorySelector;
