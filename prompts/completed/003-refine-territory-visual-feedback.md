<objective>
Enhance the territory selector to show all territories in both panels simultaneously with clear visual feedback, and implement smart export logic that automatically uses the shortest territory list for optimal data efficiency.

This refinement will transform the territory selector from a "move between panels" system to a true "dual-view" system where users can always see which territories are included and which are excluded, making territory management intuitive and export data minimal.
</objective>

<context>
The territory selector currently moves territories between panels when toggled, but this creates a visibility problem: when you uncheck "Hungary" from Included, it disappears from that panel with no immediate visual feedback showing it's now excluded. Users must search in the Excluded panel to confirm the change.

The desired experience is more like a dual-view checkbox list where:
- BOTH panels show ALL territories at all times
- Checkboxes in each panel reflect whether territories belong to that panel
- Toggling is visual and instant (checking in one panel unchecks in the other)
- Export uses whichever list (included or excluded) is shorter

This is a React + TypeScript application using shadcn/ui components for managing music release distribution territories.

Files currently involved:
- @src/components/territory/TerritorySelector.tsx (state management, export logic)
- @src/components/territory/TerritoryPanel.tsx (panel rendering)
- @src/components/territory/TerritoryTree.tsx (tree rendering with checkboxes)
- @src/constants/territories.ts (territory data)
</context>

<requirements>
**1. Show All Territories in Both Panels**

Both the Included and Excluded panels must show the FULL territory tree at all times.

Current broken behavior:
- Included panel shows only included territories ❌
- Excluded panel shows only excluded territories ❌
- User can't see the full picture

Expected correct behavior:
- Included panel shows ALL territories, with included ones checked ✅
- Excluded panel shows ALL territories, with excluded ones checked ✅
- User can see the complete state at a glance

**2. Mutual Exclusivity with Visual Feedback**

Territories are mutually exclusive - a territory is either included OR excluded, never both, never neither.

Visual behavior:
- Default state (worldwide unchecked):
  * Included panel: All territories checked ✓
  * Excluded panel: All territories unchecked ☐

- User unchecks "Hungary" in Included panel:
  * Included panel: Hungary changes to unchecked ☐
  * Excluded panel: Hungary changes to checked ✓
  * User immediately sees Hungary is now excluded

- User checks "France" in Excluded panel:
  * Excluded panel: France changes to unchecked ☐
  * Included panel: France changes to checked ✓
  * User immediately sees France is now included

**3. Continent-Level Toggling**

Continent checkboxes should show aggregate state and toggle all children:

- Indeterminate state (◐): Some children included, some excluded
- Checked state (✓): All children in this panel
- Unchecked state (☐): No children in this panel

When toggling a continent:
- If unchecking "Europe" from Included → All European countries move to Excluded
- Visual feedback immediate in both panels

**4. Smart Export Logic - Use Shortest List**

The export logic should automatically determine whether to use "include" or "exclude" mode based on which list is shorter.

Current behavior:
- Uses whichever panel has territories ❌
- May export unnecessarily long lists

Expected behavior:
- Count included territories: `includedCount`
- Count excluded territories: `excludedCount`
- If `includedCount < excludedCount`:
  * Set `territoryMode = 'include'`
  * Set `territories = Array.from(includedTerritories)`
  * Export these codes to "Territory" column
- If `excludedCount < includedCount`:
  * Set `territoryMode = 'exclude'`
  * Set `territories = Array.from(excludedTerritories)`
  * Export these codes to "Excluded Territory" column
- If equal: Default to 'include' mode

This minimizes export data size and is more efficient.

**5. Search Functionality**

Search must work independently in both panels and filter the full tree:
- Searching "France" in Included panel shows France (with checkbox reflecting its state)
- Searching "France" in Excluded panel shows France (with checkbox reflecting its state)
- Search filters the visible tree but doesn't change checkbox logic
</requirements>

<examples>
**Scenario A: Release Only in Australia and New Zealand**

1. Start state (worldwide unchecked):
   - Included: All territories checked
   - Excluded: All territories unchecked

2. User unchecks "Oceania" continent in Included panel:
   - Included: Oceania and all its children become unchecked
   - Excluded: Oceania and all its children become checked

3. User checks "Australia" in Excluded panel:
   - Excluded: Australia becomes unchecked
   - Included: Australia becomes checked

4. User checks "New Zealand" in Excluded panel:
   - Excluded: New Zealand becomes unchecked
   - Included: New Zealand becomes checked

5. Final visual state:
   - Included: Only Australia and New Zealand checked (everything else unchecked)
   - Excluded: Everything except Australia and New Zealand checked

6. Export logic:
   - `includedCount = 2` (AU, NZ)
   - `excludedCount = ~250` (all others)
   - Since 2 < 250: `territoryMode = 'include'`, `territories = ['Australia', 'New Zealand']`
   - CSV/Excel: "Territory" column = "AU/NZ", "Excluded Territory" column = empty

**Scenario B: Worldwide Except US, Canada, Mexico**

1. Start state (worldwide unchecked):
   - Included: All territories checked
   - Excluded: All territories unchecked

2. User unchecks "United States" in Included panel:
   - Included: US becomes unchecked
   - Excluded: US becomes checked

3. User unchecks "Canada" in Included panel:
   - Included: Canada becomes unchecked
   - Excluded: Canada becomes checked

4. User unchecks "Mexico" in Included panel:
   - Included: Mexico becomes unchecked
   - Excluded: Mexico becomes checked

5. Final visual state:
   - Included: Everything except US/CA/MX checked
   - Excluded: Only US/CA/MX checked

6. Export logic:
   - `includedCount = ~249` (all except US/CA/MX)
   - `excludedCount = 3` (US, CA, MX)
   - Since 3 < 249: `territoryMode = 'exclude'`, `territories = ['United States', 'Canada', 'Mexico']`
   - CSV/Excel: "Territory" column = empty, "Excluded Territory" column = "US/CA/MX"
</examples>

<implementation>
**Step 1: Modify TerritorySelector.tsx - Always Pass Full Tree**

1. Read @src/components/territory/TerritorySelector.tsx
2. Remove any filtering logic that limits which territories are passed to each panel
3. Both panels should always receive `territoryNodes` (the complete territory tree)
4. Update the panel props:
   ```typescript
   <TerritoryPanel
     side="included"
     nodes={territoryNodes}  // Full tree, not filtered
     selectedTerritories={includedTerritories}  // Pass the Set for checkbox state
     // ... other props
   />

   <TerritoryPanel
     side="excluded"
     nodes={territoryNodes}  // Full tree, not filtered
     selectedTerritories={excludedTerritories}  // Pass the Set for checkbox state
     // ... other props
   />
   ```

**Step 2: Modify TerritorySelector.tsx - Implement Smart Export Logic**

1. Find where `onChange` is called to update parent component
2. Add logic to count territories and choose the shorter list:
   ```typescript
   // Count territories in each panel
   const includedCount = includedTerritories.size;
   const excludedCount = excludedTerritories.size;

   // Use the shorter list for export
   const territoryMode = includedCount <= excludedCount ? 'include' : 'exclude';
   const territories = territoryMode === 'include'
     ? Array.from(includedTerritories)
     : Array.from(excludedTerritories);

   onChange({
     ...data,
     territories,
     territoryMode,
     isWorldwide: data.isWorldwide
   });
   ```
3. This ensures export always uses the minimal data set

**Step 3: Modify TerritoryTree.tsx - Checkbox State from Props**

1. Read @src/components/territory/TerritoryTree.tsx
2. Update the component to determine checkbox state based on the `selectedTerritories` Set passed from parent:
   ```typescript
   interface TerritoryTreeProps {
     nodes: TerritoryNode[];
     selectedTerritories: Set<string>;  // Which territories are checked in THIS panel
     side: 'included' | 'excluded';
     // ... other props
   }
   ```
3. When rendering each node, check if it's in the Set:
   ```typescript
   const isChecked = selectedTerritories.has(territory.name);
   ```
4. For continents, calculate indeterminate state:
   ```typescript
   const childrenInSet = continent.children.filter(c => selectedTerritories.has(c.name)).length;
   const isIndeterminate = childrenInSet > 0 && childrenInSet < continent.children.length;
   const isChecked = childrenInSet === continent.children.length;
   ```

**Step 4: Modify TerritoryPanel.tsx - Accept Full Tree**

1. Read @src/components/territory/TerritoryPanel.tsx
2. Update props to accept full tree and selected set:
   ```typescript
   interface TerritoryPanelProps {
     side: 'included' | 'excluded';
     nodes: TerritoryNode[];  // Full tree always
     selectedTerritories: Set<string>;  // Which ones are checked
     onToggle: (territory: string, side: 'included' | 'excluded') => void;
     // ... other props
   }
   ```
3. Pass these props down to TerritoryTree
4. Remove any filtering logic - show all territories always

**Step 5: Update Toggle Logic in TerritorySelector.tsx**

1. The toggle handlers should flip the territory between Sets:
   ```typescript
   const handleIncludedToggle = (territoryName: string) => {
     const newIncluded = new Set(includedTerritories);
     const newExcluded = new Set(excludedTerritories);

     if (newIncluded.has(territoryName)) {
       // Moving from included to excluded
       newIncluded.delete(territoryName);
       newExcluded.add(territoryName);
     } else {
       // Moving from excluded to included
       newIncluded.add(territoryName);
       newExcluded.delete(territoryName);
     }

     setIncludedTerritories(newIncluded);
     setExcludedTerritories(newExcluded);
     // Call onChange with smart export logic
   };
   ```
2. Mirror logic for `handleExcludedToggle`
3. Continent toggling should move all children

**Step 6: Verify Default State**

Ensure initialization logic sets:
- When worldwide is unchecked:
  - `includedTerritories`: Set of ALL territory names
  - `excludedTerritories`: Empty Set
- This makes all checkboxes start checked in Included, unchecked in Excluded

**Why These Changes Matter:**
- **Dual visibility** allows users to see the complete picture at all times without hunting for territories
- **Instant visual feedback** makes the system intuitive - users immediately see the effect of their actions
- **Smart export logic** minimizes data size and makes the export more efficient
- **Checkbox-based interaction** is familiar and predictable for users
</implementation>

<output>
Modify existing files:

1. `./src/components/territory/TerritorySelector.tsx` - Remove filtering, implement smart export logic, update panel props
2. `./src/components/territory/TerritoryPanel.tsx` - Accept full tree and selected set, remove filtering
3. `./src/components/territory/TerritoryTree.tsx` - Determine checkbox state from selectedTerritories Set

No new files needed - this is a refinement of existing components.
</output>

<verification>
Before declaring complete, thoroughly verify:

**1. Dual Panel Visibility**
- Uncheck worldwide
- ✅ Verify Included panel shows ALL territories (all checked by default)
- ✅ Verify Excluded panel shows ALL territories (all unchecked by default)
- Uncheck "Hungary" in Included
- ✅ Verify Hungary remains visible in Included (now unchecked)
- ✅ Verify Hungary remains visible in Excluded (now checked)

**2. Visual Feedback**
- Uncheck a territory in Included panel
- ✅ Verify it immediately becomes unchecked in Included
- ✅ Verify it immediately becomes checked in Excluded
- Check a territory in Excluded panel
- ✅ Verify it immediately becomes unchecked in Excluded
- ✅ Verify it immediately becomes checked in Included

**3. Continent-Level Toggling**
- Uncheck "Europe" continent in Included
- ✅ Verify ALL European countries become unchecked in Included
- ✅ Verify ALL European countries become checked in Excluded
- ✅ Verify continent checkbox shows correct state (checked/unchecked/indeterminate)

**4. Search Functionality**
- Search for "France" in Included panel
- ✅ Verify France appears with correct checkbox state
- Search for "France" in Excluded panel
- ✅ Verify France appears with correct checkbox state
- ✅ Verify searching doesn't affect checkbox logic

**5. Smart Export Logic - Scenario A (Few Included)**
- Set up: Only Australia and New Zealand included
- Check data passed to onChange:
  * ✅ `territoryMode === 'include'`
  * ✅ `territories === ['Australia', 'New Zealand']`
- Export and verify:
  * ✅ "Territory" column contains AU/NZ codes
  * ✅ "Excluded Territory" column is empty

**6. Smart Export Logic - Scenario B (Few Excluded)**
- Set up: Only US, Canada, Mexico excluded
- Check data passed to onChange:
  * ✅ `territoryMode === 'exclude'`
  * ✅ `territories === ['United States', 'Canada', 'Mexico']`
- Export and verify:
  * ✅ "Territory" column is empty
  * ✅ "Excluded Territory" column contains US/CA/MX codes

**7. No Regressions**
- ✅ Worldwide checkbox still works
- ✅ Count badges update correctly in both panels
- ✅ No TypeScript errors
- ✅ No console errors
- ✅ Application builds successfully
</verification>

<success_criteria>
- Both panels show ALL territories at all times (complete tree visible)
- Checkboxes in Included panel reflect which territories are included (checked = included)
- Checkboxes in Excluded panel reflect which territories are excluded (checked = excluded)
- Toggling a checkbox in one panel immediately updates the checkbox in the other panel
- Continent checkboxes show indeterminate state when partially selected
- Export logic counts territories and uses the shorter list
- territoryMode is set to 'include' when fewer territories are included
- territoryMode is set to 'exclude' when fewer territories are excluded
- Search filters the visible tree in each panel independently
- Default state shows all territories checked in Included, unchecked in Excluded
- No TypeScript errors or warnings
- No console errors during operation
- Build succeeds
- Export produces minimal data (shortest list of territories)
</success_criteria>
