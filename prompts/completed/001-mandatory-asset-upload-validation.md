<objective>
Implement a validation system that makes artwork and audio file uploads mandatory before users can progress through the workflow or submit/export their work. This should be controlled by an environment variable (ASSETS_MANDATORY) to allow toggling between mandatory and optional modes across different environments.

The end goal is to ensure users don't accidentally skip critical asset uploads in production while maintaining flexibility for development and testing scenarios.
</objective>

<context>
This is a form/workflow application where users upload artwork and audio files as part of their release process. Currently, these uploads appear to be optional, but there's a need to enforce them in certain environments (like production) while keeping them flexible in others (like development).

Review the following to understand the current implementation:
- Existing upload components for artwork and audio files
- Current navigation/step progression logic
- Form submission or export functionality
- Any existing validation patterns in the codebase

Check if there's already an .env file or environment configuration setup.
</context>

<requirements>
1. **Environment Variable Setup**:
   - Add `ASSETS_MANDATORY` environment variable (or similar naming convention that fits your project)
   - Default value should be `true` (mandatory mode by default)
   - Must be accessible throughout the application

2. **Validation Logic**:
   - Check if artwork file is uploaded
   - Check if audio file(s) are uploaded
   - Only enforce validation when `ASSETS_MANDATORY=true`
   - When `ASSETS_MANDATORY=false`, allow progression without assets

3. **Validation Points** (implement at BOTH locations):
   - **Step Navigation**: Prevent users from advancing to the next step without required assets
   - **Final Submission/Export**: Block final submission or export action if assets are missing

4. **User Feedback** when validation fails:
   - **Visual Indicators**: Highlight or mark the upload fields that are missing/incomplete
   - **Disabled Actions**: Disable the "Next" button, "Submit" button, or "Export" button until validation passes
   - **Clear Messaging**: Display a message explaining which assets are required

5. **Behavior when validation passes**:
   - Enable all progression/submission buttons
   - Remove visual warning indicators
   - Allow normal workflow continuation
</requirements>

<implementation>
**Approach:**
- Read environment variables using your project's established pattern (check existing env usage in the codebase)
- Create a validation helper function that checks both artwork and audio upload status
- Integrate validation into existing navigation and submission handlers
- Use existing UI patterns for showing validation errors and disabled states

**What to avoid and WHY:**
- Don't hardcode the mandatory behavior - the whole point is environment-based control, so always check the env variable
- Don't create a new validation pattern if one already exists in the codebase - maintain consistency with existing validation approaches
- Don't silently fail - users must clearly understand WHY they can't progress (provide explicit feedback)
- Avoid breaking existing optional mode - when ASSETS_MANDATORY=false, the workflow should function exactly as it does now
</implementation>

<output>
Modify the following files (or create if they don't exist):
- `.env` or `.env.example` - Add the ASSETS_MANDATORY variable with default value
- Environment configuration file - Ensure the variable is loaded and accessible
- Upload validation logic - Create or update validation function
- Navigation/step component - Integrate validation at progression points
- Submission/export component - Integrate validation at final action point
- UI components - Add visual indicators for missing assets and disabled states

If relevant configuration files don't exist, create them following the project's established patterns.
</output>

<verification>
Before declaring complete, verify your implementation:

1. **Test Mandatory Mode (ASSETS_MANDATORY=true)**:
   - Attempt to navigate to next step without uploading artwork - should be blocked with clear feedback
   - Attempt to navigate to next step without uploading audio - should be blocked with clear feedback
   - Attempt final submission without assets - should be blocked
   - Upload both assets - navigation and submission should work normally

2. **Test Optional Mode (ASSETS_MANDATORY=false)**:
   - Should be able to navigate and submit WITHOUT uploading any assets
   - No validation errors or disabled buttons

3. **Visual Feedback**:
   - Missing asset fields are clearly highlighted when validation fails
   - Relevant buttons (Next, Submit, Export) are visually disabled when validation fails
   - User sees a clear message about what's required

4. **Code Quality**:
   - Environment variable is properly loaded and accessible
   - Validation logic is DRY (not duplicated across navigation and submission)
   - Follows existing patterns in the codebase for validation and error handling
</verification>

<success_criteria>
- ASSETS_MANDATORY environment variable is properly configured with default value of true
- Validation successfully blocks step navigation when assets are missing (in mandatory mode)
- Validation successfully blocks final submission/export when assets are missing (in mandatory mode)
- Visual indicators clearly show which assets are missing
- Action buttons are disabled when validation fails
- When ASSETS_MANDATORY=false, workflow functions without asset validation
- User receives clear feedback about why they cannot proceed
- Implementation follows existing project patterns and conventions
</success_criteria>
