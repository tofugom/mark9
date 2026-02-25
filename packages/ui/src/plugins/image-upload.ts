/**
 * Utilities for handling image file uploads in the editor.
 *
 * For web-based usage (no server), images are converted to base64 data URLs.
 */

/**
 * Convert a File object to a base64 data URL string.
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Check whether the given file is an image based on its MIME type.
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}
