import React, { useMemo } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import TerritoryNode from './TerritoryNode';
import { TerritoryTreeProps, TerritoryNode as TerritoryNodeType } from './types';

const TerritoryTree: React.FC<TerritoryTreeProps> = ({
  nodes,
  selectedTerritories,
  onToggle,
  expandedNodes,
  onToggleExpand,
  searchValue,
}) => {
  // Filter nodes based on search
  const filteredNodes = useMemo(() => {
    if (!searchValue.trim()) return nodes;

    const search = searchValue.toLowerCase();
    return nodes
      .map((continent) => {
        const matchingChildren = continent.children?.filter(
          (country) =>
            country.name.toLowerCase().includes(search) ||
            country.code?.toLowerCase().includes(search)
        );

        const continentMatches = continent.name.toLowerCase().includes(search);

        if (continentMatches || (matchingChildren && matchingChildren.length > 0)) {
          return {
            ...continent,
            children: matchingChildren && matchingChildren.length > 0 ? matchingChildren : continent.children,
          };
        }

        return null;
      })
      .filter((node): node is TerritoryNodeType => node !== null);
  }, [nodes, searchValue]);

  // Auto-expand continents with search matches
  React.useEffect(() => {
    if (searchValue.trim()) {
      filteredNodes.forEach((continent) => {
        if (!expandedNodes.has(continent.id)) {
          onToggleExpand(continent.id);
        }
      });
    }
  }, [searchValue, filteredNodes, expandedNodes, onToggleExpand]);

  const isNodeSelected = (node: TerritoryNodeType): boolean => {
    if (node.type === 'country') {
      return selectedTerritories.has(node.name);
    }
    // For continents, check if all children are selected
    return node.children?.every((child) => selectedTerritories.has(child.name)) ?? false;
  };

  const isNodePartiallySelected = (node: TerritoryNodeType): boolean => {
    if (node.type === 'country') return false;

    const children = node.children || [];
    const selectedCount = children.filter((child) => selectedTerritories.has(child.name)).length;

    return selectedCount > 0 && selectedCount < children.length;
  };

  const handleNodeToggle = (node: TerritoryNodeType) => {
    const isContinent = node.type === 'continent';
    onToggle(node.name, isContinent);
  };

  if (filteredNodes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">No territories found</p>
      </div>
    );
  }

  return (
    <Accordion
      type="multiple"
      value={Array.from(expandedNodes)}
      onValueChange={(values) => {
        // Determine which node was toggled
        const currentExpanded = Array.from(expandedNodes);
        const added = values.find((v) => !currentExpanded.includes(v));
        const removed = currentExpanded.find((v) => !values.includes(v));

        if (added) onToggleExpand(added);
        if (removed) onToggleExpand(removed);
      }}
      className="w-full"
    >
      {filteredNodes.map((continent) => (
        <AccordionItem key={continent.id} value={continent.id} className="border-b">
          <div className="flex items-center">
            <AccordionTrigger className="flex-1 py-2 px-1 hover:no-underline">
              <div className="flex items-center justify-between w-full pr-2">
                <TerritoryNode
                  node={continent}
                  isSelected={isNodeSelected(continent)}
                  isPartiallySelected={isNodePartiallySelected(continent)}
                  onToggle={() => handleNodeToggle(continent)}
                  isExpanded={expandedNodes.has(continent.id)}
                  onToggleExpand={() => onToggleExpand(continent.id)}
                  hasChildren={true}
                />
                <Badge variant="secondary" className="ml-2 text-xs">
                  {continent.children?.length || 0}
                </Badge>
              </div>
            </AccordionTrigger>
          </div>
          <AccordionContent className="pb-2">
            <div className="ml-6 space-y-0.5">
              {continent.children?.map((country) => (
                <TerritoryNode
                  key={country.id}
                  node={country}
                  isSelected={isNodeSelected(country)}
                  isPartiallySelected={false}
                  onToggle={() => handleNodeToggle(country)}
                  isExpanded={false}
                  onToggleExpand={() => {}}
                  hasChildren={false}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default TerritoryTree;
