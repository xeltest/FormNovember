import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X, ChevronRight } from 'lucide-react';
import { GENRES, GenreNode, findGenreByLabel } from '@/constants/genres';
import { FieldTooltip } from '@/components/ui/FieldTooltip';

interface GenreSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  id?: string;
  showTooltip?: boolean;
}

export const GenreSelector: React.FC<GenreSelectorProps> = ({
  value,
  onValueChange,
  label = 'Genre',
  placeholder = 'Select genre',
  id,
  showTooltip = false
}) => {
  const [level1Selection, setLevel1Selection] = useState<string>('');
  const [level2Selection, setLevel2Selection] = useState<string>('');
  const [level3Selection, setLevel3Selection] = useState<string>('');

  const [level2Options, setLevel2Options] = useState<GenreNode[]>([]);
  const [level3Options, setLevel3Options] = useState<GenreNode[]>([]);
  const [displayPath, setDisplayPath] = useState<string>('');

  // Parse the current value and set selections
  useEffect(() => {
    if (!value) {
      setLevel1Selection('');
      setLevel2Selection('');
      setLevel3Selection('');
      setLevel2Options([]);
      setLevel3Options([]);
      setDisplayPath('');
      return;
    }

    // Find the genre anywhere in the tree (handles both "Tech House" and "Electronic > House > Tech House")
    const result = findGenreByLabel(value);

    if (!result) {
      // Genre not found, reset
      setLevel1Selection('');
      setLevel2Selection('');
      setLevel3Selection('');
      setLevel2Options([]);
      setLevel3Options([]);
      setDisplayPath('');
      return;
    }

    // Set display path for breadcrumb
    setDisplayPath(result.path.join(' > '));

    // Set selections based on hierarchy depth
    const selections = result.parentSelections;

    if (selections.length >= 1) {
      const level1 = selections[0];
      setLevel1Selection(level1.id);

      const level1Genre = GENRES.find(g => g.id === level1.id);
      if (level1Genre?.children) {
        setLevel2Options(level1Genre.children);
      }

      if (selections.length >= 2) {
        const level2 = selections[1];
        setLevel2Selection(level2.id);

        const level2Genre = level1Genre?.children?.find(g => g.id === level2.id);
        if (level2Genre?.children) {
          setLevel3Options(level2Genre.children);
        }

        if (selections.length >= 3) {
          const level3 = selections[2];
          setLevel3Selection(level3.id);
        }
      }
    }
  }, [value]);

  // Get the leaf node label from current selections
  const getLeafLabel = (l1: string, l2: string, l3: string): string => {
    const level1Genre = GENRES.find(g => g.id === l1);
    if (!level1Genre) return '';

    if (l2 && level1Genre.children) {
      const level2Genre = level1Genre.children.find(g => g.id === l2);
      if (level2Genre) {
        if (l3 && level2Genre.children) {
          const level3Genre = level2Genre.children.find(g => g.id === l3);
          if (level3Genre) {
            return level3Genre.label; // Return only leaf label
          }
        }
        return level2Genre.label; // Return only leaf label
      }
    }

    return level1Genre.label; // Return only leaf label
  };

  // Handle level 1 selection
  const handleLevel1Change = (genreId: string) => {
    setLevel1Selection(genreId);
    setLevel2Selection('');
    setLevel3Selection('');
    setLevel3Options([]);

    const selectedGenre = GENRES.find(g => g.id === genreId);
    if (selectedGenre?.children && selectedGenre.children.length > 0) {
      setLevel2Options(selectedGenre.children);
    } else {
      setLevel2Options([]);
    }
    // Always emit the selected genre label immediately
    onValueChange(selectedGenre?.label || '');
  };

  // Handle level 2 selection
  const handleLevel2Change = (genreId: string) => {
    setLevel2Selection(genreId);
    setLevel3Selection('');

    const selectedLevel2 = level2Options.find(g => g.id === genreId);
    if (selectedLevel2?.children && selectedLevel2.children.length > 0) {
      setLevel3Options(selectedLevel2.children);
    } else {
      setLevel3Options([]);
    }
    // Always emit the selected genre label immediately
    onValueChange(selectedLevel2?.label || '');
  };

  // Handle level 3 selection
  const handleLevel3Change = (genreId: string) => {
    setLevel3Selection(genreId);
    const selectedLevel3 = level3Options.find(g => g.id === genreId);
    // Emit only the leaf label
    onValueChange(selectedLevel3?.label || '');
  };

  // Clear selection
  const handleClear = () => {
    setLevel1Selection('');
    setLevel2Selection('');
    setLevel3Selection('');
    setLevel2Options([]);
    setLevel3Options([]);
    setDisplayPath('');
    onValueChange('');
  };

  return (
    <div className="space-y-3">
      {label && !showTooltip && (
        <Label htmlFor={id || 'genre-selector'} className="mb-3 block">{label}</Label>
      )}
      {label && showTooltip && (
        <FieldTooltip
          label={label.replace(' *', '')}
          fieldKey={id === 'albumGenre' ? 'albumGenre' : 'trackGenre'}
          htmlFor={id || 'genre-selector'}
          required={label.includes('*')}
        />
      )}

      {/* Current selection breadcrumb - shows full path for context */}
      {displayPath && (
        <div className="flex items-center gap-2 text-sm bg-muted px-3 py-2 rounded-md">
          <span className="flex-1 flex items-center gap-1 text-muted-foreground">
            {displayPath.split(' > ').map((part, index, arr) => (
              <React.Fragment key={index}>
                <span className="font-medium text-foreground">{part}</span>
                {index < arr.length - 1 && (
                  <ChevronRight className="h-3 w-3" />
                )}
              </React.Fragment>
            ))}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Level 1: Parent Genre */}
      <div className="space-y-2">
        <Select value={level1Selection} onValueChange={handleLevel1Change}>
          <SelectTrigger id={id || 'genre-selector'}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {GENRES.map(genre => (
              <SelectItem key={genre.id} value={genre.id}>
                {genre.label}
                {genre.children && genre.children.length > 0 && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({genre.children.length} subgenres)
                  </span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Level 2: Subgenre */}
      {level2Options.length > 0 && (
        <div className="pl-4 border-l-2 border-muted">
          <Select value={level2Selection} onValueChange={handleLevel2Change}>
            <SelectTrigger>
              <SelectValue placeholder="Select subgenre (optional)" />
            </SelectTrigger>
            <SelectContent>
              {level2Options.map(genre => (
                <SelectItem key={genre.id} value={genre.id}>
                  {genre.label}
                  {genre.children && genre.children.length > 0 && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({genre.children.length} sub-subgenres)
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Level 3: Sub-subgenre */}
      {level3Options.length > 0 && (
        <div className="pl-8 border-l-2 border-muted">
          <Select value={level3Selection} onValueChange={handleLevel3Change}>
            <SelectTrigger>
              <SelectValue placeholder="Select sub-subgenre (optional)" />
            </SelectTrigger>
            <SelectContent>
              {level3Options.map(genre => (
                <SelectItem key={genre.id} value={genre.id}>
                  {genre.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
