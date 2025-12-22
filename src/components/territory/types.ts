// TypeScript interfaces and types for territory selector components

export type TerritoryNodeType = 'continent' | 'country';

export interface TerritoryNode {
  id: string;
  name: string;
  code?: string; // ISO code for countries
  type: TerritoryNodeType;
  children?: TerritoryNode[];
}

export interface TerritoryPanelProps {
  territories: Set<string>;
  onToggle: (territory: string, isContinent: boolean) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  title: string;
  count: number;
  side: 'included' | 'excluded';
  nodes: TerritoryNode[];
  expandedNodes: Set<string>;
  onToggleExpand: (nodeId: string) => void;
}

export interface TerritoryTreeProps {
  nodes: TerritoryNode[];
  selectedTerritories: Set<string>;
  onToggle: (territory: string, isContinent: boolean) => void;
  expandedNodes: Set<string>;
  onToggleExpand: (nodeId: string) => void;
  searchValue: string;
}

export interface TerritoryNodeComponentProps {
  node: TerritoryNode;
  isSelected: boolean;
  isPartiallySelected: boolean;
  onToggle: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  hasChildren: boolean;
}
