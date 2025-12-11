# Asset Validation - Quick Start Guide

## TL;DR

Control whether artwork and audio uploads are mandatory using an environment variable.

## Setup (30 seconds)

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Choose your mode:**

   **For Development (skip uploads):**
   ```env
   VITE_ASSETS_MANDATORY=false
   ```

   **For Production (enforce uploads):**
   ```env
   VITE_ASSETS_MANDATORY=true
   ```

3. **Restart your dev server:**
   ```bash
   npm run dev
   ```

## What It Does

### When `VITE_ASSETS_MANDATORY=true` (Mandatory Mode)

- ❌ Can't skip Step 1 without uploading artwork
- ❌ Can't skip Step 2 without uploading audio files
- ❌ Can't export without all assets
- 🟠 Orange warnings show missing files
- 🔴 Required fields marked with asterisk (*)

### When `VITE_ASSETS_MANDATORY=false` (Optional Mode)

- ✅ Skip any uploads
- ✅ Navigate freely
- ✅ Export without files
- No warnings or required indicators

## Visual Guide

### Mandatory Mode - Missing Assets

**Step 1 (Release Info):**
```
┌─────────────────────────────────────┐
│ Release Artwork *                   │
├─────────────────────────────────────┤
│  🔸                                 │
│  Click to upload or drag and drop   │
│  RGB JPG Format 3000 x 3000 pixels  │
│  ⚠️ Artwork is required to proceed  │
└─────────────────────────────────────┘
    (Orange border and background)

┌─────────────────────────────────────┐
│ ⚠️ Required Assets Missing          │
│ Please upload release artwork to    │
│ continue                             │
└─────────────────────────────────────┘

[Previous]              [Next] (disabled)
```

**Step 2 (Track Details):**
```
┌─────────────────────────────────────┐
│ Audio File *                        │
├─────────────────────────────────────┤
│  🔸                                 │
│  Select audio file for this track   │
│  WAV (Minimum 16bit 44.1kHz)        │
│  ⚠️ Audio file is required to       │
│     proceed                          │
└─────────────────────────────────────┘
    (Orange border and background)

┌─────────────────────────────────────┐
│ ⚠️ Required Assets Missing          │
│ Track 1 is missing an audio file    │
└─────────────────────────────────────┘

[Previous]              [Next] (disabled)
```

### Mandatory Mode - All Assets Uploaded

```
┌─────────────────────────────────────┐
│ Release Artwork *                   │
├─────────────────────────────────────┤
│  📤                                 │
│  artwork.jpg                         │
│  RGB JPG Format 3000 x 3000 pixels  │
└─────────────────────────────────────┘
    (Normal border)

[Previous]              [Next] ✅
```

### Optional Mode

```
┌─────────────────────────────────────┐
│ Release Artwork                     │
├─────────────────────────────────────┤
│  📤                                 │
│  Click to upload or drag and drop   │
│  RGB JPG Format 3000 x 3000 pixels  │
└─────────────────────────────────────┘
    (Normal border, no warnings)

[Previous]              [Next] ✅
```

## Testing

### Test Mandatory Mode

```bash
# 1. Set environment
echo "VITE_ASSETS_MANDATORY=true" > .env

# 2. Restart server
npm run dev

# 3. Try to skip artwork on Step 1
#    → Should block with orange warning

# 4. Upload artwork
#    → Should allow progression to Step 2

# 5. Try to skip audio files on Step 2
#    → Should block with orange warning

# 6. Upload all audio files
#    → Should allow progression to Step 3

# 7. Try to export
#    → Should work with all assets present
```

### Test Optional Mode

```bash
# 1. Set environment
echo "VITE_ASSETS_MANDATORY=false" > .env

# 2. Restart server
npm run dev

# 3. Navigate through all steps without uploads
#    → Should work without any blocks

# 4. Export
#    → Should work even without assets
```

## Troubleshooting

### Problem: Changes not taking effect

**Solution:**
```bash
# Kill the dev server (Ctrl+C)
# Verify .env content
cat .env
# Restart
npm run dev
```

### Problem: Always mandatory even when set to false

**Check variable name:**
```bash
# Correct ✅
VITE_ASSETS_MANDATORY=false

# Wrong ❌
ASSETS_MANDATORY=false
VITE_MANDATORY=false
```

### Problem: Build errors

**Solution:**
```bash
# Clear build cache
rm -rf dist node_modules/.vite

# Rebuild
npm run build
```

## Environment Variables Reference

| Variable | Values | Default | Effect |
|----------|--------|---------|--------|
| `VITE_ASSETS_MANDATORY` | `true` | `true` | Assets required |
| `VITE_ASSETS_MANDATORY` | `false` | - | Assets optional |
| Not set | - | `true` | Assets required |

## Production Deployment

### Vercel/Netlify/Similar

Add environment variable in dashboard:
```
VITE_ASSETS_MANDATORY=true
```

### Docker

```dockerfile
ENV VITE_ASSETS_MANDATORY=true
```

### Traditional Server

```bash
export VITE_ASSETS_MANDATORY=true
npm run build
```

## Files Overview

```
/
├── .env                       # Your config (gitignored)
├── .env.example              # Template
├── src/
│   ├── lib/
│   │   └── assetValidation.ts   # Validation logic
│   ├── pages/
│   │   └── Index.tsx            # Navigation validation
│   └── components/
│       ├── ReleaseInfo.tsx      # Artwork indicators
│       ├── ExportStep.tsx       # Export validation
│       └── track/
│           └── TrackMetadataSection.tsx  # Audio indicators
```

## Need More Details?

- **Feature Documentation:** See `ASSET_VALIDATION.md`
- **Implementation Details:** See `IMPLEMENTATION_SUMMARY.md`
- **Code:** Check `/src/lib/assetValidation.ts`

## Summary

- 📁 Copy `.env.example` to `.env`
- ⚙️ Set `VITE_ASSETS_MANDATORY=true` or `false`
- 🔄 Restart dev server
- ✅ Done!

**Default:** Mandatory mode (safe for production)

**Development:** Set to `false` for faster testing

**Production:** Set to `true` to prevent incomplete submissions
