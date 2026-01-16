<!-- Completed: 2026-01-16 -->
<!-- Status: SUCCESS -->
<!-- Files modified: src/components/GenreSelector.tsx -->

<objective>
Add a search/filter input above the existing genre selector that allows users to quickly find genres by typing, without having to drill down through the hierarchy. Typing "tec" should show Techno, Tech House, etc. Typing "Roc" should show Rock and any genre containing "Rock".
</objective>

<context>
The app has a `GenreSelector` component at `src/components/GenreSelector.tsx` that provides hierarchical genre selection through 3 levels of dropdowns.

The genre data is in `src/constants/genres.ts` as a nested tree structure (GENRES constant) with a `findGenreByLabel` helper function.

Users currently must drill down through categories (e.g., Electronic → House → Tech House), but want the ability to type and search directly.
</context>

<requirements>
1. Add a text input above the existing dropdowns for search/filter functionality
2. As the user types, show a dropdown list of matching genres (case-insensitive partial match)
3. Match against all genres at any level of the hierarchy (leaf nodes and parent nodes)
4. Show the full path in results for context (e.g., "Tech House (Electronic > House > Tech House)")
5. When user selects a search result:
   - Populate the hierarchical selectors appropriately (set level1, level2, level3 based on selection)
   - Call `onValueChange` with the genre label (same behavior as current)
6. Keep the existing drill-down functionality - search is an addition, not a replacement
7. Clear search input when a result is selected
8. Show "No matching genres" message when search has no results
</requirements>

<implementation>
1. Create a helper function to flatten all genres into a searchable list with paths:
```typescript
const flattenGenres = (genres: GenreNode[], path: string[] = []): Array<{label: string, path: string[], id: string, parentIds: string[]}> => {...}
```

2. Add state for search:
```typescript
const [searchTerm, setSearchTerm] = useState('');
const [searchResults, setSearchResults] = useState<...>([]);
const [showSearchResults, setShowSearchResults] = useState(false);
```

3. Filter genres on search term change (debounce optional but nice)

4. Render search input with results dropdown above the existing selects

5. On result selection, set the appropriate level selections and trigger value change
</implementation>

<ui_guidelines>
- Search input should have a search icon and placeholder "Search genres..."
- Results dropdown should appear below the input when typing
- Results should show the genre name prominently with the path in smaller text
- Highlight matching text in results if possible
- Close dropdown when clicking outside or pressing Escape
- Style consistently with existing component (use existing UI components from @/components/ui)
</ui_guidelines>

<output>
Modify `./src/components/GenreSelector.tsx`:
- Add search input UI
- Add search/filter logic
- Add results dropdown
- Integrate with existing selection mechanism
</output>

<verification>
After changes:
1. Typing "tec" shows Techno, Tech House, and any other genres containing "tec"
2. Typing "Roc" shows Rock and related genres
3. Selecting a search result correctly sets the hierarchical dropdowns
4. The existing drill-down still works independently
5. No TypeScript errors
6. Search results close when a selection is made
</verification>
