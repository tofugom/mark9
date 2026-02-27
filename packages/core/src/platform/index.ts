/**
 * Platform detection and abstraction.
 *
 * Detects whether the app is running inside an Electrobun desktop
 * webview or a regular web browser.
 */

/**
 * Returns true if running inside Electrobun desktop app.
 * Electrobun injects a global `electrobun` object into the webview.
 */
export function isDesktop(): boolean {
  return (
    typeof window !== "undefined" &&
    "electrobun" in window
  );
}

/**
 * Returns true if running in a regular web browser.
 */
export function isWeb(): boolean {
  return !isDesktop();
}
