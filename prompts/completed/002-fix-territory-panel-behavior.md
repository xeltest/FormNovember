<objective>
Fix critical interaction issues in the territory selector component to ensure territories properly move between included/excluded panels, remove redundant UI controls, and separate checkbox selection from expand/collapse actions.

These fixes will make the territory selector behave as a true dual-panel system where territories are always checked on exactly one side, creating an intuitive "move between panels" experience without confusing mode toggles or conflated interactions.
</objective>

<context>
The territory selector was recently implemented with a dual-panel design (left: Included, right: Excluded), but has three critical issues that break the intended user experience:

1. **Broken panel movement**: When unchecking a territory, it just disappears instead of moving to the opposite panel
2. **Redundant controls**: The Include/Exclude mode toggle is still present, but the dual-panel system IS the mode selector
3. **Conflated interactions**: Clicking a checkbox might also expand/collapse the continent tree

The component is used in a React + TypeScript application with shadcn/ui components for managing music release distribution territories.

Files currently involved:
- @src/components/territory/TerritorySelector.tsx (main component with state management)
- @src/components/territory/TerritoryTree.tsx (accordion tree renderer)
- @src/components/territory/TerritoryNode.tsx (individual checkbox nodes)
- @src/pages/Index.tsx (ReleaseData interface definition)
</context>

<requirements>
**1. Fix Territory Movement Between Panels**

Territories must ALWAYS be checked on exactly one side (included OR excluded), never on both, never on neither.

Current broken behavior:
- Uncheck "Hungary" from Included → Hungary disappears entirely ❌

Expected correct behavior:
- Uncheck "Hungary" from Included → Hungary immediately appears checked in Excluded ✅
- Uncheck "Europe" continent from Included → All European countries immediately appear checked in Excluded ✅
- Check "France" in Excluded → France immediately moves to Included (unchecked in Excluded) ✅

This creates a true "move between panels" behavior where checking/unchecking a territory transfers it to the opposite panel.

**2. Remove Include/Exclude Mode Toggle**

The dual-panel system IS the include/exclude mechanism. The old mode toggle is redundant and confusing.

Remove from UI:
- Territory mode pill toggle (the Include/Exclude green/red buttons)
- Helper text explaining "Release will be available ONLY in..." or "...EXCEPT for..."
- Any UI that suggests there's a "mode" to switch

Keep only:
- Dual panels (left: Included, right: Excluded)
- Worldwide checkbox
- The panels themselves indicate the mode visually

**3. Derive Territory Mode from Panel State**

For backward compatibility with `data.territoryMode ('include' | 'exclude')`:
- If left panel (Included) has territories → set `data.territoryMode = 'include'`
- If right panel (Excluded) has territories → set `data.territoryMode = 'exclude'`
- Never allow both panels to have territories simultaneously
- `data.territories` should contain the selected territories from whichever panel is active

**4. Separate Checkbox Click from Expand/Collapse**

Currently, clicking a checkbox might also expand/collapse the continent. These must be completely independent actions.

Correct behavior:
- Clicking the **checkbox**: ONLY toggles selection, moves territory between panels, does NOT expand/collapse
- Clicking the **expand/collapse arrow**: ONLY expands/collapses the accordion, does NOT toggle selection
- Clicking the **label text**: Should do nothing, or optionally expand/collapse (but NOT toggle selection)

This prevents accidental expansions when users just want to select/deselect.
</requirements>

<implementation>
**Step 1: Modify TerritorySelector.tsx - Fix State Management**

1. Read @src/components/territory/TerritorySelector.tsx
2. Understand current state structure and initialization logic
3. Modify the toggle/selection logic:
   - When a territory is checked in one panel, it must be unchecked in the other panel
   - Implement "move between panels" behavior:
     - `handleToggleTerritory(territory: string, fromPanel: 'included' | 'excluded')`
     - If fromPanel is 'included' and territory is currently in included:
       - Remove from included panel
       - Add to excluded panel
     - If fromPanel is 'excluded' and territory is currently in excluded:
       - Remove from excluded panel
       - Add to included panel
4. Handle continent-level toggles:
   - When toggling a continent, move ALL its countries between panels
   - Maintain the "always checked on one side" rule for all countries
5. Derive `territoryMode` automatically:
   - Don't use a mode state variable
   - Calculate mode based on which panel has territories:
     ```typescript
     const territoryMode = includedTerritories.size > 0 ? 'include' : 'exclude';
     ```
6. Update `onChange` callback to pass derived mode to parent:
   ```typescript
   onChange({
     ...data,
     territories: Array.from(territoryMode === 'include' ? includedTerritories : excludedTerritories),
     territoryMode: territoryMode
   });
   ```

**Step 2: Remove Mode Toggle UI from TerritorySelector.tsx**

1. Find and remove the territory mode toggle UI elements:
   - The pill-style Include/Exclude toggle buttons
   - The `getTerritoryHelperText()` function (if it exists)
   - Any state variables related to mode selection (we'll derive it instead)
   - The helper text paragraph explaining include/exclude behavior
2. Remove associated event handlers for mode switching
3. Update the component to always show both panels (no mode-based hiding)
4. Ensure the visual design remains clean without the toggle

**Step 3: Modify TerritoryNode.tsx - Separate Click Handlers**

1. Read @src/components/territory/TerritoryNode.tsx
2. Ensure checkbox and expand/collapse have separate event handlers:
   ```typescript
   // Checkbox handler - ONLY toggles selection
   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     e.stopPropagation(); // Prevent event bubbling
     onToggle(node.id);
   };

   // Expand/collapse handler - ONLY toggles expansion
   const handleExpandToggle = (e: React.MouseEvent) => {
     e.stopPropagation(); // Prevent event bubbling
     onToggleExpand(node.id);
   };
   ```
3. Ensure these handlers are attached to separate clickable areas:
   - Checkbox: attached to the Checkbox component only
   - Expand arrow: attached to the expand/collapse button/icon only
   - Label: should NOT trigger checkbox toggle (can optionally trigger expand/collapse)
4. Add `stopPropagation()` to prevent click events from bubbling and causing double actions

**Step 4: Update TerritoryTree.tsx if Needed**

1. Read @src/components/territory/TerritoryTree.tsx
2. Verify that toggle events are properly separated
3. Ensure the tree component correctly passes separate handlers to TerritoryNode:
   - `onToggle` for checkbox selection
   - `onToggleExpand` for accordion expand/collapse
4. Update any logic that might conflate these two actions

**Step 5: Verify Default Behavior**

Ensure the component initializes correctly:
1. On mount with `isWorldwide: true`:
   - Worldwide checkbox is checked
   - Both panels are hidden
   - No territories in either panel
2. When unchecking worldwide:
   - All territories appear in Included panel (left)
   - Excluded panel is empty
   - `territoryMode` is set to 'include'
3. When checking worldwide again:
   - Both panels hide
   - Territories remain in their panels (preserved for next toggle)

**Why These Changes Matter:**
- **Territory movement** is essential because users expect dual-panel selectors to work like "source/destination" lists where items move between sides
- **Removing mode toggle** eliminates confusion - the panels themselves are the mode selector
- **Separating interactions** prevents frustration from accidental expansions when users just want to select territories
- **Derived mode** ensures backward compatibility without maintaining redundant state
</implementation>

<output>
Modify existing files:

1. `./src/components/territory/TerritorySelector.tsx` - Fix state management, implement territory movement, remove mode toggle UI, derive territoryMode
2. `./src/components/territory/TerritoryNode.tsx` - Separate checkbox and expand/collapse click handlers
3. `./src/components/territory/TerritoryTree.tsx` - Verify proper event handler separation

No new files needed - this is a refinement of existing components.
</output>

<verification>
Before declaring complete, thoroughly verify:

**1. Territory Movement (Critical)**
- Open the territory selector
- Uncheck "Hungary" from Included panel
- ✅ Verify Hungary immediately appears checked in Excluded panel
- Check "Hungary" in Excluded panel
- ✅ Verify Hungary immediately appears checked in Included panel (unchecked in Excluded)
- Uncheck entire "Europe" continent from Included
- ✅ Verify ALL European countries immediately appear checked in Excluded

**2. Mode Toggle Removed**
- ✅ Verify no Include/Exclude pill toggle is visible
- ✅ Verify no helper text about "available ONLY in" or "EXCEPT for"
- ✅ Verify both panels are always visible (when worldwide is unchecked)

**3. Interaction Separation**
- Click checkbox on "France"
- ✅ Verify France moves to opposite panel
- ✅ Verify continent does NOT expand/collapse
- Click expand/collapse arrow on "Europe"
- ✅ Verify continent expands or collapses
- ✅ Verify NO territories are toggled/moved
- Click checkbox on continent "Asia"
- ✅ Verify all Asian countries move to opposite panel
- ✅ Verify continent does NOT expand/collapse

**4. Data Structure (Backward Compatibility)**
- Select some territories in Included panel
- Check console/props: `data.territories` should contain those territory names
- Check console/props: `data.territoryMode` should be 'include'
- Move all territories to Excluded panel
- Check console/props: `data.territories` should contain those territory names
- Check console/props: `data.territoryMode` should be 'exclude'

**5. Default Behavior**
- Load form with `isWorldwide: true`
- ✅ Verify worldwide checkbox is checked, panels are hidden
- Uncheck worldwide
- ✅ Verify all territories appear in Included panel
- ✅ Verify Excluded panel is empty
- Check worldwide again
- ✅ Verify panels hide, territories remain in their panels

**6. Export Integration**
- Fill out complete form with some territories
- Export to CSV/Excel
- ✅ Verify territory codes appear in correct column (Territory or Excluded Territory)
- ✅ Verify mode is correctly reflected in export

**7. No Regressions**
- ✅ Search functionality still works in both panels
- ✅ Count badges update correctly
- ✅ No TypeScript errors
- ✅ No console errors
- ✅ Application builds successfully
</verification>

<success_criteria>
- Unchecking a territory in one panel immediately shows it checked in the opposite panel
- Checking a territory in one panel immediately removes it from the opposite panel
- Territories are ALWAYS checked on exactly one side, never both, never neither
- Include/Exclude mode toggle UI is completely removed
- Helper text about territory modes is removed
- territoryMode is automatically derived from panel state (included territories → 'include', excluded territories → 'exclude')
- Clicking checkbox ONLY toggles selection, does NOT expand/collapse
- Clicking expand/collapse arrow ONLY expands/collapses, does NOT toggle selection
- All territories default to Included panel when worldwide is unchecked
- Data structure remains compatible with ReleaseData interface
- Export correctly uses territoryMode and territories list
- No TypeScript errors or warnings
- No console errors during operation
- Build succeeds
</success_criteria>
