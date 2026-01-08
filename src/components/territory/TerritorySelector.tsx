import React, { useState, useMemo, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ReleaseData } from '@/pages/Index';
import { CONTINENTS, getCountryCode, getTotalCountries } from '@/constants/territories';
import { FieldTooltip } from '@/components/ui/FieldTooltip';
import TerritoryPanel from './TerritoryPanel';
import { TerritoryNode } from './types';

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
    const allCountries = Object.values(CONTINENTS).flat();

    if (data.isWorldwide) {
      setIncludedTerritories(new Set());
      setExcludedTerritories(new Set());
    } else if (data.territoryMode === 'include') {
      const included = new Set(data.territories);
      const excluded = new Set(allCountries.filter(c => !included.has(c)));
      setIncludedTerritories(included);
      setExcludedTerritories(excluded);
    } else if (data.territoryMode === 'exclude') {
      const excluded = new Set(data.territories);
      const included = new Set(allCountries.filter(c => !excluded.has(c)));
      setIncludedTerritories(included);
      setExcludedTerritories(excluded);
    } else {
      // Default: all territories included when no mode specified
      setIncludedTerritories(new Set(allCountries));
      setExcludedTerritories(new Set());
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

  // Handle worldwide checkbox toggle
  const handleWorldwideChange = (checked: boolean) => {
    if (checked) {
      setIncludedTerritories(new Set());
      setExcludedTerritories(new Set());
      onChange({
        ...data,
        isWorldwide: true,
        territories: [],
        territoryMode: undefined,
      });
    } else {
      // When unchecking worldwide, initialize all territories in Included panel
      const allCountries = Object.values(CONTINENTS).flat();
      const newIncluded = new Set(allCountries);
      setIncludedTerritories(newIncluded);
      setExcludedTerritories(new Set());
      onChange({
        ...data,
        isWorldwide: false,
        territories: allCountries,
        territoryMode: 'include',
      });
    }
  };

  // Handle territory toggle in included panel
  // When unchecking, move to excluded panel
  const handleIncludedToggle = (territory: string, isContinent: boolean) => {
    const newIncluded = new Set(includedTerritories);
    const newExcluded = new Set(excludedTerritories);

    if (isContinent) {
      // Toggle entire continent
      const continentCountries = CONTINENTS[territory as keyof typeof CONTINENTS] || [];
      const allSelected = continentCountries.every((country) => newIncluded.has(country));

      if (allSelected) {
        // Move all countries from included to excluded
        continentCountries.forEach((country) => {
          newIncluded.delete(country);
          newExcluded.add(country);
        });
      } else {
        // Move all countries from excluded to included
        continentCountries.forEach((country) => {
          newExcluded.delete(country);
          newIncluded.add(country);
        });
      }
    } else {
      // Toggle individual country
      if (newIncluded.has(territory)) {
        // Move from included to excluded
        newIncluded.delete(territory);
        newExcluded.add(territory);
      } else {
        // Move from excluded to included
        newExcluded.delete(territory);
        newIncluded.add(territory);
      }
    }

    setIncludedTerritories(newIncluded);
    setExcludedTerritories(newExcluded);

    // Smart export logic: use whichever list is shorter
    const includedCount = newIncluded.size;
    const excludedCount = newExcluded.size;
    const territoryMode = includedCount <= excludedCount ? 'include' : 'exclude';
    const territories = territoryMode === 'include' ? Array.from(newIncluded) : Array.from(newExcluded);

    // Update parent component
    onChange({
      ...data,
      territories,
      territoryMode,
    });
  };

  // Handle territory toggle in excluded panel
  // When unchecking, move to included panel
  const handleExcludedToggle = (territory: string, isContinent: boolean) => {
    const newIncluded = new Set(includedTerritories);
    const newExcluded = new Set(excludedTerritories);

    if (isContinent) {
      // Toggle entire continent
      const continentCountries = CONTINENTS[territory as keyof typeof CONTINENTS] || [];
      const allSelected = continentCountries.every((country) => newExcluded.has(country));

      if (allSelected) {
        // Move all countries from excluded to included
        continentCountries.forEach((country) => {
          newExcluded.delete(country);
          newIncluded.add(country);
        });
      } else {
        // Move all countries from included to excluded
        continentCountries.forEach((country) => {
          newIncluded.delete(country);
          newExcluded.add(country);
        });
      }
    } else {
      // Toggle individual country
      if (newExcluded.has(territory)) {
        // Move from excluded to included
        newExcluded.delete(territory);
        newIncluded.add(territory);
      } else {
        // Move from included to excluded
        newIncluded.delete(territory);
        newExcluded.add(territory);
      }
    }

    setIncludedTerritories(newIncluded);
    setExcludedTerritories(newExcluded);

    // Smart export logic: use whichever list is shorter
    const includedCount = newIncluded.size;
    const excludedCount = newExcluded.size;
    const territoryMode = includedCount <= excludedCount ? 'include' : 'exclude';
    const territories = territoryMode === 'include' ? Array.from(newIncluded) : Array.from(newExcluded);

    // Update parent component
    onChange({
      ...data,
      territories,
      territoryMode,
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
        <div className="flex-1">
          <FieldTooltip
            label="Release worldwide"
            fieldKey="releaseWorldwide"
            htmlFor="worldwide"
          />
        </div>
      </div>

      {/* Territory Selection Panels */}
      {!data.isWorldwide && (
        <div className="space-y-4">
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
              nodes={territoryNodes}
              expandedNodes={expandedIncluded}
              onToggleExpand={toggleExpandedIncluded}
              tooltipKey="includedTerritories"
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
              nodes={territoryNodes}
              expandedNodes={expandedExcluded}
              onToggleExpand={toggleExpandedExcluded}
              tooltipKey="excludedTerritories"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TerritorySelector;
