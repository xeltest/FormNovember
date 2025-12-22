<objective>
Implement a sophisticated dual-panel territory selector UI component to replace the existing territory configuration section in ReleaseInfo.tsx (lines 547-659). This new interface will provide users with an intuitive, hierarchical way to select release distribution territories through a left-right split panel design with expandable continents and real-time visual feedback.

The new UI will dramatically improve the user experience for territory selection by providing clear visual organization, instant feedback, and efficient bulk selection capabilities while maintaining full backward compatibility with the existing data structure.
</objective>

<context>
This is a React + TypeScript application using shadcn/ui components and Tailwind CSS. The application is a music release metadata form where users configure distribution territories for their releases. Currently, users select territories through a simple button-based continent selector and dropdown, which becomes unwieldy when managing many territories.

The new dual-panel selector will allow users to see included and excluded territories simultaneously, select entire continents with one click, and search/filter territories efficiently. This is critical for users who need precise control over where their music is distributed.

Technical context:
- Framework: React 18+ with TypeScript
- UI Library: shadcn/ui components
- Styling: Tailwind CSS
- State: Component-level useState (no external state management)
- Data structure: Must remain compatible with existing string[] format

Reference files to examine:
- @src/components/ReleaseInfo.tsx (lines 25-32 for continents data, lines 547-659 for current implementation)
- @src/components/ExportStep.tsx (lines 134-369 for country-to-ISO code mapping)
- @src/pages/Index.tsx (for ReleaseData interface)
</context>

<requirements>
**1. Data Structure & Constants**
- Extract the `countryToISO` mapping from ExportStep.tsx:134-369
- Create new file `./src/constants/territories.ts` with:
  - COUNTRY_CODES object (the extracted mapping)
  - CONTINENTS object (from ReleaseInfo.tsx:25-32)
  - TypeScript interfaces for territory data structures
  - Utility functions for territory operations

**2. Component Architecture**
Create `./src/components/territory/` directory with:
- **types.ts**: TypeScript interfaces and types
- **TerritorySelector.tsx**: Main component that manages state and layout
- **TerritoryPanel.tsx**: Reusable panel component for included/excluded sides
- **TerritoryTree.tsx**: Accordion-based hierarchical tree renderer
- **TerritoryNode.tsx**: Individual selectable node (continent or country) with checkbox

**3. UI Structure**
**Default State:**
- Show "Release worldwide" checkbox (checked by default)
- Hide dual panels when worldwide is checked
- Show panels when worldwide is unchecked (matches current behavior)

**When Panels Visible:**
- Top header showing total territory count badge
- Two equal-width panels (left: Included, right: Excluded)
- Each panel has:
  - Title with count badge ("Included Territories (250 total)" in green, "Excluded Territories (53 total)" in blue)
  - Search input field
  - Scrollable accordion tree
  - (Right panel only) "Select All" checkbox and "Explain the exclusion" link at bottom

**4. Hierarchical Tree Structure**
- Level 1: "Worldwide" node representing all 6 continents
- Level 2: Continent nodes (North America, Europe, Asia, South America, Africa, Oceania)
- Level 3: Individual country nodes with 2-letter ISO codes (e.g., "Lithuania LT", "Cyprus CY")

**5. Selection Behavior**
- Clicking continent checkbox: Toggles ALL countries within that continent
- Clicking country checkbox: Toggles individual country
- When country is toggled, it moves between included/excluded panels
- Checkboxes show indeterminate state when continent is partially selected
- Real-time count updates on all badges

**6. Search Functionality**
- Filter countries and continents by name or country code
- Search is case-insensitive
- Auto-expand continents containing matching countries
- Independent search in each panel

**7. Visual Design**
- Use yellow/amber checkboxes for checked states
- Green badge for included count, blue badge for excluded count
- Display country codes next to country names (e.g., "France FR")
- Smooth accordion animations
- Responsive: Stack panels vertically on mobile (<768px)

**8. Backward Compatibility**
- Component must work with existing ReleaseData interface
- Read from: `data.territories` (string[]), `data.territoryMode` ('include' | 'exclude'), `data.isWorldwide` (boolean)
- Write to: Same structure, no changes to data shape
- All existing functionality must be preserved
</requirements>

<implementation>
**Step 1: Create Territory Constants File**
1. Create `./src/constants/territories.ts`
2. Copy `countryToISO` mapping from ExportStep.tsx:134-369
3. Copy `continents` object from ReleaseInfo.tsx:25-32
4. Export as named constants: `COUNTRY_CODES` and `CONTINENTS`
5. Define TypeScript interfaces for territory structures
6. Create helper functions:
   - `getCountryCode(countryName: string): string` - Returns ISO code for country
   - `getContinentCountries(continent: string): string[]` - Returns country list for continent
   - `getAllCountries(): string[]` - Returns all countries sorted
   - `countTerritories(territories: string[]): number` - Counts territories

**Step 2: Create Type Definitions**
1. Create `./src/components/territory/types.ts`
2. Define interfaces for:
   - `TerritoryNode` (id, name, code, type, children)
   - `TerritoryPanelProps` (territories, onToggle, searchValue, onSearchChange, title, count, side)
   - `TerritoryTreeProps` (nodes, selectedTerritories, onToggle, expandedNodes, onToggleExpand, searchValue)
   - `TerritoryNodeProps` (node, isSelected, isPartiallySelected, onToggle, isExpanded, onToggleExpand)

**Step 3: Build TerritoryNode Component**
1. Create `./src/components/territory/TerritoryNode.tsx`
2. Renders a single node (continent or country) with:
   - Checkbox (yellow when checked, indeterminate for partial selection)
   - Globe icon for continents, flag icon or simple marker for countries
   - Label with country code for countries
   - Expand/collapse arrow for continents
3. Handle click events for checkbox and expand/collapse

**Step 4: Build TerritoryTree Component**
1. Create `./src/components/territory/TerritoryTree.tsx`
2. Use shadcn/ui Accordion component
3. Recursively render TerritoryNode components
4. Filter nodes based on search value
5. Auto-expand nodes containing search matches
6. Show continent count badges (e.g., "Europe (53 Regions)")

**Step 5: Build TerritoryPanel Component**
1. Create `./src/components/territory/TerritoryPanel.tsx`
2. Reusable panel for both included and excluded sides
3. Contains:
   - Header with title and count badge
   - Search input
   - ScrollArea with TerritoryTree
   - (If side === 'excluded') "Select All" checkbox and "Explain the exclusion" link
4. Handle search filtering and selection events

**Step 6: Build TerritorySelector Main Component**
1. Create `./src/components/territory/TerritorySelector.tsx`
2. Manage state:
   - `selectedIncluded: Set<string>` (country names in included panel)
   - `selectedExcluded: Set<string>` (country names in excluded panel)
   - `expandedNodes: Set<string>` (expanded continent IDs)
   - `searchIncluded: string`, `searchExcluded: string`
3. Initialize state from props (data.territories, data.territoryMode)
4. Build territory tree data structure from CONTINENTS
5. Handle territory toggle events (move between included/excluded)
6. Calculate counts in real-time
7. Sync state back to parent onChange

**Step 7: Integrate into ReleaseInfo.tsx**
1. Import TerritorySelector component
2. Replace lines 547-659 with TerritorySelector
3. Pass required props: data, onChange, showValidation
4. Ensure worldwide checkbox still works
5. Test that data flows correctly

**Step 8: Styling & Polish**
1. Match color scheme: yellow checkboxes, green/blue badges
2. Ensure proper spacing and typography
3. Add smooth transitions for expand/collapse
4. Implement responsive layout (stack on mobile)
5. Test keyboard navigation (tab through items, space to toggle)

**Why These Constraints:**
- **Backward compatibility required** because existing releases and exports depend on the current data structure. Breaking changes would invalidate saved data and require database migration.
- **No drag-and-drop for MVP** because it adds complexity without solving the core user need. The checkbox-based selection is more efficient for bulk operations.
- **Search in each panel independently** because users need to quickly find territories in either context without switching modes.
- **Yellow checkboxes** to maintain visual consistency with the reference design and provide strong contrast for selection feedback.
</implementation>

<output>
Create the following new files:

1. `./src/constants/territories.ts` - Territory data constants, country codes, and utility functions
2. `./src/components/territory/types.ts` - TypeScript interfaces and type definitions
3. `./src/components/territory/TerritoryNode.tsx` - Individual node component with checkbox
4. `./src/components/territory/TerritoryTree.tsx` - Accordion tree renderer
5. `./src/components/territory/TerritoryPanel.tsx` - Reusable panel component
6. `./src/components/territory/TerritorySelector.tsx` - Main selector component

Modify existing file:

7. `./src/components/ReleaseInfo.tsx` - Replace territory section (lines 547-659) with TerritorySelector import and usage
</output>

<verification>
Before declaring complete, thoroughly verify:

1. **Data Flow**:
   - Select territories in UI and check data.territories array updates correctly
   - Toggle between include/exclude modes and verify data.territoryMode updates
   - Check that worldwide checkbox properly hides/shows panels

2. **Selection Logic**:
   - Select a continent and verify ALL its countries are selected
   - Deselect individual countries and verify continent shows indeterminate state
   - Move countries between panels and verify they appear/disappear correctly

3. **Search Functionality**:
   - Search for a country by name (e.g., "France") and verify it's found
   - Search by country code (e.g., "FR") and verify it works
   - Verify continents auto-expand when containing search results

4. **Counts**:
   - Verify top count badge shows total territories
   - Verify panel count badges update in real-time
   - Verify continent count badges show correct numbers

5. **Backward Compatibility**:
   - Load the component with existing territory data
   - Verify territories appear in correct panels
   - Verify data structure remains unchanged after selections

6. **Responsive**:
   - Test on mobile viewport (<768px) and verify panels stack vertically
   - Ensure all interactive elements remain accessible

7. **Export Integration**:
   - Fill out complete form and export
   - Verify territory codes appear correctly in exported CSV/Excel
</verification>

<success_criteria>
- All 6 new files created with proper TypeScript types and imports
- ReleaseInfo.tsx successfully updated with TerritorySelector integration
- Worldwide checkbox toggles panel visibility
- Dual panels show included/excluded territories with accurate counts
- Continents expand/collapse and show country lists with ISO codes
- Clicking continent checkbox selects/deselects all countries
- Clicking country checkbox moves it between panels
- Search filters work independently in each panel
- Real-time count updates on all badges
- Data structure remains compatible (territories: string[], territoryMode: 'include'|'exclude')
- Component is fully responsive (stacks on mobile)
- No TypeScript errors or warnings
- No console errors during operation
</success_criteria>
