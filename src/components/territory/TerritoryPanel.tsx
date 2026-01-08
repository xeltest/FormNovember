import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Search, Info } from 'lucide-react';
import TerritoryTree from './TerritoryTree';
import { TerritoryPanelProps } from './types';
import { tooltipContent } from '@/lib/tooltipContent';

const TerritoryPanel: React.FC<TerritoryPanelProps> = ({
  territories,
  onToggle,
  searchValue,
  onSearchChange,
  title,
  count,
  side,
  nodes,
  expandedNodes,
  onToggleExpand,
  tooltipKey,
}) => {
  const badgeVariant = side === 'included' ? 'default' : 'secondary';
  const badgeColor = side === 'included' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600';

  return (
    <div className="flex flex-col h-full border rounded-lg bg-card">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Info className="h-4 w-4" />
                    <span className="sr-only">Information about {title}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p>{tooltipContent[tooltipKey]}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Badge variant={badgeVariant} className={badgeColor}>
            {count} {count === 1 ? 'territory' : 'territories'}
          </Badge>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search territories or codes..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {/* Territory Tree */}
      <ScrollArea className="flex-1 px-2">
        <div className="py-2">
          <TerritoryTree
            nodes={nodes}
            selectedTerritories={territories}
            onToggle={onToggle}
            expandedNodes={expandedNodes}
            onToggleExpand={onToggleExpand}
            searchValue={searchValue}
          />
        </div>
      </ScrollArea>

      {/* Footer - only for excluded panel */}
      {side === 'excluded' && (
        <div className="p-3 border-t bg-muted/30">
          <a
            href="https://support.xelondigital.com/territories"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Why exclude territories?
          </a>
        </div>
      )}
    </div>
  );
};

export default TerritoryPanel;
