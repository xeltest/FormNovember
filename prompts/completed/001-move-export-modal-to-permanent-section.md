<objective>
Add a persistent information section to the ExportStep component that's always visible on the export page, alongside the existing success modal. This ensures users can always access important post-export instructions (submission email, pitch form, resources, support contact) even after dismissing the modal.
</objective>

<context>
This is a React/TypeScript component using shadcn/ui components (Card, Dialog, Button). The current implementation shows critical post-export information in a modal Dialog after export, but once dismissed, this information becomes unavailable. The modal provides good immediate feedback, but we also need persistent access to these instructions.

@src/components/ExportStep.tsx
</context>

<requirements>
1. Keep the existing modal infrastructure intact:
   - DO NOT remove `showSuccessModal` state or the Dialog component
   - The modal should continue to appear after successful export
   - All existing modal functionality remains unchanged

2. Add a NEW permanent information Card section that includes the same information as the modal:
   - Title: "Submission Instructions" or similar (with an appropriate icon)
   - Submission email: submissions@xelondigital.com
   - Pitch form link using `buildPitchFormUrl()` function
   - Resources link: https://drive.google.com/file/d/1sK3GYvMjf7P7eM5EXTaHtPo8Z3sh84hi/view?usp=sharing
   - Support contact: support@xelondigital.com
   - Encouraging message: "We can't wait to get to work on your release!"

3. Position the new Card section logically on the page - either before or after the Export Actions section

4. Style consistently with existing Card components on the page, using the orange color scheme where appropriate

5. BONUS: Remove the non-functional "Back to Tracks" button (lines 1071-1074) if present, as it has no onClick handler
</requirements>

<implementation>
- Use Card, CardHeader, CardTitle, CardContent components for consistency
- The permanent Card should duplicate the modal's content in a persistent format
- Keep links functional with proper target="_blank" and rel="noopener noreferrer" attributes
- Ensure the section is always visible (not conditionally rendered)
- Consider using an Info or Mail icon from lucide-react for visual consistency
- Both the modal AND the permanent section will coexist - users get immediate feedback via modal, plus always-available reference via the Card
</implementation>

<output>
Modify the existing file:
- `./src/components/ExportStep.tsx` - Add permanent Card section while keeping existing modal
</output>

<verification>
Before declaring complete, verify:
1. The component compiles without TypeScript errors
2. The existing success modal still appears and functions correctly
3. The new permanent Card section is always visible on the export page
4. Both the modal and the Card contain the same submission information
5. All links in both sections are functional and open in new tabs
6. The styling of the new Card matches other Card components on the page
</verification>

<success_criteria>
- Existing modal Dialog remains functional and unchanged
- New permanent Card section created with all submission information
- Information is available both via modal (immediate feedback) and Card (persistent reference)
- Component maintains visual consistency with the rest of the page
- No TypeScript or runtime errors
</success_criteria>
