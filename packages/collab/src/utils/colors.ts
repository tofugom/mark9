/**
 * Predefined palette of distinguishable colours for collaborator cursors.
 * Chosen for readability on both light and dark backgrounds.
 */
const PALETTE = [
  "#f44336", // red
  "#e91e63", // pink
  "#9c27b0", // purple
  "#673ab7", // deep purple
  "#3f51b5", // indigo
  "#2196f3", // blue
  "#009688", // teal
  "#4caf50", // green
  "#ff9800", // orange
  "#795548", // brown
  "#607d8b", // blue grey
  "#00bcd4", // cyan
] as const;

/**
 * Deterministic colour assignment based on a user name.
 * The same name always produces the same colour.
 */
export function assignColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}
