<objective>
Implement client-side file upload validation to restrict audio uploads to .wav format only (no mp3s) and image uploads to jpg/jpeg/png formats with a minimum square aspect ratio of 3000x3000 pixels.

This ensures only high-quality, compatible media files are uploaded before they reach the server, providing immediate user feedback and preventing invalid uploads.
</objective>

<context>
This is a React application using Vite, TypeScript, and Radix UI components with react-hook-form for form management. The file uploads are part of a form component.

Before making changes, read the CLAUDE.md file (if present) for project conventions.

The validation should happen client-side before upload to provide immediate feedback to users and prevent unnecessary upload attempts.
</context>

<requirements>
**Audio Upload Restrictions:**
- Only accept .wav files
- Reject .mp3 and any other audio formats
- Display clear error message when invalid format is selected

**Image Upload Restrictions:**
- Only accept .jpg, .jpeg, and .png files
- Validate that images are square aspect ratio (width === height)
- Validate that images are at least 3000x3000 pixels
- Display clear, specific error messages for:
  - Invalid file type
  - Non-square aspect ratio
  - Dimensions too small (show actual dimensions and required minimum)

**User Experience:**
- Validation should happen immediately when file is selected
- Error messages should be clear and actionable
- Show what was wrong and what is required
- Use existing form validation patterns from react-hook-form
</requirements>

<implementation>
1. Locate the form component(s) containing audio and image file uploads
2. For audio uploads:
   - Add accept=".wav" attribute to file input
   - Add validation function to check file extension
   - Ensure MIME type validation if possible (audio/wav, audio/x-wav)

3. For image uploads:
   - Add accept=".jpg,.jpeg,.png" attribute to file input
   - Create validation function that:
     - Checks file extension and MIME type
     - Loads the image to get actual dimensions
     - Validates width === height (square aspect ratio)
     - Validates both width and height >= 3000

4. Integrate with react-hook-form validation:
   - Use the validation prop or custom validation rules
   - Set appropriate error messages
   - Ensure errors display in the UI using existing error display patterns

5. Handle edge cases:
   - File not selected
   - File load errors
   - Invalid MIME types even with correct extension

**Why these restrictions matter:**
- Client-side validation provides immediate feedback, improving UX and preventing unnecessary server load
- File extension alone isn't enough - MIME type validation adds security
- Image dimension checking requires actually loading the image, which is async
- Square aspect ratio ensures consistent display/processing
</implementation>

<research>
Search the codebase to find:
- File upload components (search for: input type="file", file upload, FileUpload)
- Form components using react-hook-form
- Existing validation patterns and error display components
- Any existing file validation utilities
</research>

<output>
Modify the relevant form component files with the validation logic.

If creating shared validation utilities, save to:
- `./src/utils/fileValidation.ts` or similar appropriate location based on project structure
</output>

<verification>
Before declaring complete, verify your work:
1. Test audio upload accepts .wav files
2. Test audio upload rejects .mp3 files with clear error
3. Test image upload accepts jpg/jpeg/png files
4. Test image upload rejects other formats
5. Test image upload rejects non-square images with specific error showing dimensions
6. Test image upload rejects images smaller than 3000x3000 with specific error
7. Test image upload accepts valid square images 3000x3000 or larger
8. Verify error messages are clear and actionable
9. Verify validation happens before any upload/submission
</verification>

<success_criteria>
- Audio file input only accepts .wav files
- Image file input only accepts .jpg/.jpeg/.png files
- Images are validated for square aspect ratio (width === height)
- Images are validated for minimum dimensions (3000x3000)
- All validation errors display clear, specific messages
- Validation happens client-side before upload
- User experience is smooth with immediate feedback
</success_criteria>
