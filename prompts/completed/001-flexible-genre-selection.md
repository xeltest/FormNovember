<objective>
Modify the existing genre selection mechanism to allow users to select a genre at ANY tier level without being forced to drill down to the deepest sub-genre. For example, selecting "Rock" should be a valid final selection, while users should also have the option to drill down further to "Alternative Rock" or other sub-genres if they choose to.

This improves user experience by respecting that broader genre categories are often sufficient and meaningful, while still providing the option for specificity when desired.
</objective>

<context>
- Current branch: Genre-Mechanism
- Implementation state: Existing drill-down genre selection that needs modification
- Genre hierarchy: Variable depth (different genres have different numbers of sub-levels)
- Current behavior: Forces users to drill down to the deepest level
- Desired behavior: Accept selection at any level, but allow continued drilling
- Data structure: Genres are hardcoded in components

Read the project conventions from @CLAUDE.md if it exists.

Examine these files to understand the current implementation:
- @src/components/ReleaseInfo.tsx
- @src/components/ExportStep.tsx
- @src/pages/Index.tsx

Also check for any genre-related data structures or utilities in the codebase.
</context>

<requirements>
1. **Selection Flexibility**: Users must be able to finalize their genre selection at any tier level
   - Top-level genre (e.g., "Rock") should be valid
   - Mid-level sub-genre (e.g., "Rock > Alternative") should be valid
   - Deepest level (e.g., "Rock > Alternative > Indie Rock") should be valid

2. **User Choice**: When a user selects a genre that has sub-genres, they should be able to:
   - Accept the current selection and proceed
   - Continue drilling down to more specific sub-genres

3. **Data Integrity**: Ensure the selected genre (at whatever level) is properly stored and can be:
   - Displayed correctly in the UI
   - Exported/saved with release information
   - Imported/loaded when viewing existing data

4. **Visual Feedback**: Make it clear to users when:
   - They've made a valid selection
   - Further sub-genres are available (but optional)
   - They're at the deepest level of a genre branch
</requirements>

<implementation>
1. **Analyze Current Implementation**:
   - Understand how the drill-down method currently works
   - Identify where the logic forces users to reach the deepest level
   - Note how genre data is structured (nested objects, arrays, etc.)

2. **Modify Selection Logic**:
   - Add a mechanism to finalize selection at any level (button, double-click, checkmark, etc.)
   - Ensure the "continue drilling" option remains clear and accessible
   - Handle cases where a genre has no sub-genres (terminal nodes)

3. **Update State Management**:
   - Adjust how the selected genre value is stored
   - Consider storing both the display value and the full path if needed
   - Ensure state updates correctly when users change their mind mid-drill

4. **UI/UX Considerations**:
   - Add visual indicators for "this selection is valid" vs "you can go deeper"
   - Consider a "Use this genre" or "Select" button at each level
   - Show breadcrumbs or the current selection path clearly
   - Don't break the existing flow - drilling down should still be intuitive

5. **Testing Edge Cases**:
   - Single-level genres (no sub-genres)
   - Deep hierarchies (3+ levels)
   - Changing selection from deep to shallow level
   - Editing existing releases with saved genres

WHY these constraints matter:
- User flexibility is critical: Some users know exactly what micro-genre they want, others just know "it's rock music"
- Data integrity ensures that when a user selects "Rock", it's stored consistently and can be reliably retrieved
- Visual feedback prevents confusion about whether the selection is "done" or if they need to keep clicking
</implementation>

<verification>
Before declaring complete, verify:
1. Can select a top-level genre (e.g., "Rock") and proceed without errors
2. Can still drill down to sub-genres if desired
3. Selected genre displays correctly in the UI wherever it's shown
4. Genre selection persists correctly (doesn't reset unexpectedly)
5. No console errors or warnings
6. The modification works across all relevant components (ReleaseInfo, ExportStep, etc.)
</verification>

<success_criteria>
- Users can finalize genre selection at ANY tier level
- Drill-down functionality still works for users who want specificity
- Selected genre (at any level) is properly stored and displayed
- UI clearly communicates when a selection is valid and when sub-genres are available
- No breaking changes to existing genre data or functionality
- Code follows existing project patterns and conventions
</success_criteria>
