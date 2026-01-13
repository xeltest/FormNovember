/**
 * File validation utilities for audio and image uploads
 * Provides client-side validation before upload
 */

export interface FileValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

// ============================================================================
// AUDIO FILE VALIDATION
// ============================================================================

/**
 * Validate audio file format - only .wav files allowed
 */
export const validateAudioFile = (file: File): FileValidationResult => {
  // Check file extension
  const fileName = file.name.toLowerCase();
  const hasWavExtension = fileName.endsWith('.wav');

  if (!hasWavExtension) {
    return {
      isValid: false,
      errorMessage: 'Invalid audio format. Only WAV files are accepted. MP3 and other formats are not supported.'
    };
  }

  // Check MIME type (audio/wav or audio/x-wav)
  const validMimeTypes = ['audio/wav', 'audio/x-wav', 'audio/wave'];
  const hasSupportedMimeType = validMimeTypes.includes(file.type.toLowerCase());

  if (!hasSupportedMimeType && file.type !== '') {
    // Some browsers don't set MIME type correctly, so only warn if type is set but wrong
    return {
      isValid: false,
      errorMessage: 'Invalid audio format. Only WAV files are accepted. The selected file may not be a valid WAV file.'
    };
  }

  return { isValid: true };
};

// ============================================================================
// IMAGE FILE VALIDATION
// ============================================================================

/**
 * Get image dimensions by loading the image
 * Returns a promise with width and height
 */
export const getImageDimensions = (file: File): Promise<ImageDimensions> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
};

/**
 * Validate image file format and dimensions
 * Requirements:
 * - Only .jpg, .jpeg, .png formats
 * - Square aspect ratio (width === height)
 * - Minimum dimensions: 3000x3000 pixels
 */
export const validateImageFile = async (file: File): Promise<FileValidationResult> => {
  // Check file extension
  const fileName = file.name.toLowerCase();
  const validExtensions = ['.jpg', '.jpeg', '.png'];
  const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));

  if (!hasValidExtension) {
    return {
      isValid: false,
      errorMessage: 'Invalid image format. Only JPG, JPEG, and PNG files are accepted.'
    };
  }

  // Check MIME type
  const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const hasSupportedMimeType = validMimeTypes.includes(file.type.toLowerCase());

  if (!hasSupportedMimeType) {
    return {
      isValid: false,
      errorMessage: 'Invalid image format. Only JPG, JPEG, and PNG files are accepted.'
    };
  }

  // Load image and check dimensions
  try {
    const dimensions = await getImageDimensions(file);

    // Check if square (width === height)
    if (dimensions.width !== dimensions.height) {
      return {
        isValid: false,
        errorMessage: `Image must have a square aspect ratio. Current dimensions: ${dimensions.width}x${dimensions.height} pixels. Please use an image where width equals height.`
      };
    }

    // Check minimum size (3000x3000)
    const minSize = 3000;
    if (dimensions.width < minSize || dimensions.height < minSize) {
      return {
        isValid: false,
        errorMessage: `Image dimensions are too small. Current: ${dimensions.width}x${dimensions.height} pixels. Required: At least ${minSize}x${minSize} pixels.`
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      errorMessage: 'Failed to load or validate image. Please ensure the file is a valid image.'
    };
  }
};

/**
 * Validate image file format only (without dimension check)
 * Used for initial file selection before async dimension validation
 */
export const validateImageFileFormat = (file: File): FileValidationResult => {
  // Check file extension
  const fileName = file.name.toLowerCase();
  const validExtensions = ['.jpg', '.jpeg', '.png'];
  const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));

  if (!hasValidExtension) {
    return {
      isValid: false,
      errorMessage: 'Invalid image format. Only JPG, JPEG, and PNG files are accepted.'
    };
  }

  // Check MIME type
  const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const hasSupportedMimeType = validMimeTypes.includes(file.type.toLowerCase());

  if (!hasSupportedMimeType) {
    return {
      isValid: false,
      errorMessage: 'Invalid image format. Only JPG, JPEG, and PNG files are accepted.'
    };
  }

  return { isValid: true };
};
