import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronRight, ChevronDown, Globe, MapPin } from 'lucide-react';
import { TerritoryNodeComponentProps } from './types';

const TerritoryNode: React.FC<TerritoryNodeComponentProps> = ({
  node,
  isSelected,
  isPartiallySelected,
  onToggle,
  isExpanded,
  onToggleExpand,
  hasChildren,
}) => {
  return (
    <div className="flex items-center space-x-2 py-1.5 px-2 hover:bg-muted/50 rounded-md transition-colors">
      {hasChildren && (
        <button
          onClick={onToggleExpand}
          className="p-0.5 hover:bg-muted rounded transition-colors"
          type="button"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      )}
      {!hasChildren && <div className="w-5" />}

      <Checkbox
        checked={isSelected ? true : isPartiallySelected ? 'indeterminate' : false}
        onCheckedChange={onToggle}
        className={isSelected || isPartiallySelected ? 'data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500 data-[state=indeterminate]:bg-yellow-500 data-[state=indeterminate]:border-yellow-500' : ''}
      />

      {node.type === 'continent' ? (
        <Globe className="w-4 h-4 text-muted-foreground" />
      ) : (
        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
      )}

      <span className="text-sm text-foreground flex-1">
        {node.name}
        {node.code && (
          <span className="ml-2 text-xs text-muted-foreground font-mono">
            {node.code}
          </span>
        )}
      </span>
    </div>
  );
};

export default TerritoryNode;
