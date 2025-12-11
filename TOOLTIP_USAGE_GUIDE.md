# Tooltip Usage Guide

## How Tooltips Work

When users hover over the small Info icon (ℹ️) next to any form field label, they'll see a helpful tooltip explaining what the field is for and how to fill it in.

## Visual Example

```
┌─────────────────────────────────────────────────┐
│  Release Title ℹ️ *                             │
│  ┌───────────────────────────────────────────┐  │
│  │ Enter release title                       │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  When hovering over ℹ️:                         │
│  ┌───────────────────────────────────────────┐  │
│  │ This field is Release Title and should    │  │
│  │ be filled in properly                     │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Component Usage

### Basic Usage

```tsx
import { FieldTooltip } from '@/components/ui/FieldTooltip';

// Using predefined field key
<FieldTooltip
  label="ISRC Code"
  fieldKey="isrc"
  htmlFor="isrcCode"
  required
/>
<Input id="isrcCode" ... />
```

### Custom Tooltip Text

```tsx
// Using custom tooltip text
<FieldTooltip
  label="Custom Field"
  tooltipText="This is custom tooltip content"
  htmlFor="customField"
/>
<Input id="customField" ... />
```

### With GenreSelector

```tsx
<GenreSelector
  id="albumGenre"
  label="Album Genre *"
  value={data.albumGenre}
  onValueChange={(value) => updateData({ albumGenre: value })}
  placeholder="Select album genre"
  showTooltip  // Enable tooltip
/>
```

## Editing Tooltip Content

All tooltip text is stored in `/src/lib/tooltipContent.ts`. To update any tooltip:

1. Open the file: `/Users/tom/Desktop/Coding/FormNovember-main07112025/src/lib/tooltipContent.ts`

2. Find the field you want to update in the `tooltipContent` object

3. Replace the placeholder text with proper guidance

### Example Updates

```typescript
// Current placeholder text
isrc: 'This field is ISRC (International Standard Recording Code) and should be filled in properly',

// Example of proper guidance text
isrc: 'International Standard Recording Code - A unique 12-character alphanumeric code that identifies a specific sound recording. Format: CC-XXX-YY-NNNNN (e.g., USRC17607839). You can obtain an ISRC from your national ISRC agency.',

// Another example
upc: 'Universal Product Code - A 12 or 13-digit barcode number for your release. If you don\'t have one, most distributors can provide one for you. Also known as EAN or barcode.',

catalogNumber: 'Catalog Number - Your label\'s internal reference number for this release (e.g., ABC-123, LABEL001). This is optional but helps organize your releases.',
```

### Tips for Writing Good Tooltips

1. **Start with what it is**: Brief definition of the field
2. **Explain the format**: Show expected format or examples
3. **Provide context**: When is it required? Where to get it?
4. **Keep it concise**: Aim for 2-3 sentences maximum
5. **Use examples**: Show real-world examples in parentheses

## Fields with Tooltips

### Release Information
- Release Title, Mix/Version
- Artists (Release, Featured, Remixers)
- Release Date, Original Release Date
- Release Artwork
- Label Name, Genre, Catalog Number, UPC
- Copyright (C-line, P-line)
- Territory settings

### Track Information
- Track Title, Mix/Version
- Audio File
- Artists (Track, Featured, Remixers)
- Contributors (Performers, Composition, Production)
- Publisher, Genre, ISRC, Dolby Atmos
- Language, Explicit Content, Lyrics

## Benefits

✅ **Reduces User Confusion**: Clear explanations for technical terms
✅ **Prevents Errors**: Users understand format requirements before typing
✅ **Improves Data Quality**: Better guidance leads to more accurate data
✅ **Self-Service**: Users don't need to ask support for field explanations
✅ **Professional**: Makes the form look polished and user-friendly
✅ **Accessible**: Works with screen readers and keyboard navigation

## Technical Details

- Built with Radix UI Tooltip primitive (via shadcn/ui)
- Fully typed with TypeScript
- No performance impact (tooltips load on demand)
- Responsive and works on all screen sizes
- Theme-aware (automatically adapts to light/dark mode)
